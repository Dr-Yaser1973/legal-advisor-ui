 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DocStatus } from "@prisma/client";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const take = Math.min(parseInt(searchParams.get("take") || "50", 10), 100);
    const skip = parseInt(searchParams.get("skip") || "0", 10);

     const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;


    const units = await prisma.lawUnit.findMany({
      where: {
        status: DocStatus.PUBLISHED,
      },
      orderBy: {
        createdAt: "desc",
      },
      take,
      skip,
      include: {
        documents: {
          include: {
            document: {
              select: {
                id: true,
                filename: true, // نخزن المسار الكامل هنا
              },
            },
          },
        },
      },
    });

    const docs = units.map((unit) => {
      const firstDoc = unit.documents[0]?.document || null;

      const pdfUrl =
        firstDoc && SUPABASE_URL
          ? `${SUPABASE_URL}/storage/v1/object/public/library/${firstDoc.filename}`
          : null;

      return {
        id: unit.id,
        title: unit.title,
        content: unit.content,
        simplified: unit.simplified,
        practicalUse: unit.practicalUse,
        category: unit.category,
        status: unit.status,
        createdAt: unit.createdAt,
        updatedAt: unit.updatedAt,
        pdfUrl,
      };
    });

    return NextResponse.json({
      ok: true,
      docs,
    });
  } catch (err: any) {
    console.error("LIBRARY API ERROR:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "فشل تحميل المكتبة" },
      { status: 500 }
    );
  }
}
