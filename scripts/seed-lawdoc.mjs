// scripts/seed-lawdoc.mjs
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 1) نص قانون كامل (مثال تجريبي)
  const fullText = `
المادة 1 - تسري أحكام هذا القانون على ...
المادة 2 - يهدف هذا القانون إلى تنظيم علاقات العمل بين العمال وأصحاب العمل...
المادة 3 - يلتزم صاحب العمل بتوفير شروط السلامة والصحة المهنية...
`.trim();

  // 2) تقطيع النص إلى مواد حسب كلمة "المادة"
  const rawArticles = fullText
    .split(/(?=المادة\s+\d+)/) // تقسيم مع الاحتفاظ بكلمة "المادة X"
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);

  const articlesData = rawArticles.map((chunk, index) => {
    const m = chunk.match(/المادة\s+(\d+)/);
    const number = m ? m[1] : null;

    return {
      ordinal: index + 1,
      number,
      text: chunk,
    };
  });

  console.log("🚀 بدء إدخال قانون العمل العراقي مع نصه الكامل وتقطيعه...");

  await prisma.lawDoc.create({
    data: {
      title: "قانون العمل العراقي (تجريبي)",
      jurisdiction: "العراق",
      category: "LAW",
      year: 2015,
      text: fullText,      // ✅ تخزين النص الكامل
      articles: {
        create: articlesData, // ✅ تخزين المواد المقسّمة
      },
    },
  });

  console.log("🎯 تم إدخال القانون مع التقطيع بنجاح.");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("❌ حدث خطأ أثناء الإدخال:", err);
  prisma.$disconnect();
});
 