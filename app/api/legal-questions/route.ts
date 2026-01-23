 import { prisma } from "@/lib/prisma";
import { legalQuestionSchema } from "@/lib/validations/legalQuestion";
import { getEmbedding } from "@/lib/ai";

export const runtime = "nodejs";

// ===============================
// POST
// ===============================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = legalQuestionSchema.parse(body);

    // 1) حفظ السؤال والإجابة
    const q = await prisma.legalQuestion.create({
      data: {
        question_text: data.question_text,
        answer_text: data.answer_text,
        jurisdiction: data.jurisdiction ?? "",
        category: data.category ?? "",
      },
    });

    // 2) توليد Embedding وقت الطلب فقط
    let emb: number[] | null = null;

    try {
      emb = await getEmbedding(
        q.question_text + "\n" + q.answer_text
      );
    } catch (aiError) {
      console.warn("Embedding skipped:", aiError);
      // نكمل بدون إسقاط المنصة
    }

    // 3) حفظ الـ Embedding إذا تولد فعليًا
    if (emb) {
      await prisma.questionEmbedding.create({
        data: { legalQuestionId: q.id, embedding: emb },
      });
    }

    return Response.json({
      success: true,
      embeddingStored: Boolean(emb),
    });
  } catch (e) {
    console.error("LegalQuestion Error:", e);
    return Response.json(
      { error: "فشل الإضافة" },
      { status: 500 }
    );
  }
}
