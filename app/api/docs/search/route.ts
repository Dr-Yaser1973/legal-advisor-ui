
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEmbedding, cosineSim } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { query, k = 8 } = await req.json();
  if (!query) return NextResponse.json({ error: "query required" }, { status: 400 });

  const qVec = await getEmbedding(query);

  // اجلب مجموعة من المقاطع مع التضمين والمستند
  const chunks = await prisma.legalDocChunk.findMany({
    include: { embedding: true, document: true },
    take: 2000,
  });

  const scored = chunks
    .filter((c) => c.embedding?.vector)
    .map((c) => ({
      id: c.id,
      idx: c.idx,
      text: c.text,
      docTitle: c.document?.title ?? "",
      score: cosineSim(qVec, c.embedding!.vector as number[]),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  return NextResponse.json({ matches: scored });
}
