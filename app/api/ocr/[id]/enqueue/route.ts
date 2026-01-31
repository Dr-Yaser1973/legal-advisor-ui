 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = Number(idStr);

    if (!Number.isFinite(id)) {
      return NextResponse.json(
        { ok: false, error: "معرّف المستند غير صالح" },
        { status: 400 }
      );
    }

    const auth = await requireRole([UserRole.ADMIN]);
    if (!auth.ok) return auth.res;

    const doc = await prisma.legalDocument.findUnique({
      where: { id },
      select: { id: true, ocrStatus: true },
    });

    if (!doc) {
      return NextResponse.json(
        { ok: false, error: "المستند غير موجود" },
        { status: 404 }
      );
    }

    await prisma.legalDocument.update({
      where: { id },
      data: { ocrStatus: "PENDING" },
    });

    return NextResponse.json({ ok: true, id });
  } catch (e: any) {
    console.error("OCR ENQUEUE ERROR:", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "فشل إدخال المستند في الطابور" },
      { status: 500 }
    );
  }
}
