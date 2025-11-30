 import { prisma } from "@/lib/prisma";
import { legalQuestionSchema } from "@/lib/validations/legalQuestion";
import { getEmbedding } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = legalQuestionSchema.parse(body);

    const q = await prisma.legalQuestion.create({
      data: {
        question_text: data.question_text,
        answer_text: data.answer_text,
        jurisdiction: data.jurisdiction ?? "",
        category: data.category ?? "",
      },
    });

    const emb = await getEmbedding(
      q.question_text + "\n" + q.answer_text
    );

    await prisma.questionEmbedding.create({
      data: { legalQuestionId: q.id, embedding: emb },
    });

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: "فشل الإضافة" }, { status: 500 });
  }
}
