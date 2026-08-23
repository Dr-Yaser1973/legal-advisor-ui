// app/(site)/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Eye, MessageCircle, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sanitizeBlogHtml } from "@/lib/sanitize";
import BlogComments from "./BlogComments";
import ShareButtons from "./ShareButtons";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://smartlegaladvisor.com";

// فكّ ترميز الـ slug العربي بأمان (الروابط تصل مُرمّزة %D8%AA...)
function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

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
  const { slug: rawSlug } = await params;
  const slug = safeDecode(rawSlug);

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

  // صورة المشاركة: غلاف المقال إن وُجد، وإلا صورة مولّدة بهوية المنصّة.
  // نضيف رقم إصدار (v) إلى الرابط لإجبار فيسبوك/الزواحف على تجاهل أي نسخة
  // فاشلة مخزّنة سابقاً (كانت تُخزَّن أثناء فترة عطل توليد الصورة) وجلبها من جديد.
  const OG_VERSION = "2";
  const firstCategory = post.categories[0]?.category?.name ?? "";
  const ogImage =
    post.coverImage ||
    `${BASE_URL}/api/blog/og?title=${encodeURIComponent(
      post.title
    )}&category=${encodeURIComponent(firstCategory)}&v=${OG_VERSION}`;

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
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      tags: post.tags.map((t) => t.tag.name),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [ogImage],
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
  const { slug: rawSlug } = await params;
  const slug = safeDecode(rawSlug);
  const post = await getPost(slug);

  if (!post) notFound();

  // معاينة المقالات غير المنشورة مسموحة للكاتب أو الأدمن فقط
  const isPublished = post.status === "PUBLISHED";
  let isPreview = false;
  if (!isPublished) {
    const session: any = await getServerSession(authOptions as any);
    const viewer = session?.user;
    const canPreview =
      viewer && (viewer.role === "ADMIN" || Number(viewer.id) === post.authorId);
    if (!canPreview) notFound();
    isPreview = true;
  }

  // عدّ المشاهدات انتقل إلى beacon من المتصفّح (BlogViewTracker):
  // مرّة واحدة لكل جلسة، ويستبعد البوتات — فلا نزيد هنا على الخادم
  // حيث تُضخّم كل زحفة/معاينة رابط/إعادة تحميل الرقمَ.

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
      {/* عدّ مشاهدة حقيقية مرّة واحدة لكل جلسة (يستبعد البوتات) — منشور فقط */}
      {isPublished && <BlogViewTracker slug={post.slug} />}
      <article className="max-w-3xl mx-auto px-4 py-10">
        {/* زر العودة */}
        <Link
          href="/blog"
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6 transition"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للمدونة
        </Link>

        {/* شارة المعاينة — يراها الكاتب/الأدمن للمقال غير المنشور */}
        {isPreview && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
            👁️ معاينة — هذا المقال <span className="font-semibold">غير منشور</span> بعد
            (الحالة: {post.status}). يراه المحرّرون فقط.
          </div>
        )}

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

        {/* المحتوى — مُعقَّم خادمياً (يمنع XSS) ومُخدَّم للأرشفة */}
        <div
          className="prose prose-invert prose-zinc max-w-none text-zinc-300 leading-loose text-sm"
          dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.content) }}
        />

        {/* أزرار المشاركة على وسائل التواصل */}
        <ShareButtons url={`${BASE_URL}/blog/${slug}`} title={post.title} />

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
