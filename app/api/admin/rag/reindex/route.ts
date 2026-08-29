// app/api/admin/rag/reindex/route.ts
// إعادة بناء قاعدة معرفة «المحامي الذكي» من المصادر الداخلية (مكتبة + استشارات).
// أدمن فقط. قد يستغرق وقتاً (تضمين OpenAI) — يُفضّل تشغيله محلياً على خطة Hobby.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ingestLibraryItem, ingestConsultation } from "@/lib/ragStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST() {
  const session: any = await getServerSession(authOptions as any);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مخوّل. يتطلب ADMIN." }, { status: 403 });
  }

  try {
    let libraryChunks = 0, libraryItems = 0;
    let consultChunks = 0, consultItems = 0;

    const items = await prisma.libraryItem.findMany({
      where: { isPublished: true },
      select: { id: true },
    });
    for (const it of items) {
      const n = await ingestLibraryItem(it.id).catch(() => 0);
      if (n > 0) { libraryItems++; libraryChunks += n; }
    }

    const consults = await prisma.consultation.findMany({
      where: { answer: { not: null } },
      select: { id: true },
    });
    for (const c of consults) {
      const n = await ingestConsultation(c.id).catch(() => 0);
      if (n > 0) { consultItems++; consultChunks += n; }
    }

    const totalChunks = await prisma.ragChunk.count();

    return NextResponse.json({
      ok: true,
      library: { items: libraryItems, chunks: libraryChunks },
      consultations: { items: consultItems, chunks: consultChunks },
      totalChunksInStore: totalChunks,
    });
  } catch (e: any) {
    console.error("rag reindex error:", e);
    return NextResponse.json({ error: e?.message || "فشل إعادة الفهرسة." }, { status: 500 });
  }
}
