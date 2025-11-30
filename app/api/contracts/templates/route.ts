import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ===== GET: جميع القوالب =====
export async function GET() {
  const items = await prisma.contractTemplate.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, language: true, bodyHtml: true },
  });

  return NextResponse.json({ items });
}

// ===== POST: إنشاء قالب جديد =====
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, language, bodyHtml } = body;

    if (!title || !slug || !bodyHtml) {
      return NextResponse.json({ error: "حقول ناقصة" }, { status: 400 });
    }

    const created = await prisma.contractTemplate.create({
      data: {
        title,
        slug,
        language: language || "AR",
        bodyHtml,
      },
    });

    return NextResponse.json({ created });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطأ أثناء إنشاء القالب" }, { status: 500 });
  }
}

