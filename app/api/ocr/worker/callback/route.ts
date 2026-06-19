 // app/api/ocr/worker/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function json(res: any, status = 200) {
  return NextResponse.json(res, { status });
}

export async function POST(req: NextRequest) {
  try {
    // 1. التحقق من الهوية (Security)
    const secret = req.headers.get("x-worker-secret");
    if (!secret || secret !== process.env.OCR_CALLBACK_SECRET) {
      console.error("Unauthorized callback attempt");
      return json({ ok: false, error: "Unauthorized" }, 401);
    }

    const body = await req.json().catch(() => null);
    if (!body) return json({ ok: false, error: "Invalid JSON body" }, 400);

    const documentId = Number(body.documentId);
    if (!Number.isFinite(documentId)) {
      return json({ ok: false, error: "Invalid documentId" }, 400);
    }

    const ok = Boolean(body.ok);
    // تنظيف النص من أي رموز صفرية (Null bytes) قد يرسلها الـ OCR
    const text =
      typeof body.text === "string" ? body.text.replace(/\0/g, "").trim() : "";
    const errorMsg = typeof body.error === "string" ? body.error : null;

    // 2. حالة الفشل: حدّث الحالة فقط واخرج
    if (!ok || !text) {
      await prisma.legalDocument.update({
        where: { id: documentId },
        data: { ocrStatus: "FAILED" },
      });
      console.error("OCR WORKER REPORTED FAILURE", { documentId, error: errorMsg });
      return json({ ok: true, status: "FAILED" });
    }

    // 3. حالة النجاح: خزّن النص في LegalDocument مباشرةً
    await prisma.legalDocument.update({
      where: { id: documentId },
      data: {
        ocrStatus: "COMPLETED",
        ocrText: text,
        extractedText: text,
        ocrProvider: "gemini",
      },
    });

    console.log(`[OCR SUCCESS] Document:${documentId} (${text.length} chars)`);
    return json({ ok: true, status: "COMPLETED", chars: text.length });
  } catch (e: any) {
    console.error("CALLBACK INTERNAL ERROR", e?.message || e);
    return json({ ok: false, error: "Internal server error" }, 500);
  }
}