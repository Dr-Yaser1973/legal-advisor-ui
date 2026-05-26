"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus, X } from "lucide-react";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function NewBlogPostPage() {
  const router = useRouter();

  const [title,       setTitle]       = useState("");
  const [content,     setContent]     = useState("");
  const [excerpt,     setExcerpt]     = useState("");
  const [coverImage,  setCoverImage]  = useState("");
  const [categories,  setCategories]  = useState<Category[]>([]);
  const [selectedCats, setSelectedCats] = useState<number[]>([]);
  const [tagInput,    setTagInput]    = useState("");
  const [tags,        setTags]        = useState<string[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const res  = await fetch("/api/blog/categories");
    const data = await res.json();
    if (data.ok) setCategories(data.categories);
  }

  function addTag() {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function toggleCategory(id: number) {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  async function handleSubmit() {
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError("العنوان والمحتوى مطلوبان.");
      return;
    }

    setLoading(true);

    try {
      // إنشاء الوسوم أولاً إذا لزم
      const tagIds: number[] = [];
      for (const tagName of tags) {
        const res  = await fetch("/api/blog/tags", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: tagName }),
        });
        const data = await res.json();
        if (data.ok) tagIds.push(data.tag.id);
      }

      const res = await fetch("/api/blog/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:       title.trim(),
          content:     content.trim(),
          excerpt:     excerpt.trim() || null,
          coverImage:  coverImage.trim() || null,
          categoryIds: selectedCats,
          tagIds,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        setError(data.error ?? "حدث خطأ.");
        return;
      }

      router.push("/blog");
    } catch {
      setError("حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition";
  const labelCls = "block text-xs text-zinc-400 mb-1 font-medium";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* الرأس */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/blog" className="text-zinc-400 hover:text-white transition">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">كتابة مقال جديد</h1>
        </div>

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300 mb-6">
            {error}
          </div>
        )}

        <div className="space-y-5">

          {/* العنوان */}
          <div>
            <label className={labelCls}>عنوان المقال *</label>
            <input
              className={inputCls}
              placeholder="اكتب عنواناً واضحاً ومعبراً..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* المقتطف */}
          <div>
            <label className={labelCls}>مقتطف قصير (اختياري)</label>
            <textarea
              className={inputCls}
              placeholder="وصف مختصر يظهر في قائمة المقالات..."
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>

          {/* رابط صورة الغلاف */}
          <div>
            <label className={labelCls}>رابط صورة الغلاف (اختياري)</label>
            <input
              className={inputCls}
              placeholder="https://..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
            {coverImage && (
              <img
                src={coverImage}
                alt="معاينة"
                className="mt-2 h-32 w-full object-cover rounded-xl"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
          </div>

          {/* التصنيفات */}
          {categories.length > 0 && (
            <div>
              <label className={labelCls}>التصنيفات</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs transition ${
                      selectedCats.includes(cat.id)
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* الوسوم */}
          <div>
            <label className={labelCls}>الوسوم (Tags)</label>
            <div className="flex gap-2 mb-2">
              <input
                className={inputCls}
                placeholder="اكتب وسماً واضغط إضافة..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
              />
              <button
                type="button"
                onClick={addTag}
                className="rounded-xl bg-zinc-800 hover:bg-zinc-700 px-4 text-sm transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs"
                  >
                    #{tag}
                    <button onClick={() => removeTag(tag)}>
                      <X className="w-3 h-3 hover:text-red-400" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* المحتوى */}
          <div>
            <label className={labelCls}>محتوى المقال *</label>
            <textarea
              className={`${inputCls} font-mono`}
              placeholder="اكتب محتوى المقال هنا... (يدعم HTML بسيط)"
              rows={16}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <p className="text-xs text-zinc-500 mt-1">
              يمكنك استخدام HTML بسيط: &lt;b&gt;، &lt;i&gt;، &lt;p&gt;، &lt;br&gt;، &lt;h3&gt;
            </p>
          </div>

          {/* تنبيه المراجعة */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-300">
            ⚠️ سيتم مراجعة مقالك من قِبل الإدارة قبل نشره.
          </div>

          {/* زر النشر */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-sm font-bold text-white transition disabled:opacity-60"
          >
            {loading ? "جارٍ الإرسال..." : "إرسال المقال للمراجعة"}
          </button>

        </div>
      </div>
    </div>
  );
}
