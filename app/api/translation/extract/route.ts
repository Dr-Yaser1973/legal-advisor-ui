 // app/api/translation/extract/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // مهم لأننا نستخدم Buffer ومكتبات Node

// حد أقصى لحجم الملف (5 ميغابايت مثلاً)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    // 1) نقرأ FormData بدلاً من json()
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { ok: false, error: "لم يتم إرسال أي ملف إلى الخادم" },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { ok: false, error: "الملف فارغ، لا يحتوي أي بيانات" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          ok: false,
          error: "الملف كبير جدًا، الرجاء اختيار ملف بحجم أقل (5 ميغابايت أو أقل).",
        },
        { status: 413 }
      );
    }

    // 2) نحول File إلى Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = file.name || "document";
    const contentType = (file.type || "").toLowerCase();

    let text = "";

    // 3) نحدد نوع الملف (PDF أو DOCX) ونستخرج النص
    if (
      contentType === "application/pdf" ||
      fileName.toLowerCase().endsWith(".pdf")
    ) {
      const pdfParse = (await import("pdf-parse")).default;
      const result = await pdfParse(buffer);
      text = (result.text || "").trim();
    } else if (
      contentType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.toLowerCase().endsWith(".docx")
    ) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = (result.value || "").trim();
    } else {
      return NextResponse.json(
        {
          ok: false,
          error:
            "نوع الملف غير مدعوم. حاليًا ندعم ملفات PDF و DOCX فقط للترجمة الذكية.",
        },
        { status: 415 }
      );
    }

    // 4) لو النص فارغ، غالبًا PDF عبارة عن صور فقط (scan)
    if (!text) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "تعذر استخراج نص من الملف. يبدو أن الملف لا يحتوي نصًا قابلاً للقراءة (ربما صور فقط).",
        },
        { status: 422 }
      );
    }

    // 5) نرجع النص المستخرج
    return NextResponse.json(
      {
        ok: true,
        text,
        fileName,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ translation extract error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "حدث خطأ غير متوقع أثناء استخراج النص من الملف.",
      },
      { status: 500 }
    );
  }
}
