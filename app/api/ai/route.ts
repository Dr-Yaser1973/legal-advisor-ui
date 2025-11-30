 
 // app/api/ai/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEmbedding, cosineSim, generateAnswer } from "@/lib/ai";
import { buildRagPrompt, formatCitations } from "@/lib/rag";

export const runtime = "nodejs";

/**
 * Body:
 * { "question": "..." , "k": 8 }
 */
export async function POST(req: Request) {
  try {
    const { question, k = 8 } = await req.json();
    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "question is required" }, { status: 400 });
    }

    // 1) Embed للسؤال
    const qVec = await getEmbedding(question);

    // 2) استرجاع مقاطع من المكتبة مع التضمين
    const chunks = await prisma.legalDocChunk.findMany({
      include: { embedding: true, document: true },
      take: 2000, // حد أعلى كبداية (حسّن لاحقًا بتصفية حسب وثيقة/وسوم)
    });

    // 3) حساب التشابه وترتيب أفضل K
    const matches = chunks
      .filter((c) => c.embedding?.vector)
      .map((c) => ({
        docTitle: c.document?.title ?? "",
        idx: c.idx,
        text: c.text,
        score: cosineSim(qVec, c.embedding!.vector as number[]),
      }))
      .sort((a, b) => b.score! - a.score!)
      .slice(0, k);

    // 4) بناء الـPrompt وتوليد الإجابة
    const prompt = buildRagPrompt(question, matches);
    const answer = await generateAnswer(prompt);

    // 5) إرجاع الإجابة + المراجع
    return NextResponse.json({
      ok: true,
      answer,
      sources: matches.map((m) => ({ title: m.docTitle, idx: m.idx })),
      debug: { k, used: matches.length }, // احذف debug لاحقًا إن أردت
    });
  } catch (err: any) {
    console.error("AI route error:", err);
    return NextResponse.json({ error: "failed to generate answer" }, { status: 500 });
  }
}
