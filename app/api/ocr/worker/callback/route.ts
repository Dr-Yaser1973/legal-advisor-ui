 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const secret = req.headers.get("x-callback-secret");

    console.log("CALLBACK SECRET ENV =", process.env.OCR_CALLBACK_SECRET);
    console.log("CALLBACK SECRET HDR =", secret);

    if (!secret || secret !== process.env.OCR_CALLBACK_SECRET) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      documentId,
      status,   // <-- هذا هو الصحيح
      text,
      meta,
    } = body || {};

    if (!documentId || !status) {
      return NextResponse.json(
        { ok: false, error: "documentId or status missing" },
        { status: 400 }
      );
    }

    const clean = (text || "").trim();
    const provider = meta?.provider || "unknown";

    if (status === "FAILED") {
      await prisma.legalDocument.update({
        where: { id: Number(documentId) },
        data: {
          ocrStatus: "FAILED",
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({ ok: true, status: "FAILED" });
    }

    // COMPLETED
    await prisma.legalDocument.update({
      where: { id: Number(documentId) },
      data: {
        ocrStatus: "COMPLETED",
        ocrText: clean,
        extractedText: clean,
        ocrProvider: provider,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      ok: true,
      status: "COMPLETED",
      textLength: clean.length,
      provider,
    });
  } catch (e: any) {
    console.error("OCR_CALLBACK_FATAL", e);

    return NextResponse.json(
      { ok: false, error: e?.message || "Callback error" },
      { status: 500 }
    );
  }
}
