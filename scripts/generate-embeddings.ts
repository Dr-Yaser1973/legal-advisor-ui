
// scripts/generate-embeddings.ts
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function main() {
  console.log("🚀 بدء إنشاء الـ Embeddings ...");

  const questions = await prisma.legalQuestion.findMany();

  for (const q of questions) {
    const text = `${q.question_text}\n${q.answer_text}`;
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    await prisma.legalDocEmbedding.upsert({
      where: { questionId: q.id },
      update: { vector: embedding.data[0].embedding },
      create: {
        questionId: q.id,
        vector: embedding.data[0].embedding,
      },
    });

    console.log(`✅ تم إنشاء embedding للسؤال رقم ${q.id}`);
  }

  console.log("🎉 انتهى التوليد بنجاح!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
