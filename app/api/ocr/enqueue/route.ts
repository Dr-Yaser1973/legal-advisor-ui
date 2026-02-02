 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const auth = await requireRole([UserRole.ADMIN, UserRole.LAWYER, UserRole.COMPANY]);
  if (!auth.ok) return auth.res;

  try {
    const { documentId } = await req.json();
    const id = Number(documentId);

    if (!Number.isFinite(id)) {
      return NextResponse.json({ ok: false, error: "documentId required" }, { status: 400 });
    }

    // بدون select لتفادي مشاكل TypeScript مع تغيّر الحقول
    const doc = await prisma.legalDocument.findUnique({ where: { id } });
    if (!doc) {
      return NextResponse.json({ ok: false, error: "Document not found" }, { status: 404 });
    }

    // نحاول نستنتج مسار الملف من الحقول المتاحة
    const anyDoc = doc as any;
    const filePath: string | null =
      anyDoc.source || anyDoc.filename || anyDoc.filePath || null;

    if (!filePath) {
      return NextResponse.json(
        { ok: false, error: "Document has no storage path (source/filename/filePath missing)" },
        { status: 400 }
      );
    }

    const workerUrl = process.env.OCR_SERVICE_URL;
    if (!workerUrl) {
      return NextResponse.json({ ok: false, error: "OCR_SERVICE_URL not configured" }, { status: 500 });
    }

    const callbackUrl = `${process.env.APP_BASE_URL}/api/ocr/worker/callback`;

    // تحديث حالة الطابور
    await prisma.legalDocument.update({
      where: { id },
      data: { ocrStatus: "PROCESSING" } as any,
    });

    const r = await fetch(`${workerUrl}/job`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-worker-secret": process.env.OCR_WORKER_SECRET!,
      },
      body: JSON.stringify({
        documentId: id,
        bucket: "library",   // ثابت للمكتبة حسب معمارية مشروعك
        path: filePath,      // مثال: laws/xxxx.pdf
        callbackUrl,
        maxPages: 20,
      }),
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      return NextResponse.json(
        { ok: false, error: `Worker rejected job: ${r.status} ${txt}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("OCR ENQUEUE ERROR", e);
    return NextResponse.json({ ok: false, error: e?.message || "enqueue failed" }, { status: 500 });
  }
}
