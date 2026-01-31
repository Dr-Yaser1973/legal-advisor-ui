 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const MODEL = process.env.EMBEDDING_MODEL ?? "text-embedding-3-small";
const BATCH = 64;

async function backoff<T>(fn: () => Promise<T>, tries = 3): Promise<T> {
  for (let t = 0; t < tries; t++) {
    try {
      return await fn();
    } catch (e) {
      if (t === tries - 1) throw e;
      await new Promise((r) => setTimeout(r, 600 * (t + 1)));
    }
  }
  throw new Error("unreachable");
}

export async function POST(req: Request) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth.ok) return auth.res;

  try {
    const body = (await req.json().catch(() => ({}))) as { documentId?: number };
    const documentId = body?.documentId;

    const chunks = await prisma.legalDocChunk.findMany({
      where: { ...(documentId ? { documentId } : {}), embedding: null },
      select: { id: true, text: true },
      take: 5000,
    });

    if (chunks.length === 0) {
      return NextResponse.json({ ok: true, message: "لا توجد مقاطع بحاجة لتضمين." });
    }

    let created = 0;

    for (let i = 0; i < chunks.length; i += BATCH) {
      const batch = chunks.slice(i, i + BATCH);
      const inputs = batch.map((c) => (c.text && c.text.trim().length > 0 ? c.text : " "));

      const resp = await backoff(() => openai.embeddings.create({ model: MODEL, input: inputs }));

      await prisma.$transaction(
        batch.map((c, idx) =>
          prisma.chunkEmbedding.create({
            data: {
              chunkId: c.id,
              embedding: resp.data[idx].embedding as unknown as number[],
            },
          }),
        ),
      );

      created += batch.length;
    }

    return NextResponse.json({ ok: true, created });
  } catch (err: any) {
    console.error("ingest error:", err);
    return NextResponse.json({ ok: false, error: err?.message || "ingest failed" }, { status: 500 });
  }
}
