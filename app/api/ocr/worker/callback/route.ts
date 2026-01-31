 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const secret = req.headers.get("x-callback-secret");

    if (!secret || secret !== process.env.OCR_CALLBACK_SECRET) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { documentId, ok, text, pages, isScanned, engine, error } = body as {
      documentId: number;
      ok: boolean;
      text?: string | null;
      pages?: number | null;
      isScanned?: boolean | null;
      engine?: string | null;
      error?: string | null;
    };

    if (!documentId || !Number.isFinite(Number(documentId))) {
      return NextResponse.json({ ok: false, error: "documentId is required" }, { status: 400 });
    }
    await prisma.legalDocument.update({
  where: { id: Number(documentId) },
   data: {
  ...(typeof isScanned === "boolean" ? { isScanned } : {}),
  ...(typeof text === "string" ? { text } : {}),
  ...(typeof pages === "number" ? { pages } : {}),
  ocrStatus: ok ? "COMPLETED" : "FAILED",
},

});


    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("OCR CALLBACK ERROR:", e);
    return NextResponse.json({ ok: false, error: e?.message || "Callback failed" }, { status: 500 });
  }
}
