 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const auth = await requireRole([
    UserRole.ADMIN,
    UserRole.LAWYER,
    UserRole.COMPANY,
  ]);
  if (!auth.ok) return auth.res;

  try {
    const { documentId } = await req.json();
    const id = Number(documentId);

    if (!Number.isFinite(id)) {
      return NextResponse.json(
        { ok: false, error: "documentId required" },
        { status: 400 }
      );
    }

    const doc = await prisma.legalDocument.findUnique({
      where: { id },
    });

    if (!doc) {
      return NextResponse.json(
        { ok: false, error: "Document not found" },
        { status: 404 }
      );
    }

    const anyDoc = doc as any;
    const filePath: string | null =
      anyDoc.source || anyDoc.filename || anyDoc.filePath || null;

    if (!filePath) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Document has no storage path (source/filename/filePath missing)",
        },
        { status: 400 }
      );
    }

    const workerUrl = process.env.OCR_SERVICE_URL;
    if (!workerUrl) {
      return NextResponse.json(
        { ok: false, error: "OCR_SERVICE_URL not configured" },
        { status: 500 }
      );
    }

    // تحديث الحالة قبل الإرسال للـ Worker
    await prisma.legalDocument.update({
      where: { id },
      data: { ocrStatus: "PROCESSING" } as any,
    });

    const url = `${workerUrl.replace(/\/$/, "")}/ocr`; // ✅ المسار الصحيح

    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-worker-secret": process.env.OCR_WORKER_SECRET!,
      },
      body: JSON.stringify({
        documentId: id,
        bucket: "library",
        objectPath: filePath, // ✅ الاسم الصحيح
        maxPages: 20,
      }),
    });

    const text = await r.text();

    if (!r.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `Worker rejected job: ${r.status} ${text}`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("OCR ENQUEUE ERROR", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "enqueue failed" },
      { status: 500 }
    );
  }
}
