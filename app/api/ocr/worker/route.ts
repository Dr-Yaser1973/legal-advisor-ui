// app/api/ocr/worker/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import Tesseract from "tesseract.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // OCR قد يأخذ وقت

// ========= Supabase =========
function supabaseAdmin() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

// ========= Helpers =========
function parseBucketPath(fullPath: string) {
  // fullPath مثال: uploads/legal-documents/images/123.png
  const [bucket, ...rest] = fullPath.split("/");
  return {
    bucket,
    path: rest.join("/"),
  };
}

async function downloadFromSupabase(filePath: string): Promise<Uint8Array> {
  const sb = supabaseAdmin();
  const { bucket, path } = parseBucketPath(filePath);

  const { data, error } = await sb.storage.from(bucket).download(path);
  if (error || !data) {
    throw new Error(`Supabase download failed: ${error?.message}`);
  }

  const arrayBuffer = await data.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

 // ========== OCR ==========
async function runOCR(
  buffer: Uint8Array,
  lang: string | null
): Promise<string> {
  const language = lang || "ara+eng";

  // 🩺 تحويل Uint8Array إلى Buffer (Node-compatible ImageLike)
  const nodeBuffer = Buffer.from(buffer);

  const result = await Tesseract.recognize(nodeBuffer, language, {
    logger: (m) => {
      if (m.status === "recognizing text") {
        console.log(`OCR: ${Math.round(m.progress * 100)}%`);
      }
    },
  });

  return result.data.text || "";
}

// ========= API =========
/**
 * POST /api/ocr/worker
 *
 * اختياري:
 * body:
 * {
 *   "limit": 3
 * }
 *
 * للاستخدام:
 * - يدوي: استدعِه من المتصفح أو Postman
 * - مجدول: cron / GitHub Action / Vercel cron
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const limit = Math.min(Number(body.limit || 3), 10);

    // 1) اجلب مستندات OCR المعلّقة
    const pendingDocs = await prisma.legalDocument.findMany({
      where: {
        ocrStatus: "PENDING",
        kind: "IMAGE",
        filePath: { not: null },
      },
      orderBy: { createdAt: "asc" },
      take: limit,
    });

    if (!pendingDocs.length) {
      return NextResponse.json({
        ok: true,
        message: "لا توجد مستندات OCR معلّقة",
        processed: 0,
      });
    }

    let processed = 0;
    const results: any[] = [];

    for (const doc of pendingDocs) {
      try {
        console.log("OCR START:", doc.id, doc.filePath);

        // 2) علّم المستند بأنه قيد المعالجة
        await prisma.legalDocument.update({
          where: { id: doc.id },
          data: { ocrStatus: "PROCESSING" },
        });

        // 3) نزّل الصورة
        const buffer = await downloadFromSupabase(doc.filePath!);

        // 4) شغّل OCR
        const text = await runOCR(buffer, doc.ocrLanguage);

        // 5) خزّن النتيجة
        await prisma.legalDocument.update({
          where: { id: doc.id },
          data: {
            extractedText: text,
            ocrStatus: "COMPLETED",
            isScanned: true,
            pageCount: 1,
          },
        });

        processed++;
        results.push({
          id: doc.id,
          status: "COMPLETED",
          length: text.length,
        });

        console.log("OCR DONE:", doc.id);
      } catch (err: any) {
        console.error("OCR FAIL:", doc.id, err.message);

        await prisma.legalDocument.update({
          where: { id: doc.id },
          data: {
            ocrStatus: "FAILED",
          },
        });

        results.push({
          id: doc.id,
          status: "FAILED",
          error: err.message,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      processed,
      results,
    });
  } catch (e: any) {
    console.error("OCR_WORKER_FATAL", e);
    return NextResponse.json(
      { ok: false, error: "فشل تشغيل OCR Worker" },
      { status: 500 }
    );
  }
}

