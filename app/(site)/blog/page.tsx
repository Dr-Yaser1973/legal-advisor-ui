"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Eye, MessageCircle, Tag } from "lucide-react";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  views: number;
  publishedAt: string;
  author: { id: number; name: string; image: string | null };
  categories: { category: { id: number; name: string; slug: string } }[];
  tags: { tag: { id: number; name: string; slug: string } }[];
  _count: { comments: number };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  _count: { posts: number };
}

export default function BlogPage() {
  const [posts, setPosts]           = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page, activeCategory]);

  async function fetchCategories() {
    const res = await fetch("/api/blog/categories");
    const data = await res.json();
    if (data.ok) setCategories(data.categories);
  }

  async function fetchPosts() {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "9" });
    if (activeCategory) params.set("category", activeCategory);

    const res  = await fetch(`/api/blog/posts?${params}`);
    const data = await res.json();

    if (data.ok) {
      setPosts(data.posts);
      setTotalPages(data.pagination.pages);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* الرأس */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">المدونة القانونية</h1>
          <p className="text-zinc-400 text-sm">مقالات وتحليلات قانونية من محامين ومتخصصين</p>
        </div>

        {/* التصنيفات */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => { setActiveCategory(null); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm transition ${
              !activeCategory
                ? "bg-emerald-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.slug); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                activeCategory === cat.slug
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {cat.name} ({cat._count.posts})
            </button>
          ))}
        </div>

        {/* المقالات */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-zinc-900 h-64 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            لا توجد مقالات بعد
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-emerald-600/50 transition"
              >
                {/* صورة الغلاف */}
                {post.coverImage ? (
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-zinc-800 flex items-center justify-center">
                    <span className="text-4xl">⚖️</span>
                  </div>
                )}

                <div className="p-4 space-y-3">
                  {/* التصنيفات */}
                  {post.categories.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {post.categories.slice(0, 2).map(({ category }) => (
                        <span
                          key={category.id}
                          className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded-full"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* العنوان */}
                  <h2 className="text-sm font-bold text-white group-hover:text-emerald-400 transition line-clamp-2">
                    {post.title}
                  </h2>

                  {/* المقتطف */}
                  {post.excerpt && (
                    <p className="text-xs text-zinc-400 line-clamp-2">{post.excerpt}</p>
                  )}

                  {/* المعلومات */}
                  <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-800">
                    <span>{post.author.name ?? "كاتب"}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" /> {post._count.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm transition ${
                  page === i + 1
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
