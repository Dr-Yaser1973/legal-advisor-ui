 // app/api/translation/extract/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import pdfParse from "pdf-parse";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs"; // نستخدم بيئة Node لاستخدام fs/Buffer

export async function POST(req: NextRequest) {
  try {
    // 1) قراءة الـ FormData القادمة من الواجهة
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "لم يتم استلام أي ملف صالح" },
        { status: 400 }
      );
    }

    // 2) تحويل الملف إلى Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mime = file.type || "application/octet-stream";

    // 3) استخراج النص
    let text = "";

    // إذا كان PDF نستخدم pdf-parse
    if (mime.includes("pdf") || file.name.toLowerCase().endsWith(".pdf")) {
      try {
        const result = await pdfParse(buffer);
        text = result.text || "";
      } catch (err) {
        console.error("pdf-parse error:", err);
        return NextResponse.json(
          { error: "تعذّر استخراج النص من ملف الـ PDF" },
          { status: 500 }
        );
      }
    }
    // إذا كان TXT أو نص عادي نقرأه كسلسلة
    else if (
      mime.startsWith("text/") ||
      file.name.toLowerCase().endsWith(".txt")
    ) {
      text = buffer.toString("utf-8");
    } else {
      // نوع ملف غير مدعوم
      return NextResponse.json(
        { error: "نوع الملف غير مدعوم، الرجاء رفع PDF أو TXT" },
        { status: 400 }
      );
    }

    // 4) حفظ الملف في مجلد عام داخل public
    const uploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "translation"
    );
    await fs.mkdir(uploadsDir, { recursive: true });

    const safeOriginalName = file.name.replace(/\s+/g, "_");
    const storedName = `${Date.now()}-${safeOriginalName}`;
    const diskPath = path.join(uploadsDir, storedName);

    await fs.writeFile(diskPath, buffer);

    // 5) إنشاء سجل في LegalDocument حسب السكيمة التي أرسلتها
    const doc = await prisma.legalDocument.create({
      data: {
        title: file.name,      // اسم الملف الأصلي
        filename: storedName,  // الاسم المخزَّن (اختياري في السكيمة لكن مفيد)
        mimetype: mime,        // إجباري في السكيمة
        size: buffer.length,   // إجباري في السكيمة
      },
    });

    // 6) نرجع النص + documentId للواجهة
    return NextResponse.json({
      ok: true,
      text,
      documentId: doc.id,
      // يمكن لاحقًا استخدام هذا الرابط للعرض أو التحميل:
      fileUrl: `/uploads/translation/${storedName}`,
    });
  } catch (e) {
    console.error("translation/extract error:", e);
    return NextResponse.json(
      { error: "فشل استخراج النص من الملف (خطأ في الخادم)" },
      { status: 500 }
    );
  }
}
