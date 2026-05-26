// app/api/blog/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/guards";

export const runtime = "nodejs";

// GET — جلب كل التصنيفات
export async function GET() {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    });
    return NextResponse.json({ ok: true, categories });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "حدث خطأ." }, { status: 500 });
  }
}

// POST — إنشاء تصنيف (أدمن فقط)
export async function POST(req: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.res;

    if (auth.user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, error: "أدمن فقط." }, { status: 403 });
    }

    const { name } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ ok: false, error: "اسم التصنيف مطلوب." }, { status: 400 });
    }

    const slug = name.trim().replace(/\s+/g, "-").toLowerCase();

    const category = await prisma.blogCategory.create({
      data: { name: name.trim(), slug },
    });

    return NextResponse.json({ ok: true, category }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "حدث خطأ." }, { status: 500 });
  }
}
