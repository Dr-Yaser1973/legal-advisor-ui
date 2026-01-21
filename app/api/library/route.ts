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
      process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL;

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
                filename: true,
              },
            },
          },
        },
      },
    });

    const docs = units.map((unit) => {
      // جميع الملفات المرتبطة
      const filenames = unit.documents
        .map((d) => d.document.filename)
        .filter(Boolean) as string[];

      // استخراج الامتدادات
      const fileTypes = filenames.map((f) => {
        const parts = f.split(".");
        return parts.length > 1
          ? parts.pop()!.toLowerCase()
          : "unknown";
      });

      // أول ملف لعرض الرابط السريع
      const firstFile = filenames[0] || null;

      const pdfUrl =
        firstFile && SUPABASE_URL
          ? `${SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/library/${firstFile}`
          : null;

      const hasText = Boolean(unit.content && unit.content.trim().length > 0);

      // ممسوح ضوئيًا = كل الملفات صور
      const isScanned =
        fileTypes.length > 0 &&
        fileTypes.every((t) =>
          ["jpg", "jpeg", "png", "webp", "tiff"].includes(t)
        );

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

        // الحقول الجديدة للواجهة
        pdfUrl,
        hasText,
        isScanned,
        fileTypes, // ✅ جديد: كل أنواع الملفات
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
