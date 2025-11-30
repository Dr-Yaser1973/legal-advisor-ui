 // app/api/translation/extract/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import pdfParse from "pdf-parse";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs"; // نحتاج بيئة Node لاستخدام fs

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "لم يتم استلام أي ملف" },
        { status: 400 }
      );
    }

    // نحول الملف إلى Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // استخراج النص من PDF (أو أي منطق مستخدم عندك)
    const result = await pdfParse(buffer);
    const text = result.text || "";

    // حفظ الملف على القرص (اختياري لكن مهم لمكاتب الترجمة)
    const uploadsDir = path.join(process.cwd(), "uploads", "translation");
    await fs.mkdir(uploadsDir, { recursive: true });

    const storedName =
      Date.now().toString() + "-" + file.name.replace(/\s+/g, "_");
    const diskPath = path.join(uploadsDir, storedName);
    await fs.writeFile(diskPath, buffer);

    // إنشاء سجل في LegalDocument وفق السكيمة النهائية
    const doc = await prisma.legalDocument.create({
      data: {
        title: file.name,                            // اسم الملف الأصلي كعنوان
        filename: storedName,                        // الاسم المخزَّن على القرص
        mimetype: file.type || "application/pdf",
        size: buffer.length,
      },
    });

    // نرجع النص + documentId للواجهة
    return NextResponse.json({
      ok: true,
      text,
      documentId: doc.id,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "فشل استخراج النص من الملف" },
      { status: 500 }
    );
  }
}
