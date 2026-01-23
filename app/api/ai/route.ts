 // app/api/ai/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildRagPrompt } from "@/lib/rag";

export const runtime = "nodejs";

/**
 * Body:
 * { "question": "..." , "k": 8 }
 */
export async function POST(req: Request) {
  try {
    const { question, k = 8 } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "question is required" },
        { status: 400 }
      );
    }

    // ===============================
    // Lazy import للذكاء (Build-Safe)
    // ===============================
    const { getEmbedding, cosineSim, generateAnswer } = await import(
      "@/lib/ai"
    );

    // 1) توليد Embedding للسؤال
    const qVec = await getEmbedding(question);

    // 2) جلب المقاطع من المكتبة
    const chunks = await prisma.legalDocChunk.findMany({
      include: { embedding: true, document: true },
      take: 2000,
    });

    // 3) حساب التشابه وترتيب أفضل K
    const matches = chunks
      .filter((c) => c.embedding?.embedding)
      .map((c) => ({
        docTitle: c.document?.title ?? "",
        idx: c.idx,
        text: c.text,
        score: cosineSim(qVec, c.embedding!.embedding as number[]),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k);

    // 4) بناء سياق نصي للـ RAG
    const context = matches
      .map(
        (m, i) =>
          `المقطع ${i + 1} (من: ${m.docTitle}) [درجة الصلة: ${m.score.toFixed(
            3
          )}]\n${m.text}`
      )
      .join("\n\n---\n\n");

    // 5) بناء البرومبت وتوليد الإجابة
    const prompt = buildRagPrompt(question, context);
    const answer = await generateAnswer(question, context);

    // 6) إرجاع النتيجة
    return NextResponse.json({
      ok: true,
      answer,
      sources: matches.map((m) => ({
        title: m.docTitle,
        idx: m.idx,
        score: m.score,
      })),
      debug: { k, used: matches.length },
    });
  } catch (err: any) {
    console.error("AI route error:", err);

    if (err.message?.includes("OPENAI_API_KEY")) {
      return NextResponse.json(
        { ok: false, error: "خدمة الذكاء الاصطناعي غير مفعّلة حالياً" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { ok: false, error: "failed to generate answer" },
      { status: 500 }
    );
  }
}
