// app/api/blog/tags/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/guards";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.res;

    const { name } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ ok: false, error: "اسم الوسم مطلوب." }, { status: 400 });
    }

    const slug = name.trim().replace(/\s+/g, "-").toLowerCase();

    // إنشاء أو إعادة الموجود
    const tag = await prisma.blogTag.upsert({
      where: { slug },
      update: {},
      create: { name: name.trim(), slug },
    });

    return NextResponse.json({ ok: true, tag });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "حدث خطأ." }, { status: 500 });
  }
}
