// app/api/blog/posts/[slug]/view/route.ts
// عدّ مشاهدات المقال بشكل صادق: beacon من المتصفّح يُستدعى مرّة واحدة لكل جلسة.
// البوتات لا تُشغّل JS فتُستبعد تلقائياً، مع حارس User-Agent إضافي.
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isBot } from "@/lib/analytics/channel";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    // استبعاد البوتات المعروفة (حارس إضافي فوق كون الـ beacon JS-only)
    if (isBot(req.headers.get("user-agent"))) {
      return NextResponse.json({ ok: true, skipped: "bot" });
    }

    const { slug } = await context.params;

    // نزيد فقط للمقالات المنشورة، ودون كشف وجود المقال من عدمه
    const res = await prisma.blogPost.updateMany({
      where: { slug, status: "PUBLISHED" },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ ok: true, counted: res.count > 0 });
  } catch (e: any) {
    // صامت — عدّ المشاهدات يجب ألا يكسر تجربة القارئ
    console.error("BLOG VIEW TRACK ERROR", e?.message || e);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
