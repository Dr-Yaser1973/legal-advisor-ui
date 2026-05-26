// app/api/blog/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/guards";

export const runtime = "nodejs";

// ===============================
// POST — إضافة تعليق
// ===============================
export async function POST(req: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.res;

    const { postId, content } = await req.json();

    if (!postId || !content?.trim()) {
      return NextResponse.json(
        { ok: false, error: "معرف المقال والتعليق مطلوبان." },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.findUnique({
      where: { id: postId, status: "PUBLISHED" },
    });

    if (!post) {
      return NextResponse.json({ ok: false, error: "المقال غير موجود." }, { status: 404 });
    }

    // الأدمن تعليقه معتمد مباشرة
    const isAdmin = auth.user.role === "ADMIN";

    const comment = await prisma.blogComment.create({
      data: {
        postId,
        authorId: auth.user.id,
        content:  content.trim(),
        status:   isAdmin ? "APPROVED" : "PENDING",
      },
      select: { id: true, content: true, status: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, comment }, { status: 201 });
  } catch (err) {
    console.error("BLOG_COMMENT_CREATE_ERROR", err);
    return NextResponse.json({ ok: false, error: "حدث خطأ غير متوقع." }, { status: 500 });
  }
}

// ===============================
// PATCH — موافقة أو رفض تعليق (أدمن فقط)
// ===============================
export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.res;

    if (auth.user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, error: "أدمن فقط." }, { status: 403 });
    }

    const { commentId, status } = await req.json();

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ ok: false, error: "حالة غير صالحة." }, { status: 400 });
    }

    const comment = await prisma.blogComment.update({
      where: { id: commentId },
      data: { status },
      select: { id: true, status: true },
    });

    return NextResponse.json({ ok: true, comment });
  } catch (err) {
    console.error("BLOG_COMMENT_PATCH_ERROR", err);
    return NextResponse.json({ ok: false, error: "حدث خطأ غير متوقع." }, { status: 500 });
  }
}
