// app/(site)/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Eye, MessageCircle, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import BlogComments from "./BlogComments";

export const dynamic = "force-dynamic";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://smartlegaladvisor.com";

// ===============================
// جلب المقال مع علاقاته
// ===============================
async function getPost(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, image: true } },
      categories: { select: { category: true } },
      tags: { select: { tag: true } },
      comments: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        include: { author: { select: { id: true, name: true, image: true } } },
      },
    },
  });
}

// ===============================
// SEO لكل مقال (server-rendered)
// ===============================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: {
      title: true,
      excerpt: true,
      coverImage: true,
      status: true,
      publishedAt: true,
      updatedAt: true,
      categories: { select: { category: { select: { name: true } } } },
      tags: { select: { tag: { select: { name: true } } } },
    },
  });

  if (!post || post.status !== "PUBLISHED") {
    return {
      title: "المقال غير موجود | المدونة القانونية",
      robots: { index: false, follow: false },
    };
  }

  const description =
    post.excerpt ||
    `${post.title} — مقال في المدونة القانونية بمنصة المستشار القانوني الذكي.`;

  const url = `${BASE_URL}/blog/${slug}`;

  const keywords = [
    ...post.tags.map((t) => t.tag.name),
    ...post.categories.map((c) => c.category.name),
    post.title,
    "مدونة قانونية",
  ]
    .filter(Boolean)
    .slice(0, 12)
    .join(", ");

  return {
    title: `${post.title} | المدونة القانونية`,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      locale: "ar_IQ",
      siteName: "المستشار القانوني الذكي",
      url,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
      tags: post.tags.map((t) => t.tag.name),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

// ===============================
// الصفحة (Server Component)
// ===============================
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || post.status !== "PUBLISHED") notFound();

  // زيادة عداد المشاهدات (لا يوقف الصفحة إن فشل)
  try {
    await prisma.blogPost.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  } catch {
    /* تجاهل */
  }

  const comments = post.comments.map((c) => ({
    id: c.id,
    content: c.content,
    createdAt: c.createdAt.toISOString(),
    author: {
      id: c.author?.id ?? 0,
      name: c.author?.name ?? null,
      image: c.author?.image ?? null,
    },
  }));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100" dir="rtl">
      <article className="max-w-3xl mx-auto px-4 py-10">
        {/* زر العودة */}
        <Link
          href="/blog"
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6 transition"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للمدونة
        </Link>

        {/* التصنيفات */}
        {post.categories.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {post.categories.map(({ category }) => (
              <span
                key={category.id}
                className="text-xs bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {/* العنوان */}
        <h1 className="text-2xl font-bold text-white mb-4 leading-relaxed">
          {post.title}
        </h1>

        {/* معلومات الكاتب */}
        <div className="flex items-center justify-between text-sm text-zinc-400 mb-6 pb-4 border-b border-zinc-800">
          <span>{post.author?.name ?? "كاتب"}</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" /> {post.views}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" /> {post.comments.length}
            </span>
            {post.publishedAt && (
              <span>
                {new Date(post.publishedAt).toLocaleDateString("ar-IQ")}
              </span>
            )}
          </div>
        </div>

        {/* صورة الغلاف */}
        {post.coverImage && (
          <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* المحتوى — مُخدَّم من الخادم (قابل للأرشفة) */}
        <div
          className="prose prose-invert prose-zinc max-w-none text-zinc-300 leading-loose text-sm"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* الوسوم */}
        {post.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-8 pt-6 border-t border-zinc-800">
            {post.tags.map(({ tag }) => (
              <span
                key={tag.id}
                className="text-xs bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* التعليقات (مكوّن تفاعلي منفصل) */}
        <BlogComments postId={post.id} comments={comments} />
      </article>
    </div>
  );
}
