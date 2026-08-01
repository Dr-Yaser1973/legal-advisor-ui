// app/api/promo-banners/route.ts
// مسار عام: يعيد الإعلانات المفعّلة فقط، مرتّبة — يقرأ منه مكوّن PromoBanner.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const banners = await prisma.promoBanner.findMany({
    where: { enabled: true },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: {
      id: true,
      href: true,
      external: true,
      emoji: true,
      gradient: true,
      titleAr: true,
      subtitleAr: true,
      ctaAr: true,
      titleEn: true,
      subtitleEn: true,
      ctaEn: true,
    },
  });

  return NextResponse.json(
    { ok: true, banners },
    { headers: { "Cache-Control": "no-store" } }
  );
}
