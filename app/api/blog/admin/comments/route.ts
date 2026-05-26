// app/api/blog/admin/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";

// GET — جلب التعليقات المعلقة
export async function GET() {
  try {
    const auth = await requireRole([UserRole.ADMIN]);
    if (!auth.ok) return auth.res;

    const comments = await prisma.blogComment.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true } },
        post:   { select: { id: true, title: true, slug: true } },
      },
    });

    return NextResponse.json({ ok: true, comments });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "حدث خطأ." }, { status: 500 });
  }
}
