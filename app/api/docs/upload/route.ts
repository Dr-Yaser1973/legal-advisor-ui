 // app/api/docs/upload/route.ts
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { parseLawText } from "@/lib/lawParser";
import { splitIntoChunks } from "@/lib/chunks";
import { LawCategory } from "@prisma/client"; // 👈 جديد

export const runtime = "nodejs";

function assert(cond: any, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function resolveUploadPath(filename: string) {
  return path.join(process.cwd(), "public", "uploads", "docs", filename);
}

export async function POST(req: Request) {
  try {
    // 🔐 تأكيد أن المستخدم ADMIN
    const session: any = await getServerSession(authOptions as any);
    const role = session?.user?.role?.toUpperCase?.() || "LAWYER";

    if (!session || role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مخول. يتطلب صلاحية ADMIN." },
        { status: 403 },
      );
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;
    const title = (form.get("title") as string | null) ?? "";
    const jurisdiction = (form.get("jurisdiction") as string | null) ?? "العراق";

    // 👈 نقرأ القيمة كـ string ثم نحولها لـ LawCategory
    const categoryRaw = (form.get("category") as string | null) ?? "LAW";
    const upper = categoryRaw.toUpperCase();

    // لو جاءت قيمة غريبة نرجّعها إلى LAW
    const category: LawCategory =
      upper === "FIQH"
        ? LawCategory.FIQH
        : upper === "ACADEMIC_STUDY"
        ? LawCategory.ACADEMIC_STUDY
        : LawCategory.LAW;

    const yearRaw = form.get("year") as string | null;
    const autoLawDoc = (form.get("autoLawDoc") as string | null) === "true";

    assert(file, "ملف PDF مطلوب.");
    assert(title.trim().length > 0, "العنوان مطلوب.");

    const mime = file.type || "application/pdf";
    assert(
      mime === "application/pdf",
      "فقط ملفات PDF مدعومة في الوقت الحالي.",
    );

    const year =
      yearRaw && yearRaw.trim()
        ? Number(yearRaw)
        : null;

    const arrayBuf = await file.arrayBuffer();
    const buf = Buffer.from(arrayBuf);

    // 🗂 حفظ الملف في مجلد public/uploads/docs
    const ext = ".pdf";
    const safeName = `${Date.now()}_${randomUUID()}${ext}`;
    const absPath = resolveUploadPath(safeName);

    await fs.mkdir(path.dirname(absPath), { recursive: true });
    await fs.writeFile(absPath, buf);

    // 📄 إنشاء سجل LegalDocument
    const legalDoc = await prisma.legalDocument.create({
      data: {
        title,
        filename: `/uploads/docs/${safeName}`,
        mimetype: mime,
        size: buf.length,
      },
    });

    let extractedText = "";

    // 🧠 استخراج النص من PDF
    try {
      const { extractPdfText } = await import("@/lib/pdf");
      extractedText = await extractPdfText(buf);
    } catch (err) {
      console.warn("extractPdfText failed", err);
    }

    // ✍️ إنشاء LawDoc + LawArticle (اختياريًا)
    let lawDocId: number | null = null;

    if (autoLawDoc && extractedText && extractedText.trim().length > 0) {
      const doc = await prisma.lawDoc.create({
        data: {
          title,
          jurisdiction,
          category, // 👈 الآن نوعه LawCategory صحيح
          year,
          text: extractedText,
          filePath: `/uploads/docs/${safeName}`,
        },
      });

      lawDocId = doc.id;

      const articles = parseLawText(extractedText);

      if (articles.length > 0) {
        await prisma.lawArticle.createMany({
          data: articles.map((a, idx) => ({
            lawDocId: doc.id,
            ordinal: a.ordinal ?? idx + 1,
            number: a.number ?? null,
            text: a.text,
          })),
        });
      }
    }

    // 🔎 تجهيز مقاطع RAG في LegalDocChunk
    if (extractedText && extractedText.trim().length > 0) {
      const chunks = splitIntoChunks(extractedText, 900);

      if (chunks.length > 0) {
        await prisma.legalDocChunk.createMany({
          data: chunks.map((c, idx) => ({
            documentId: legalDoc.id,
            idx,
            text: c,
          })),
        });
      }
    }

    return NextResponse.json(
      {
        ok: true,
        legalDocumentId: legalDoc.id,
        lawDocId,
      },
      { status: 201 },
    );
  } catch (e: any) {
    console.error("docs/upload error:", e);
    return NextResponse.json(
      { error: e?.message ?? "فشل رفع الملف" },
      { status: 500 },
    );
  }
}
