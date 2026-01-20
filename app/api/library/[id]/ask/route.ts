import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const lawUnitId = Number(params.id);
  if (!Number.isFinite(lawUnitId)) {
    return NextResponse.json({ ok: false, error: "Invalid ID" }, { status: 400 });
  }

  const { question } = await req.json();

  if (!question || typeof question !== "string") {
    return NextResponse.json(
      { ok: false, error: "السؤال مطلوب" },
      { status: 400 }
    );
  }

  // 1. ابحث في الأسئلة الشائعة
  const faqMatch = await prisma.lawDocFaq.findFirst({
    where: {
      docId: lawUnitId,
      question: { contains: question, mode: "insensitive" },
    },
  });

  if (faqMatch) {
    return NextResponse.json({
      ok: true,
      source: "faq",
      answer: faqMatch.answer,
    });
  }

  // 2. fallback: ابحث في نص المادة
  const unit = await prisma.lawUnit.findUnique({
    where: { id: lawUnitId },
    select: { content: true, title: true },
  });

  if (!unit) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  const snippet = unit.content.slice(0, 600);

  return NextResponse.json({
    ok: true,
    source: "law-text",
    answer: `وفقًا لنص المادة "${unit.title}":\n\n${snippet}...\n\nننصح بطلب استشارة قانونية للحصول على تفسير تطبيقي دقيق.`,
  });
}

