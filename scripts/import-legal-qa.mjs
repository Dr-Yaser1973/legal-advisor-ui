
import { readFile } from "fs/promises";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const raw = await readFile(new URL("../data/legal-qa.json", import.meta.url), "utf-8");
  const items = JSON.parse(raw);

  // نحول هيكل answer إلى حقول مسطّحة تناسب الموديل
  const payload = items.map((x) => ({
    question_text: x.question_text,
    category: x.category,
    jurisdiction: x.jurisdiction,
    language: x.language,
    difficulty_level: x.difficulty_level,
    answer_text: x.answer?.answer_text ?? "",
    source_reference: x.answer?.source_reference ?? "",
  }));

  // إدراج دفعي (مع تجاهل التكرار البسيط عبر unique مؤقت إن أضفت لاحقًا قيودًا)
  const BATCH = 100;
  for (let i = 0; i < payload.length; i += BATCH) {
    const slice = payload.slice(i, i + BATCH);
    await prisma.legalQuestion.createMany({
      data: slice,
    });
  }

  const count = await prisma.legalQuestion.count();
  console.log(`✅ تم الاستيراد. إجمالي السجلات الآن: ${count}`);
}

main()
  .catch((e) => {
    console.error("❌ خطأ في الاستيراد:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
