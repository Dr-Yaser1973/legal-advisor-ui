 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LAW_CATEGORIES, LawCategoryKey } from "@/lib/lawCategories";
import { parseLawText } from "@/lib/lawParser";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";

type Body = {
  title?: string;
  jurisdiction?: string;
  category?: string;
  text?: string;
  year?: number | null;
};

function normalizeCategory(input?: string | null): LawCategoryKey | null {
  if (!input) return null;
  const upper = input.trim().toUpperCase();
  if (LAW_CATEGORIES.some((c) => c.key === upper)) return upper as LawCategoryKey;
  return null;
}

export async function POST(req: Request) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth.ok) return auth.res;

  try {
    const body = (await req.json().catch(() => ({}))) as Body;
    const { title, jurisdiction, text, year } = body;

    if (!title || !jurisdiction || !body.category || !text) {
      return NextResponse.json(
        { error: "العنوان والاختصاص والتصنيف والنص مطلوبة." },
        { status: 400 },
      );
    }

    const category = normalizeCategory(body.category);
    if (!category) {
      return NextResponse.json(
        { error: "التصنيف غير معروف. استخدم LAW أو FIQH أو ACADEMIC_STUDY." },
        { status: 400 },
      );
    }

    const doc = await prisma.lawDoc.create({
      data: {
        title,
        jurisdiction,
        category,
        year: year ?? null,
        text,
        visibility: "PUBLIC",
      },
    });

    const articles = parseLawText(text);

    if (articles.length > 0) {
      await prisma.lawArticle.createMany({
        data: articles.map((a, idx) => ({
          lawDocId: doc.id,
          ordinal: a.ordinal ?? idx + 1,
          number: a.number ?? null,
          text: a.text,
        })),
      });
    }

    return NextResponse.json({ ok: true, id: doc.id, articlesCount: articles.length }, { status: 201 });
  } catch (e: any) {
    console.error("library/add error:", e);
    return NextResponse.json({ error: e?.message ?? "فشل إضافة المصدر" }, { status: 500 });
  }
}
