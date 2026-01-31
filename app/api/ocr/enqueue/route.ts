 // app/api/ocr/enqueue/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OCR_CONFIG } from "@/lib/ocr-config";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";

function parseBucketPath(fullPath: string) {
  let clean = (fullPath || "").trim();

  if (clean.startsWith("http")) {
    try {
      const u = new URL(clean);
      clean = u.pathname.replace("/storage/v1/object/public/", "");
    } catch {}
  }

  clean = clean.replace(/^uploads\//, "");
  clean = clean.replace(/^docs\//, "");

  const parts = clean.split("/").filter(Boolean);
  const buckets = ["library", "library-documents", "translations"] as const;

  if (!parts.length) return { bucket: "library" as const, path: "" };

  if (!buckets.includes(parts[0] as any)) {
    return { bucket: "library" as const, path: parts.join("/") };
  }

  const [bucket, ...rest] = parts;
  return { bucket: bucket as (typeof buckets)[number], path: rest.join("/") };
}

async function fireAndForgetWithTimeout(url: string, opts: RequestInit, timeoutMs: number) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);

  fetch(url, { ...opts, signal: ac.signal })
    .catch((e) => console.error("❌ OCR DISPATCH FAILED:", e?.message || e))
    .finally(() => clearTimeout(t));
}

export async function POST(req: Request) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth.ok) return auth.res;

  try {
    const body = await req.json().catch(() => ({}));
    const limit = Math.min(Number((body as any).limit || 3), 10);

    if (!OCR_CONFIG.serviceUrl || !OCR_CONFIG.secret) {
      console.error("❌ OCR CONFIG NOT READY", OCR_CONFIG);
      return NextResponse.json({ ok: false, error: "OCR service غير مضبوط على السيرفر" }, { status: 500 });
    }

    const base = OCR_CONFIG.serviceUrl.replace(/\/$/, "");

    const pending = await prisma.legalDocument.findMany({
      where: {
        ocrStatus: { in: ["PENDING", "NONE"] },
        OR: [{ filePath: { not: null } }, { filename: { not: null } }],
      },
      orderBy: { createdAt: "asc" },
      take: limit,
      select: { id: true, filePath: true, filename: true, mimetype: true, ocrLanguage: true },
    });

    if (!pending.length) {
      return NextResponse.json({ ok: true, queued: 0, message: "لا يوجد مستندات OCR معلّقة" });
    }

    let queued = 0;
    const idsQueued: number[] = [];
    const idsSkipped: number[] = [];

    for (const doc of pending) {
      const pathRaw = (doc.filePath || doc.filename || "").trim();
      const { bucket, path } = parseBucketPath(pathRaw);

      if (!path) {
        console.warn("⚠️ تخطي مستند بدون مسار صالح", doc.id, pathRaw);
        idsSkipped.push(doc.id);
        continue;
      }

      await prisma.legalDocument.update({
        where: { id: doc.id },
        data: { ocrStatus: "PROCESSING" },
      });

      await fireAndForgetWithTimeout(
        `${base}/process`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-worker-secret": OCR_CONFIG.secret,
          },
          body: JSON.stringify({
            documentId: doc.id,
            bucket,
            path,
            mimeType: doc.mimetype || "application/pdf",
            lang: doc.ocrLanguage || "ar+en",
          }),
        },
        30000
      );

      queued++;
      idsQueued.push(doc.id);
    }

    return NextResponse.json({
      ok: true,
      queued,
      ids: idsQueued,
      skipped: idsSkipped,
      note: "تم الإرسال إلى OCR Worker بدون انتظار (Callback سيحدّث النتيجة لاحقًا).",
    });
  } catch (e: any) {
    console.error("OCR QUEUE ERROR:", e);
    return NextResponse.json({ ok: false, error: e?.message || "فشل تشغيل الطابور" }, { status: 500 });
  }
}
