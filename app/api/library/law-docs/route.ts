
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    title,
    jurisdiction,
    category,   // "LAW" | "FIQH" | "ACADEMIC_STUDY"
    year,
    sourceUrl,
    filePath,
    pagesCount,
    createdById,
    text,
  } = body;

  if (!title || !jurisdiction || !category) {
    return NextResponse.json({ error: "حقول مفقودة" }, { status: 400 });
    }

  const doc = await prisma.lawDoc.create({
    data: {
      title,
      jurisdiction,
      category,       // Enum
      year,
      sourceUrl,
      filePath,
      pagesCount,
      text,
      createdById: createdById ?? null,
    },
  });

  return NextResponse.json({ doc });
}
