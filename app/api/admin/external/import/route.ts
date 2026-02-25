 // app/api/admin/external/import/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { searchOpenAlexWorks } from "@/lib/external-sources/openalex";
import { searchCourtListener } from "@/lib/external-sources/courtlistener";
import { searchEurLexByKeyword } from "@/lib/external-sources/eurlex";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";

type SourceKind = "OPENALEX" | "COURTLISTENER" | "EURLEX" | "WORLDLII";

export async function POST(req: Request) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth.ok) return auth.res;

  try {
    const body = await req.json();
    const source = body.source as SourceKind;
    const q = String(body.q || "").trim();
    const perPage = Number(body.perPage || 10);

    if (!q) {
      return NextResponse.json(
        { ok: false, error: "q is required" },
        { status: 400 }
      );
    }

    let hits: any[] = [];

    if (source === "OPENALEX") {
      hits = await searchOpenAlexWorks(q, perPage);
    } else if (source === "COURTLISTENER") {
      hits = await searchCourtListener(q, perPage);
    } else if (source === "EURLEX") {
      hits = await searchEurLexByKeyword(q, perPage);
    } else {
      return NextResponse.json(
        { ok: false, error: "Invalid source" },
        { status: 400 }
      );
    }

    // 1️⃣ حفظ العناصر فرديًا للحصول على ID
    const createdItems = [];
    for (const h of hits) {
      const item = await prisma.externalSourceItem.upsert({
        where: {
          source_externalId: {
            source: source as any,
            externalId: h.externalId,
          },
        },
        update: {},
        create: {
          source: source as any,
          externalId: h.externalId,
          title: h.title,
          url: h.url,
          jurisdiction: h.jurisdiction || null,
          publishedAt: h.publishedAt ? new Date(h.publishedAt) : null,
          docType: h.docType || null,
          language: h.language || null,
          summary: h.summary || null,
          raw: h.raw || null,
        },
      });

      createdItems.push(item);
    }

    // 2️⃣ إعادة Preview يحتوي ID من DB
    const preview = createdItems.slice(0, 5).map((item) => ({
      id: item.id,               // ✅ DB ID
      title: item.title,
      url: item.url,
      lawUnitId: item.lawUnitId ?? null,
    }));

    return NextResponse.json({
      ok: true,
      imported: createdItems.length,
      preview,
    });
  } catch (e: any) {
    console.error("external import error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
