import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
 import { authOptions } from "@/app/api/auth/options";

import { OCRStatus, DocumentKind, UserRole } from "@prisma/client";

export const runtime = "nodejs";

function isAdmin(session: any) {
  return session?.user?.role === UserRole.ADMIN;
}

// GET /api/ocr/documents?status=&kind=&q=&page=&pageSize=
export async function GET(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!isAdmin(session)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const status = (searchParams.get("status") || "").trim() as OCRStatus | "";
    const kind = (searchParams.get("kind") || "").trim() as DocumentKind | "";
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const pageSize = Math.min(50, Math.max(10, Number(searchParams.get("pageSize") || "15")));
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (status) where.ocrStatus = status;
    if (kind) where.kind = kind;

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { filename: { contains: q, mode: "insensitive" } },
      ];
    }

    const [items, total, grouped] = await Promise.all([
      prisma.legalDocument.findMany({
        where,
        orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        skip,
        take: pageSize,
        select: {
          id: true,
          title: true,
          filename: true,
          mimetype: true,
          size: true,
          kind: true,
          isScanned: true,
          ocrStatus: true,
          ocrLanguage: true,
          pageCount: true,
          source: true,
          checksum: true,
          createdAt: true,
          updatedAt: true,
          createdBy: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.legalDocument.count({ where }),
      prisma.legalDocument.groupBy({
        by: ["ocrStatus"],
        _count: { _all: true },
      }),
    ]);

    const counts: Record<string, number> = {};
    for (const g of grouped) counts[g.ocrStatus] = g._count._all;

    return NextResponse.json({
      ok: true,
      page,
      pageSize,
      total,
      pages: Math.ceil(total / pageSize),
      counts,
      items,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Server error" }, { status: 500 });
  }
}

