 "use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Eye, MessageCircle, Tag, AlertCircle, RefreshCw } from "lucide-react";

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

const PAGE_SIZE = 9;
const PAGE_WINDOW = 2; // عدد الصفحات المعروضة حول الصفحة الحالية

function formatDate(iso: string) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("ar-IQ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export default function BlogPage() {
  const [posts, setPosts]                   = useState<Post[]>([]);
  const [categories, setCategories]         = useState<Category[]>([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState<string | null>(null);
  const [page, setPage]                     = useState(1);
  const [totalPages, setTotalPages]         = useState(1);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [reloadKey, setReloadKey]           = useState(0);

  // التصنيفات
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/blog/categories");
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!ignore && data.ok) setCategories(data.categories);
      } catch {
        // فشل تحميل التصنيفات غير حرج — تبقى قائمة "الكل" متاحة
      }
    })();
    return () => { ignore = true; };
  }, []);

  // المقالات — مع حارس تجاهل لمنع تعارض الطلبات المتتابعة
  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
        if (activeCategory) params.set("category", activeCategory);

        const res = await fetch(`/api/blog/posts?${params}`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        if (ignore) return;
        if (data.ok) {
          setPosts(data.posts);
          setTotalPages(data.pagination.pages);
        } else {
          throw new Error();
        }
      } catch {
        if (!ignore) setError("تعذّر تحميل المقالات. تحقّق من اتصالك ثم أعد المحاولة.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [page, activeCategory, reloadKey]);

  // نطاق صفحات الترقيم المنزلق
  function pageItems(): (number | "…")[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const items = new Set<number>([1, totalPages, page]);
    for (let i = 1; i <= PAGE_WINDOW; i++) {
      if (page - i >= 1) items.add(page - i);
      if (page + i <= totalPages) items.add(page + i);
    }
    const sorted = [...items].sort((a, b) => a - b);
    const out: (number | "…")[] = [];
    let prev = 0;
    for (const n of sorted) {
      if (prev && n - prev > 1) out.push("…");
      out.push(n);
      prev = n;
    }
    return out;
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen"
      style={{ background: "#0f1923", color: "#e8eaed" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* الرأس */}
        <header className="mb-12 text-center">
          <span
            className="inline-block text-xs tracking-[0.3em] mb-4 font-medium"
            style={{ color: "#c9a84c" }}
          >
            المدوّنة القانونية
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold mb-3 leading-tight"
            style={{ color: "#ffffff" }}
          >
            مقالات وتحليلات قانونية
          </h1>
          <p className="text-sm" style={{ color: "#8a94a0" }}>
            رؤى من محامين ومتخصصين في القانون العراقي والعربي
          </p>
          <div
            className="mx-auto mt-6 h-px w-24"
            style={{ background: "linear-gradient(to left, transparent, #c9a84c, transparent)" }}
          />
        </header>

        {/* التصنيفات */}
        <nav className="flex flex-wrap gap-2 mb-10 justify-center">
          <CategoryChip
            active={!activeCategory}
            label="الكل"
            onClick={() => { setActiveCategory(null); setPage(1); }}
          />
          {categories.map((cat) => (
            <CategoryChip
              key={cat.id}
              active={activeCategory === cat.slug}
              label={`${cat.name} (${cat._count.posts})`}
              onClick={() => { setActiveCategory(cat.slug); setPage(1); }}
            />
          ))}
        </nav>

        {/* الحالات */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl h-72 animate-pulse"
                style={{ background: "#16222e" }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <AlertCircle className="w-10 h-10 mx-auto mb-4" style={{ color: "#c9a84c" }} />
            <p className="mb-5 text-sm" style={{ color: "#a8b2bd" }}>{error}</p>
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition"
              style={{ background: "#4caf82", color: "#0f1923" }}
            >
              <RefreshCw className="w-4 h-4" /> إعادة المحاولة
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20" style={{ color: "#6b7682" }}>
            <span className="text-5xl block mb-4">⚖️</span>
            لا توجد مقالات في هذا التصنيف بعد
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, idx) => (
              <PostCard key={post.id} post={post} index={(page - 1) * PAGE_SIZE + idx + 1} />
            ))}
          </div>
        )}

        {/* الترقيم المنزلق */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center items-center gap-1.5 mt-12">
            <PageButton
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              label="السابق"
            />
            {pageItems().map((it, i) =>
              it === "…" ? (
                <span key={`gap-${i}`} className="px-1" style={{ color: "#4a5560" }}>…</span>
              ) : (
                <button
                  key={it}
                  onClick={() => setPage(it)}
                  className="w-9 h-9 rounded-lg text-sm font-medium transition"
                  style={
                    page === it
                      ? { background: "#4caf82", color: "#0f1923" }
                      : { background: "#16222e", color: "#a8b2bd" }
                  }
                >
                  {it}
                </button>
              )
            )}
            <PageButton
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              label="التالي"
            />
          </div>
        )}

      </div>
    </div>
  );
}

