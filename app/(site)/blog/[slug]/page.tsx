"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, Eye, MessageCircle, ArrowRight } from "lucide-react";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: { id: number; name: string; image: string | null };
}

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  views: number;
  publishedAt: string;
  author: { id: number; name: string; image: string | null };
  categories: { category: { id: number; name: string; slug: string } }[];
  tags: { tag: { id: number; name: string; slug: string } }[];
  comments: Comment[];
}

export default function BlogPostPage() {
  const { slug }                    = useParams<{ slug: string }>();
  const [post, setPost]             = useState<Post | null>(null);
  const [loading, setLoading]       = useState(true);
  const [comment, setComment]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    if (slug) fetchPost();
  }, [slug]);

  async function fetchPost() {
    const res  = await fetch(`/api/blog/posts/${slug}`);
    const data = await res.json();
    if (data.ok) setPost(data.post);
    setLoading(false);
  }

  async function submitComment() {
    if (!comment.trim()) return;
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/blog/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post?.id, content: comment }),
    });

    const data = await res.json();

    if (data.ok) {
      setSubmitted(true);
      setComment("");
    } else {
      setError(data.error ?? "حدث خطأ.");
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        المقال غير موجود
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 py-10">

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
          <span>{post.author.name ?? "كاتب"}</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" /> {post.views}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" /> {post.comments.length}
            </span>
            <span>
              {new Date(post.publishedAt).toLocaleDateString("ar-IQ")}
            </span>
          </div>
        </div>

        {/* صورة الغلاف */}
        {post.coverImage && (
          <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-8">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* المحتوى */}
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

        {/* التعليقات */}
        <div className="mt-10">
          <h2 className="text-lg font-bold mb-6">
            التعليقات ({post.comments.length})
          </h2>

          {/* قائمة التعليقات */}
          {post.comments.length === 0 ? (
            <p className="text-zinc-500 text-sm mb-6">لا توجد تعليقات بعد — كن أول من يعلّق.</p>
          ) : (
            <div className="space-y-4 mb-8">
              {post.comments.map((c) => (
                <div key={c.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">{c.author.name ?? "مستخدم"}</span>
                    <span className="text-xs text-zinc-500">
                      {new Date(c.createdAt).toLocaleDateString("ar-IQ")}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300">{c.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* إضافة تعليق */}
          {submitted ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-400">
              ✅ تم إرسال تعليقك — سيظهر بعد مراجعة الإدارة.
            </div>
          ) : (
            <div className="space-y-3">
              {error && (
                <div className="rounded-lg border border-red-800 bg-red-950/40 px-3 py-2 text-xs text-red-300">
                  {error}
                </div>
              )}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="اكتب تعليقك هنا..."
                rows={4}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 resize-none"
              />
              <button
                onClick={submitComment}
                disabled={submitting || !comment.trim()}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50"
              >
                {submitting ? "جارٍ الإرسال..." : "إرسال التعليق"}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
