// app/api/blog/posts/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/guards";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

// ===============================
// GET — جلب مقال واحد
// ===============================
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, image: true } },
        categories: { select: { category: true } },
        tags: { select: { tag: true } },
        comments: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { id: true, name: true, image: true } },
          },
        },
      },
    });

    if (!post || post.status !== "PUBLISHED") {
      return NextResponse.json({ ok: false, error: "المقال غير موجود." }, { status: 404 });
    }

    // زيادة عداد المشاهدات
    await prisma.blogPost.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ ok: true, post });
  } catch (err) {
    console.error("BLOG_POST_GET_ERROR", err);
    return NextResponse.json({ ok: false, error: "حدث خطأ غير متوقع." }, { status: 500 });
  }
}

// ===============================
// PATCH — تعديل مقال
// ===============================
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.res;

    const { slug } = await context.params;
    const body = await req.json();

    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post) {
      return NextResponse.json({ ok: false, error: "المقال غير موجود." }, { status: 404 });
    }

    // فقط الكاتب أو الأدمن يستطيع التعديل
    if (post.authorId !== auth.user.id && auth.user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, error: "ليست لديك صلاحية التعديل." }, { status: 403 });
    }

    const isAdmin = auth.user.role === "ADMIN";

    const updated = await prisma.blogPost.update({
      where: { slug },
      data: {
        title:       body.title       ?? undefined,
        content:     body.content     ?? undefined,
        excerpt:     body.excerpt     ?? undefined,
        coverImage:  body.coverImage  ?? undefined,
        status:      isAdmin ? (body.status ?? undefined) : "PENDING",
        publishedAt: isAdmin && body.status === "PUBLISHED" ? new Date() : undefined,
      },
      select: { id: true, slug: true, status: true },
    });

    return NextResponse.json({ ok: true, post: updated });
  } catch (err) {
    console.error("BLOG_POST_PATCH_ERROR", err);
    return NextResponse.json({ ok: false, error: "حدث خطأ غير متوقع." }, { status: 500 });
  }
}

// ===============================
// DELETE — حذف مقال
// ===============================
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.res;

    const { slug } = await context.params;

    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post) {
      return NextResponse.json({ ok: false, error: "المقال غير موجود." }, { status: 404 });
    }

    if (post.authorId !== auth.user.id && auth.user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, error: "ليست لديك صلاحية الحذف." }, { status: 403 });
    }

    await prisma.blogPost.delete({ where: { slug } });

    return NextResponse.json({ ok: true, message: "تم حذف المقال." });
  } catch (err) {
    console.error("BLOG_POST_DELETE_ERROR", err);
    return NextResponse.json({ ok: false, error: "حدث خطأ غير متوقع." }, { status: 500 });
  }
}
