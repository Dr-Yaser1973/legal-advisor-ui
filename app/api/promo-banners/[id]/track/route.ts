// app/api/promo-banners/[id]/track/route.ts
// تتبّع عام: زيادة عدّاد الظهور أو النقر. لا مصادقة (حدث عام) — كتابة عدّاد فقط.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Ctx) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const e = new URL(req.url).searchParams.get("e");
  const field = e === "click" ? "clicks" : e === "impression" ? "impressions" : null;
  if (!field) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    await prisma.promoBanner.update({
      where: { id },
      data: { [field]: { increment: 1 } },
    });
  } catch {
    // إعلان محذوف/غير موجود — نتجاهل بصمت
  }

  return new NextResponse(null, { status: 204 });
}
