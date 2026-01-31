 // app/api/docs/search/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEmbedding, cosineSim } from "@/lib/ai";
import { requireUser } from "@/lib/auth/guards";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const auth = await requireUser();
  if (!auth.ok) return auth.res;

  const { query, k = 8 } = (await req.json().catch(() => ({}))) as { query?: string; k?: number };
  if (!query) return NextResponse.json({ error: "query required" }, { status: 400 });

  const qVec = await getEmbedding(query);

  const chunks = await prisma.legalDocChunk.findMany({
    include: { embedding: true, document: true },
    take: 2000,
  });

  const scored = chunks
    .filter((c: any) => Array.isArray(c.embedding?.embedding))
    .map((c: any) => ({
      id: c.id,
      page: (c.idx ?? 0) + 1,
      text: c.text,
      docTitle: c.document?.title ?? "",
      score: cosineSim(qVec, c.embedding!.embedding as number[]),
    }))
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, Math.min(Math.max(Number(k), 1), 20));

  return NextResponse.json({ matches: scored });
}
