import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const engine = process.env.OCR_ENGINE || "tesseract";
    const lang = process.env.OCR_LANG_DEFAULT || "ara+eng";

    return NextResponse.json({
      ok: true,
      service: "ocr",
      engine,
      lang,
      status: "ready",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        service: "ocr",
        status: "error",
        error: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

