 // app/api/translation/extract/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import pdfParse from "pdf-parse";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "لم يتم استلام أي ملف صالح" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mime = file.type || "application/octet-stream";

    // 1) استخراج النص (PDF أو TXT)
    let text = "";

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
    } else if (
      mime.startsWith("text/") ||
      file.name.toLowerCase().endsWith(".txt")
    ) {
      text = buffer.toString("utf-8");
    } else {
      return NextResponse.json(
        { error: "نوع الملف غير مدعوم، الرجاء رفع PDF أو TXT" },
        { status: 400 }
      );
    }

    // 2) تحديد مسار الحفظ
    // على Vercel نستخدم /tmp لأنه المسار الوحيد القابل للكتابة
    const isVercel = !!process.env.VERCEL;

    let storedName: string | null = null;
    let fileUrl: string | null = null;

    try {
      const safeOriginalName = file.name.replace(/\s+/g, "_");
      storedName = `${Date.now()}-${safeOriginalName}`;

      const baseDir = isVercel
        ? path.join("/tmp") // لا يمكن خدمته للجمهور، لكنه يصلح للتخزين المؤقت
        : path.join(process.cwd(), "public"); // محليًا فقط

      const uploadsDir = path.join(baseDir, "uploads", "translation");
      await fs.mkdir(uploadsDir, { recursive: true });

      const diskPath = path.join(uploadsDir, storedName);
      await fs.writeFile(diskPath, buffer);

      // رابط عام فقط في البيئة المحلية (على Vercel هذا لن يكون متاحًا من /tmp)
      if (!isVercel) {
        fileUrl = `/uploads/translation/${storedName}`;
      }
    } catch (fileErr) {
      // مهم: لا نكسر العملية لو فشل الحفظ، طالما استطعنا استخراج النص
      console.error("file save error:", fileErr);
      storedName = null;
      fileUrl = null;
    }

    // 3) إنشاء سجل LegalDocument حسب السكيمة التي أرسلتها
    const doc = await prisma.legalDocument.create({
      data: {
        title: file.name,
        filename: storedName,   // يمكن أن يكون null إذا لم نستطع الحفظ
        mimetype: mime,
        size: buffer.length,
      },
    });

    // 4) إرجاع النتيجة للواجهة
    return NextResponse.json({
      ok: true,
      text,
      documentId: doc.id,
      fileUrl, // غالبًا يكون null على Vercel حالياً
    });
  } catch (e) {
    console.error("translation/extract error:", e);
    return NextResponse.json(
      { error: "فشل استخراج النص من الملف (خطأ في الخادم)" },
      { status: 500 }
    );
  }
}
