 // lib/search.ts
import { prisma } from "./prisma";
import { getEmbedding, cosineSim } from "./ai";

export async function hybridSearch(query: string, limit = 10) {
  const vector = await getEmbedding(query);

  const docs = await prisma.$queryRawUnsafe<any[]>(`
    SELECT id, title, text, embedding <=> '[${vector}]' AS distance
    FROM "ChunkEmbedding"
    ORDER BY distance ASC
    LIMIT ${limit};
  `);

  return docs;
}

export async function semanticSearch(query: string, limit = 10) {
  return hybridSearch(query, limit);
}