
// app/api/legal-questions/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getEmbedding } from "@/lib/ai";

export const dynamic = "force-dynamic";

const IdSchema = z.object({ id: z.coerce.number().int().positive() });
const UpdateSchema = z.object({
  question_text: z.string().min(8).max(4000).optional(),
  answer_text: z.string().min(8).max(20000).optional(),
  category: z.string().optional().nullable(),
  jurisdiction: z.string().optional().nullable(),
  source_reference: z.string().optional().nullable(),
  slug: z.string().optional().nullable(),
}).refine((d) => Object.keys(d).length > 0, { message: "لا يوجد حقول لتحديثها" });

/* ===== GET /api/legal-questions/:id ===== */
export async function GET(_: Request, ctx: { params: { id: string } }) {
  try {
    const { id } = IdSchema.parse(ctx.params);
    const item = await prisma.legalQuestion.findUnique({
      where: { id },
      select: {
        id: true, slug: true, question_text: true, answer_text: true,
        category: true, jurisdiction: true, source_reference: true,
        createdAt: true, updatedAt: true,
      },
    });
    if (!item) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
    return NextResponse.json(item, { status: 200 });
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }
}

/* ===== PUT /api/legal-questions/:id ===== */
export async function PUT(req: Request, ctx: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
    }
    const { id } = IdSchema.parse(ctx.params);
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "JSON مفقود" }, { status: 400 });
    const data = UpdateSchema.parse(body);

    // تحديث السؤال
    const updated = await prisma.legalQuestion.update({
      where: { id },
      data: {
        question_text: data.question_text,
        answer_text: data.answer_text,
        category: data.category ?? undefined,
        jurisdiction: data.jurisdiction ?? undefined,
        source_reference: data.source_reference ?? undefined,
        slug: data.slug ?? undefined,
      },
      select: {
        id: true, question_text: true, answer_text: true,
        category: true, jurisdiction: true, source_reference: true,
      },
    });

    // --- الخطوة 4: إعادة بناء التضمين عند التعديل ---
    try {
      const text = `
سؤال:
${updated.question_text}

تصنيف: ${updated.category ?? "-"}
ولاية: ${updated.jurisdiction ?? "-"}
مرجع: ${updated.source_reference ?? "-"}

إجابة:
${updated.answer_text}
`.trim();

      const emb = await getEmbedding(text);
      await prisma.legalDocEmbedding.upsert({
        where: { legalQuestionId: updated.id },
        update: { embedding: emb as unknown as any },
        create: { legalQuestionId: updated.id, embedding: emb as unknown as any },
      });
    } catch (e: any) {
      console.warn("Embedding rebuild failed:", e?.message);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "تعذّر التعديل" }, { status: 400 });
  }
}

/* ===== DELETE /api/legal-questions/:id ===== */
export async function DELETE(_: Request, ctx: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
    }
    const { id } = IdSchema.parse(ctx.params);

    // مع onDelete: Cascade في العلاقة، سيُحذف embedding تلقائيًا
    await prisma.legalQuestion.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "تعذّر الحذف" }, { status: 400 });
  }
}
