 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildRagMessages } from "@/lib/rag";
import { chatCompletion, getEmbedding, cosineSim } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { question, k = 8 } = await req.json();
    if (!question) {
      return NextResponse.json({ error: "question is required" }, { status: 400 });
    }

    const qVec = await getEmbedding(question);

    const chunks = await prisma.legalDocChunk.findMany({
      include: { embedding: true, document: true },
      take: 2000,
    });

    const matches = chunks
      .filter((c) => c.embedding?.embedding)
      .map((c) => ({
        title: c.document?.title ?? "",
        idx: c.idx,
        text: c.text,
        score: cosineSim(qVec, c.embedding!.embedding as number[]),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k);

    const context = matches
      .map(
        (m, i) =>
          `المقطع ${i + 1} (من: ${m.title}) [درجة الصلة: ${m.score.toFixed(
            3
          )}]\n${m.text}`
      )
      .join("\n\n---\n\n");

    const messages = buildRagMessages(question, context);
    const res = await chatCompletion(messages);
    const answer = res.choices[0]?.message?.content ?? "";

    return NextResponse.json({ ok: true, answer, sources: matches });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI error" }, { status: 500 });
  }
}
