// app/api/admin/promo-banners/route.ts
// إدارة الإعلانات (أدمن فقط): قائمة كاملة + إنشاء.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth.ok) return auth.res;

  const banners = await prisma.promoBanner.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  return NextResponse.json({ ok: true, banners });
}

export async function POST(req: Request) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth.ok) return auth.res;

  const body = await req.json().catch(() => ({}));
  const titleAr = String(body.titleAr || "").trim();
  const href = String(body.href || "").trim();

  if (!titleAr) {
    return NextResponse.json(
      { ok: false, error: "العنوان (عربي) مطلوب." },
      { status: 400 }
    );
  }
  if (!href) {
    return NextResponse.json(
      { ok: false, error: "الرابط (href) مطلوب." },
      { status: 400 }
    );
  }

  // ضع الإعلان الجديد في نهاية الترتيب
  const last = await prisma.promoBanner.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  const banner = await prisma.promoBanner.create({
    data: {
      titleAr,
      href,
      enabled: body.enabled === undefined ? true : Boolean(body.enabled),
      external: Boolean(body.external),
      emoji: String(body.emoji || "📣").trim() || "📣",
      gradient:
        String(body.gradient || "").trim() ||
        "linear-gradient(135deg,#4f46e5,#7c3aed)",
      subtitleAr: String(body.subtitleAr || "").trim(),
      ctaAr: String(body.ctaAr || "").trim() || "اعرف المزيد",
      titleEn: String(body.titleEn || "").trim(),
      subtitleEn: String(body.subtitleEn || "").trim(),
      ctaEn: String(body.ctaEn || "").trim() || "Learn more",
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  });

  return NextResponse.json({ ok: true, banner }, { status: 201 });
}
