 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import { extname, join } from "path";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "الملف مفقود" }, { status: 400 });
    if (file.type !== "application/pdf")
      return NextResponse.json({ error: "الملف يجب أن يكون PDF" }, { status: 400 });

    const title = ((form.get("title") as string) || file.name.replace(/\.pdf$/i, "")).trim();
    const jurisdiction = ((form.get("jurisdiction") as string) || "العراق").trim();
    const category = ((form.get("category") as string) || "").trim(); // LAW | FIQH | ACADEMIC_STUDY | ""
    const text = ((form.get("text") as string) || "").trim() || null;

    // 1) حفظ الملف في /public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const id = crypto.randomBytes(8).toString("hex");
    const filename = `${id}${extname(file.name) || ".pdf"}`;
    await writeFile(join(uploadsDir, filename), buffer);

    // 2) تسجيله في LegalDocument
    const legalDoc = await prisma.legalDocument.create({
      data: {
        title,
        filename,
        mimetype: file.type,
        size: buffer.length,
      },
      select: { id: true },
    });

    // 3) (اختياري) إنشاء LawDoc إن اختير تصنيف (Enum)
    if (category) {
      await prisma.lawDoc.create({
        data: {
          title,
          jurisdiction,
          category: category as any, // LAW | FIQH | ACADEMIC_STUDY
          text,
        },
      });
    }

    return NextResponse.json({ ok: true, legalDocumentId: legalDoc.id }, { status: 201 });
  } catch (err: any) {
    console.error("upload error:", err);
    return NextResponse.json({ error: err?.message || "فشل الرفع" }, { status: 500 });
  }
}
