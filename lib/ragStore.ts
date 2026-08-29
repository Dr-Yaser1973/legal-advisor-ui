// lib/ragStore.ts
// مخزن RAG الموحّد: إدخال المحتوى الداخلي (مكتبة/استشارات/مستندات) كمقاطع مُضمَّنة،
// واسترجاعه بالتشابه الجيبي (cosine) لتغذية إجابات «المحامي الذكي».
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { splitIntoChunks } from "@/lib/chunks";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const EMBED_MODEL = process.env.EMBEDDING_MODEL ?? "text-embedding-3-small";

export type RagSourceType = "LIBRARY" | "CONSULT" | "DOCUMENT";

// ── تضمين نصوص (دفعة) ─────────────────────────────────────────────
async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const resp = await openai.embeddings.create({ model: EMBED_MODEL, input: texts });
  return resp.data.map((d) => d.embedding as unknown as number[]);
}

async function embedOne(text: string): Promise<number[]> {
  const [v] = await embedTexts([text]);
  return v;
}

function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// ── إدخال مصدر واحد (يستبدل مقاطعه القديمة) ───────────────────────
export async function ingestSource(params: {
  sourceType: RagSourceType;
  sourceId: string;
  title?: string | null;
  text: string;
}): Promise<number> {
  const { sourceType, sourceId, title } = params;
  const text = (params.text || "").trim();

  // إزالة المقاطع القديمة لهذا المصدر (تحديث نظيف)
  await prisma.ragChunk.deleteMany({ where: { sourceType, sourceId } });

  if (!text) return 0;

  const chunks = splitIntoChunks(text, 900).filter((c) => c.trim().length > 30);
  if (chunks.length === 0) return 0;

  const embeddings = await embedTexts(chunks);

  await prisma.ragChunk.createMany({
    data: chunks.map((c, idx) => ({
      sourceType,
      sourceId,
      title: title || null,
      text: c,
      idx,
      embedding: embeddings[idx] ?? [],
    })),
  });

  return chunks.length;
}

// ── بُناة نص المصادر الداخلية ─────────────────────────────────────
export async function ingestLibraryItem(itemId: string): Promise<number> {
  const it = await prisma.libraryItem.findUnique({
    where: { id: itemId },
    select: {
      id: true, titleAr: true, abstractAr: true,
      basicExplanation: true, professionalExplanation: true, commercialExplanation: true,
      isPublished: true,
    },
  });
  if (!it || !it.isPublished) {
    await prisma.ragChunk.deleteMany({ where: { sourceType: "LIBRARY", sourceId: itemId } });
    return 0;
  }
  const text = [it.titleAr, it.abstractAr, it.basicExplanation, it.professionalExplanation, it.commercialExplanation]
    .filter(Boolean).join("\n\n");
  return ingestSource({ sourceType: "LIBRARY", sourceId: it.id, title: it.titleAr, text });
}

export async function ingestConsultation(consultId: number): Promise<number> {
  const c = await prisma.consultation.findUnique({
    where: { id: consultId },
    select: { id: true, title: true, description: true, answer: true },
  });
  if (!c || !c.answer) return 0;
  const text = `سؤال: ${c.description || c.title}\n\nإجابة: ${c.answer}`;
  return ingestSource({ sourceType: "CONSULT", sourceId: String(c.id), title: c.title, text });
}

// ── الاسترجاع: أعلى K مقاطع تشابهاً للسؤال ────────────────────────
export type RetrievedChunk = {
  text: string;
  title: string | null;
  sourceType: string;
  sourceId: string;
  score: number;
};

export async function retrieveContext(question: string, k = 6): Promise<RetrievedChunk[]> {
  const q = (question || "").trim();
  if (!q) return [];

  const qVec = await embedOne(q);

  // الحجم الحالي صغير (مئات المقاطع) → cosine في الذاكرة كافٍ.
  const rows = await prisma.ragChunk.findMany({
    select: { text: true, title: true, sourceType: true, sourceId: true, embedding: true },
  });

  const scored = rows
    .map((r) => ({
      text: r.text,
      title: r.title,
      sourceType: r.sourceType,
      sourceId: r.sourceId,
      score: cosine(qVec, r.embedding as unknown as number[]),
    }))
    .filter((r) => r.score > 0.15) // عتبة صلة دنيا
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  return scored;
}
