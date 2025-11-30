import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = {
  q?: string;
  category?: string;
  jurisdiction?: string;
  limit?: number;
};

export async function POST(req: Request) {
  try {
    const { q, category, jurisdiction, limit = 20 } =
      ((await req.json().catch(() => ({}))) as Body) ?? {};

    const where: any = { visibility: "PUBLIC" };

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { text: { contains: q } },
        { articles: { some: { text: { contains: q } } } },
      ];
    }

    if (category) {
      where.category = category.toUpperCase();
    }

    if (jurisdiction) {
      where.jurisdiction = jurisdiction;
    }

    const docs = await prisma.lawDoc.findMany({
      where,
      include: {
        articles: {
          where: q ? { text: { contains: q } } : undefined,
          orderBy: { ordinal: "asc" },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
      take: Math.max(1, Math.min(limit, 50)),
    });

    return NextResponse.json({
      ok: true,
      results: docs.map((d) => ({
        id: d.id,
        title: d.title,
        jurisdiction: d.jurisdiction,
        category: d.category,
        year: d.year,
        snippet: d.text?.slice(0, 300) ?? null,
        articles: d.articles.map((a) => ({
          id: a.id,
          ordinal: a.ordinal,
          number: a.number,
          text: a.text.slice(0, 400),
        })),
      })),
    });
  } catch (e: any) {
    console.error("library/search error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "فشل البحث" },
      { status: 500 },
    );
  }
}