/* ---------- مكوّنات فرعية ---------- */

function CategoryChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 rounded-full text-sm transition"
      style={
        active
          ? { background: "#4caf82", color: "#0f1923", fontWeight: 600 }
          : { background: "#16222e", color: "#8a94a0" }
      }
    >
      {label}
    </button>
  );
}

function PageButton({
  disabled,
  onClick,
  label,
}: {
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-3 h-9 rounded-lg text-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ background: "#16222e", color: "#a8b2bd" }}
    >
      {label}
    </button>
  );
}

/* رمز الميزان — مرسوم بـSVG بلون الهوية، موحّد على كل الأجهزة */
function ScaleIcon() {
  return (
    <svg
      width="46"
      height="46"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#c9a84c"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-500 group-hover:scale-110"
      style={{ opacity: 0.85 }}
      aria-hidden="true"
    >
      <path d="M12 3v18" />
      <path d="M7 21h10" />
      <path d="M5 7h14" />
      <path d="M5 7l-2.5 6a3 3 0 0 0 5 0z" />
      <path d="M19 7l-2.5 6a3 3 0 0 0 5 0z" />
      <circle cx="12" cy="4" r="1.3" />
    </svg>
  );
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const categoryName = post.categories[0]?.category.name ?? "قانون";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative rounded-2xl overflow-hidden transition-all duration-300"
      style={{ background: "#16222e", border: "1px solid #24323f" }}
    >
      {/* غلاف مولّد بهوية المنصّة — لا صور خارجية */}
      <div
        className="relative h-44 w-full overflow-hidden flex items-center justify-center"
        style={{ background: "radial-gradient(circle at 30% 20%, #1b2935 0%, #0f1923 70%)" }}
      >
        {/* نقش خفيف */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 1px, transparent 14px)",
          }}
        />
        <ScaleIcon />
        {/* اسم التصنيف على الغلاف */}
        <span
          className="absolute bottom-3 right-4 text-xs font-medium tracking-wide"
          style={{ color: "#c9a84c" }}
        >
          {categoryName}
        </span>
        {/* الرقم التسلسلي */}
        <span
          className="absolute top-3 left-4 text-sm font-bold tabular-nums"
          style={{ color: "rgba(201,168,76,0.5)", fontFamily: "serif" }}
        >
          {String(index).padStart(2, "0")}
        </span>
      </div>

      <div className="p-5 space-y-3">
        {/* التصنيفات */}
        {post.categories.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {post.categories.slice(0, 2).map(({ category }) => (
              <span
                key={category.id}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "rgba(201,168,76,0.12)", color: "#c9a84c" }}
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {/* العنوان */}
        <h2 className="text-base font-bold leading-snug line-clamp-2" style={{ color: "#ffffff" }}>
          {post.title}
        </h2>

        {/* المقتطف */}
        {post.excerpt && (
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#8a94a0" }}>
            {post.excerpt}
          </p>
        )}

        {/* الوسوم */}
        {post.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <Tag className="w-3 h-3" style={{ color: "#4a5560" }} />
            {post.tags.slice(0, 3).map(({ tag }) => (
              <span key={tag.id} className="text-xs" style={{ color: "#6b7682" }}>
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* المعلومات */}
        <div
          className="flex items-center justify-between text-xs pt-3"
          style={{ borderTop: "1px solid #24323f", color: "#6b7682" }}
        >
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {formatDate(post.publishedAt)}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" /> {post.views}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" /> {post._count.comments}
            </span>
          </div>
        </div>

        {/* الكاتب */}
        <div className="flex items-center gap-2 pt-1">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
            style={{ background: "#24323f", color: "#8a94a0" }}
          >
            {(post.author.name ?? "ك").charAt(0)}
          </div>
          <span className="text-xs" style={{ color: "#8a94a0" }}>
            {post.author.name ?? "كاتب"}
          </span>
        </div>
      </div>

      {/* خط ذهبي/أخضر سفلي يظهر عند المرور */}
      <div
        className="absolute bottom-0 right-0 left-0 h-0.5 origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
        style={{ background: "linear-gradient(to left, #c9a84c, #4caf82)" }}
      />
    </Link>
  );
}
