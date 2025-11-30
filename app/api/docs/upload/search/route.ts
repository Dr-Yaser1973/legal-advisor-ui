 // app/api/docs/search/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEmbedding, cosineSim } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { query, k = 8 } = (await req.json()) as { query?: string; k?: number };
  if (!query) {
    return NextResponse.json({ error: "query required" }, { status: 400 });
  }

  // 1) تضمين السؤال
  const qVec = await getEmbedding(query);

  // 2) اجلب مجموعة معقولة من المقاطع (يمكن لاحقًا التصفية حسب مستند/تصنيف)
  const chunks = await prisma.legalDocChunk.findMany({
    include: { embedding: true, document: true },
    take: 2000,
  });

  // 3) احسب التشابه ورتّب
  const scored = chunks
    .filter((c) => Array.isArray(c.embedding?.embedding))
    .map((c) => ({
      id: c.id,
      page: (c.idx ?? 0) + 1, // idx من السكيمة، نعرضه كـ page للواجهة
      text: c.text,
      docTitle: c.document?.title ?? "",
      score: cosineSim(qVec, c.embedding!.embedding as number[]),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  return NextResponse.json({ matches: scored });
}
