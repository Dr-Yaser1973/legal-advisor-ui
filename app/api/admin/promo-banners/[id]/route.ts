// app/api/admin/promo-banners/[id]/route.ts
// تعديل / حذف إعلان (أدمن فقط).
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const STRING_FIELDS = [
  "href",
  "emoji",
  "gradient",
  "titleAr",
  "subtitleAr",
  "ctaAr",
  "titleEn",
  "subtitleEn",
  "ctaEn",
] as const;

export async function PATCH(req: Request, { params }: Ctx) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth.ok) return auth.res;

  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ ok: false, error: "معرّف غير صالح." }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};

  for (const key of STRING_FIELDS) {
    if (body[key] !== undefined) data[key] = String(body[key]).trim();
  }
  if (body.enabled !== undefined) data.enabled = Boolean(body.enabled);
  if (body.external !== undefined) data.external = Boolean(body.external);
  if (body.sortOrder !== undefined) {
    const n = Number(body.sortOrder);
    if (Number.isFinite(n)) data.sortOrder = Math.trunc(n);
  }

  // منع تفريغ الحقول الإلزامية
  if (data.titleAr !== undefined && !data.titleAr) {
    return NextResponse.json({ ok: false, error: "العنوان (عربي) مطلوب." }, { status: 400 });
  }
  if (data.href !== undefined && !data.href) {
    return NextResponse.json({ ok: false, error: "الرابط (href) مطلوب." }, { status: 400 });
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ ok: false, error: "لا تغييرات." }, { status: 400 });
  }

  try {
    const banner = await prisma.promoBanner.update({ where: { id }, data });
    return NextResponse.json({ ok: true, banner });
  } catch {
    return NextResponse.json({ ok: false, error: "الإعلان غير موجود." }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth.ok) return auth.res;

  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ ok: false, error: "معرّف غير صالح." }, { status: 400 });
  }

  try {
    await prisma.promoBanner.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "الإعلان غير موجود." }, { status: 404 });
  }
}
