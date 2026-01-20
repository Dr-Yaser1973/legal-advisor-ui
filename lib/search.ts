 import { prisma } from "@/lib/prisma";

/**
 * نوع النتيجة الموحدة
 */
export type SearchResult = {
  id: number;
  title: string;
  category: string;
  snippet: string;
  score: number;
};

/**
 * إعدادات الوزن
 * العنوان له وزن أعلى لأنه أهم قانونيًا في المطابقة
 */
const WEIGHTS = {
  TITLE: 2.0,
  CONTENT: 1.0,
};

/**
 * تنظيف النص وتحويله لكلمات
 */
function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * حساب درجة المطابقة البسيطة
 */
function scoreText(text: string, tokens: string[]): number {
  if (!text) return 0;
  const hay = text.toLowerCase();

  let score = 0;
  for (const t of tokens) {
    // عدد مرات ظهور الكلمة
    const matches = hay.split(t).length - 1;
    score += matches;
  }
  return score;
}

/**
 * قص جزء من النص لعرضه في النتائج
 */
function makeSnippet(text: string, tokens: string[]): string {
  if (!text) return "";
  const lower = text.toLowerCase();

  for (const t of tokens) {
    const idx = lower.indexOf(t);
    if (idx !== -1) {
      const start = Math.max(0, idx - 60);
      const end = Math.min(text.length, idx + 120);
      return text.slice(start, end).trim();
    }
  }

  return text.slice(0, 180).trim();
}

/**
 * بحث دلالي مرجّح
 * يعطي وزن أكبر للعنوان وأقل للمحتوى
 */
export async function semanticSearch(
  q: string,
  limit: number = 8
): Promise<SearchResult[]> {
  if (!q || !q.trim()) return [];

  const tokens = tokenize(q);

  // جلب مرشحين من قاعدة البيانات (فلترة أولية)
  const candidates = await prisma.lawUnit.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
      ],
    },
    take: 50, // نجيب مجموعة أوسع ثم نرتّبها بالسكور
    select: {
      id: true,
      title: true,
      category: true,
      content: true,
    },
  });

  // حساب السكور المرجّح
  const ranked: SearchResult[] = candidates
    .map((c) => {
      const titleScore =
        scoreText(c.title || "", tokens) * WEIGHTS.TITLE;

      const contentScore =
        scoreText(c.content || "", tokens) *
        WEIGHTS.CONTENT;

      const totalScore = titleScore + contentScore;

      return {
        id: c.id,
        title: c.title,
        category: c.category,
        snippet: makeSnippet(c.content || "", tokens),
        score: totalScore,
      };
    })
    .filter((r) => r.score > 0) // استبعد النتائج غير المطابقة
    .sort((a, b) => b.score - a.score) // ترتيب تنازلي
    .slice(0, limit);

  return ranked;
}

/**
 * بحث هجين
 * حاليًا يعتمد على النص + الترتيب الذكي
 * مستقبليًا يمكن دمجه مع embeddings / pgvector
 */
export async function hybridSearch(
  q: string,
  limit: number = 8
): Promise<SearchResult[]> {
  return semanticSearch(q, limit);
}
