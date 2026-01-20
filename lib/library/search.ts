 import { prisma } from "@/lib/prisma";
import { LawCategory } from "@prisma/client";

export type LibrarySection = "ALL" | LawCategory;

export async function searchLibrary({
  q,
  section = "ALL",
  take = 20,
}: {
  q: string;
  section?: LibrarySection;
  take?: number;
}) {
  if (!q?.trim()) return { hits: [] };

  const hits = await searchSimple(q.trim(), section, take);
  return { hits };
}

async function searchSimple(
  q: string,
  section: LibrarySection,
  take: number
) {
  const where: any = {
    OR: [
      { title: { contains: q, mode: "insensitive" } },
      { text: { contains: q, mode: "insensitive" } },
    ],
  };

  if (section !== "ALL") {
    where.category = section;
  }

  const rows = await prisma.lawDoc.findMany({
    where,
    select: {
      id: true,
      title: true,
      category: true,
      text: true,
    },
    orderBy: { id: "desc" },
    take,
  });

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    section: r.category,
    snippet: makeSnippet(r.text ?? "", q),
    score: 0.55,
  }));
}

function makeSnippet(text: string, q: string, len = 120) {
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text.slice(0, len) + "...";

  const start = Math.max(0, idx - len / 2);
  return "…" + text.slice(start, start + len) + "…";
}
