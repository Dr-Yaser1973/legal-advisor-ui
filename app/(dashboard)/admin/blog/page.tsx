"use client";
import { useEffect, useState } from "react";
 import { Trash2, Eye, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
interface Post {
  id: number;
  title: string;
  slug: string;
  status: "PENDING" | "PUBLISHED" | "REJECTED" | "ARCHIVED";
  views: number;
  createdAt: string;
  publishedAt: string | null;
  author: { id: number; name: string };
  _count: { comments: number };
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "بانتظار المراجعة", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  PUBLISHED: { label: "منشور",            color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  REJECTED:  { label: "مرفوض",           color: "text-red-400 bg-red-500/10 border-red-500/20" },
  ARCHIVED:  { label: "مؤرشف",           color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20" },
};

export default function AdminBlogPage() {
  const [posts,   setPosts]   = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState<string>("PENDING");

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  async function fetchPosts() {
    setLoading(true);
    const res  = await fetch(`/api/blog/posts?status=${filter}&limit=50`);
    const data = await res.json();
    if (data.ok) setPosts(data.posts);
    setLoading(false);
  }

  async function updateStatus(slug: string, status: string) {
    const res = await fetch(`/api/blog/posts/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.ok) fetchPosts();
  }

  async function deletePost(slug: string) {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return;
    const res = await fetch(`/api/blog/posts/${slug}`, { method: "DELETE" });
    const data = await res.json();
    if (data.ok) fetchPosts();
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">

        {/* الرأس */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">إدارة المدونة</h1>
            <p className="text-sm text-zinc-400 mt-1">مراجعة ونشر مقالات المدونة</p>
          </div>
        </div>

        {/* فلتر الحالة */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {Object.entries(STATUS_LABEL).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-xl text-xs font-medium border transition ${
                filter === key
                  ? val.color
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>

        {/* الجدول */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            لا توجد مقالات بهذه الحالة
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-4 flex items-center gap-4"
              >
                {/* الحالة */}
                <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 ${STATUS_LABEL[post.status].color}`}>
                  {STATUS_LABEL[post.status].label}
                </span>

                {/* المعلومات */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {post.title}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {post.author.name} ·{" "}
                    {new Date(post.createdAt).toLocaleDateString("ar-IQ")} ·{" "}
                    {post.views} مشاهدة ·{" "}
                    {post._count.comments} تعليق
                  </p>
                </div>

                {/* الإجراءات */}
                <div className="flex items-center gap-2 flex-shrink-0">
                     {/* معاينة */}
<Link
  href={`/blog/${post.slug}`}
  target="_blank"
  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
  title="معاينة"
>
  <Eye className="w-4 h-4 text-zinc-400" />
</Link>

                  {/* نشر */}
                  {post.status !== "PUBLISHED" && (
                    <button
                      onClick={() => updateStatus(post.slug, "PUBLISHED")}
                      className="p-2 rounded-lg bg-emerald-900/30 hover:bg-emerald-900/60 transition"
                      title="نشر"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </button>
                  )}

                  {/* رفض */}
                  {post.status === "PENDING" && (
                    <button
                      onClick={() => updateStatus(post.slug, "REJECTED")}
                      className="p-2 rounded-lg bg-red-900/30 hover:bg-red-900/60 transition"
                      title="رفض"
                    >
                      <XCircle className="w-4 h-4 text-red-400" />
                    </button>
                  )}

                  {/* أرشفة */}
                  {post.status === "PUBLISHED" && (
                    <button
                      onClick={() => updateStatus(post.slug, "ARCHIVED")}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
                      title="أرشفة"
                    >
                      <Clock className="w-4 h-4 text-zinc-400" />
                    </button>
                  )}

                  {/* حذف */}
                  <button
                    onClick={() => deletePost(post.slug)}
                    className="p-2 rounded-lg bg-red-900/20 hover:bg-red-900/40 transition"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
