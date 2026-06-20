// app/api/library/views/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const revalidate = 60; // تخزين مؤقت 60 ثانية لتخفيف الحمل على قاعدة البيانات

export async function GET() {
  try {
    const result = await prisma.libraryItem.aggregate({
      _sum: { views: true },
    });
    const totalViews = result._sum.views || 0;
    return NextResponse.json({ ok: true, totalViews });
  } catch (e: any) {
    console.error("PLATFORM VISITORS ERROR", e?.message || e);
    return NextResponse.json({ ok: false, totalViews: 0 }, { status: 500 });
  }
}
