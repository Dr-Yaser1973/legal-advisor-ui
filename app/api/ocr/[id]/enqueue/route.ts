 import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

 export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {

  try {
    const { id: idStr } = await ctx.params;
const id = Number(idStr);


    if (!Number.isFinite(id)) {
      return NextResponse.json(
        { ok: false, error: "معرّف مستند غير صالح" },
        { status: 400 }
      );
    }

    const doc = await prisma.legalDocument.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!doc) {
      return NextResponse.json(
        { ok: false, error: "المستند غير موجود" },
        { status: 404 }
      );
    }

    await prisma.legalDocument.update({
      where: { id },
      data: {
        ocrStatus: "PENDING",
      },
    });

    return NextResponse.json({
      ok: true,
      id,
      status: "PENDING",
      queued: true,
    });
  } catch (e: any) {
    console.error("OCR ENQUEUE ERROR", e);
    return NextResponse.json(
      { ok: false, error: e.message || "فشل إدخال المستند للطابور" },
      { status: 500 }
    );
  }
}
