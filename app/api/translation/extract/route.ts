 // app/api/translation/extract/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SOURCE_BUCKET = "library-documents";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    // 1️⃣ تحقق من الملف
    if (!file || typeof file === "string" || file.size === 0) {
      return NextResponse.json(
        { ok: false, error: "ملف غير صالح" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { ok: false, error: "الملف كبير جداً (الحد الأقصى 5MB)" },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const originalFileName = file.name || "document";
    const contentType = file.type.toLowerCase();

    // 2️⃣ استخراج النص
    let text = "";

    if (contentType === "application/pdf" || originalFileName.endsWith(".pdf")) {
      const pdfParse = (await import("pdf-parse")).default;
      const result = await pdfParse(buffer);
      text = result.text || "";
    } else if (
      contentType.includes("officedocument.wordprocessingml.document") ||
      originalFileName.endsWith(".docx")
    ) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value || "";
    } else {
      return NextResponse.json(
        { ok: false, error: "نوع الملف غير مدعوم" },
        { status: 415 }
      );
    }

    text = text.trim();
    if (!text) {
      return NextResponse.json(
        { ok: false, error: "المستند فارغ أو عبارة عن صور فقط" },
        { status: 422 }
      );
    }

    // 3️⃣ تجهيز اسم ومسار الملف (آمن 100%)
    const safeFileName = originalFileName.replace(/[^\w.-]+/g, "_");
    const filePath = `translation/source/${Date.now()}-${safeFileName}`;

    // 4️⃣ رفع الملف الأصلي إلى Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from(SOURCE_BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("❌ Supabase upload error:", uploadError);
      throw uploadError;
    }

    // 5️⃣ حفظ سجل المستند في قاعدة البيانات
    const doc = await prisma.legalDocument.create({
      data: {
        title: originalFileName,
        filename: originalFileName,
        mimetype: contentType,
        size: file.size,
        filePath, // ⭐ مهم لمكتب الترجمة
      },
    });

    // 6️⃣ الاستجابة النهائية
    return NextResponse.json({
      ok: true,
      text,
      documentId: doc.id,
      fileName: originalFileName,
    });
  } catch (err: any) {
    console.error("🔥 extract error:", err);

    return NextResponse.json(
      {
        ok: false,
        error: "خطأ داخلي في الخادم",
        debug: err?.message || err,
      },
      { status: 500 }
    );
  }
}
