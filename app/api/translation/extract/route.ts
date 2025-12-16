 // app/api/translation/extract/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || typeof file === "string" || file.size === 0) {
      return NextResponse.json({ ok: false, error: "ملف غير صالح" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ ok: false, error: "الملف كبير جداً (الحد الأقصى 5MB)" }, { status: 413 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file.name || "document";
    const contentType = file.type.toLowerCase();

    let text = "";

    if (contentType === "application/pdf" || fileName.endsWith(".pdf")) {
      try {
        const pdfParse = (await import("pdf-parse")).default;
        const result = await pdfParse(buffer);
        text = result.text || "";
      } catch (pdfError) {
        return NextResponse.json({ ok: false, error: "فشل استخراج النص من ملف PDF" }, { status: 422 });
      }
    } else if (contentType.includes("officedocument.wordprocessingml.document") || fileName.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value || "";
    } else {
      return NextResponse.json({ ok: false, error: "نوع الملف غير مدعوم" }, { status: 415 });
    }

    text = text.trim();
    if (!text) {
      return NextResponse.json({ ok: false, error: "المستند فارغ أو عبارة عن صور فقط" }, { status: 422 });
    }

    // إنشاء سجل LegalDocument — بدون clientId لأن السكيمة لا تحتوي عليه
    const doc = await prisma.legalDocument.create({
      data: {
        title: fileName,
        filename: fileName,
        mimetype: contentType,
        size: file.size,
      },
    });

    return NextResponse.json({
      ok: true,
      text,
      documentId: doc.id,
      fileName,
    });

  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "خطأ داخلي في الخادم", details: err.message },
      { status: 500 }
    );
  }
}
