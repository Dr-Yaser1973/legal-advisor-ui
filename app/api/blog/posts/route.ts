// app/api/blog/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/guards";

export const runtime = "nodejs";

// ===============================
// GET — جلب المقالات
// ===============================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page     = Number(searchParams.get("page") ?? 1);
    const limit    = Number(searchParams.get("limit") ?? 10);
    const category = searchParams.get("category") ?? undefined;
    const tag      = searchParams.get("tag") ?? undefined;
    const status   = searchParams.get("status") ?? "PUBLISHED";

    const skip = (page - 1) * limit;

    const where: any = { status };

    if (category) {
      where.categories = {
        some: { category: { slug: category } },
      };
    }

    if (tag) {
      where.tags = {
        some: { tag: { slug: tag } },
      };
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          views: true,
          publishedAt: true,
          createdAt: true,
          author: {
            select: { id: true, name: true, image: true },
          },
          categories: {
            select: { category: { select: { id: true, name: true, slug: true } } },
          },
          tags: {
            select: { tag: { select: { id: true, name: true, slug: true } } },
          },
          _count: { select: { comments: true } },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      ok: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("BLOG_POSTS_GET_ERROR", err);
    return NextResponse.json({ ok: false, error: "حدث خطأ غير متوقع." }, { status: 500 });
  }
}

// ===============================
// POST — إنشاء مقال جديد
// ===============================
export async function POST(req: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.res;

    const { title, content, excerpt, coverImage, categoryIds, tagIds } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { ok: false, error: "العنوان والمحتوى مطلوبان." },
        { status: 400 }
      );
    }

    // توليد slug من العنوان
    const baseSlug = title
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, "")
      .toLowerCase();

    const slug = `${baseSlug}-${Date.now()}`;

    // الأدمن ينشر مباشرة — غيره ينتظر المراجعة
    const isAdmin = auth.user.role === "ADMIN";
    const status  = isAdmin ? "PUBLISHED" : "PENDING";

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        status,
        publishedAt: isAdmin ? new Date() : null,
        authorId: auth.user.id,
        categories: categoryIds?.length ? {
          create: categoryIds.map((id: number) => ({ categoryId: id })),
        } : undefined,
        tags: tagIds?.length ? {
          create: tagIds.map((id: number) => ({ tagId: id })),
        } : undefined,
      },
      select: { id: true, slug: true, status: true },
    });

    // إشعار الأدمن إذا كان المقال بانتظار المراجعة
    if (!isAdmin) {
      const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { id: true },
      });
      if (admins.length > 0) {
        await prisma.notification.createMany({
          data: admins.map((a) => ({
            userId: a.id,
            title: "مقال جديد بانتظار المراجعة",
            body: `${auth.user.role === "LAWYER" ? "المحامي" : "المستخدم"} كتب مقالاً جديداً: ${title}`,
          })),
        });
      }
    }

    return NextResponse.json({ ok: true, post }, { status: 201 });
  } catch (err) {
    console.error("BLOG_POST_CREATE_ERROR", err);
    return NextResponse.json({ ok: false, error: "حدث خطأ غير متوقع." }, { status: 500 });
  }
}
