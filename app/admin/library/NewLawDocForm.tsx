"use client";

import { LAW_CATEGORIES, LawCategoryKey } from "@/lib/lawCategories";
import { useState } from "react";

export default function NewLawDocForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      title: formData.get("title")?.toString() || "",
      jurisdiction: formData.get("jurisdiction")?.toString() || "",
      category: formData.get("category")?.toString() || "",
      year: formData.get("year")
        ? Number(formData.get("year")!.toString())
        : null,
      text: formData.get("text")?.toString() || "",
    };

    try {
      const res = await fetch("/api/library/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "فشل حفظ القانون.");
      } else {
        setSuccess("تم حفظ القانون وتقطيع المواد بنجاح.");
        form.reset();
      }
    } catch (err: any) {
      setError(err?.message ?? "خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-zinc-800 rounded-2xl bg-zinc-900/70 p-4 space-y-3"
    >
      <h2 className="text-lg font-semibold mb-2">إضافة قانون جديد</h2>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs mb-1">العنوان</label>
          <input
            name="title"
            required
            className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">الاختصاص</label>
          <input
            name="jurisdiction"
            required
            defaultValue="العراق"
            className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs mb-1">التصنيف</label>
          <select
            name="category"
            required
            defaultValue="LAW"
            className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm"
          >
            {LAW_CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">السنة (اختياري)</label>
          <input
            type="number"
            name="year"
            className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs mb-1">نص القانون الكامل</label>
        <textarea
          name="text"
          required
          rows={8}
          className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm leading-relaxed"
          placeholder="اكتب نص القانون بالتسلسل مع عناوين المواد (المادة 1، المادة 2، ...)"
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
      {success && <p className="text-xs text-emerald-400">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-6 py-2 text-sm font-medium disabled:opacity-60"
      >
        {loading ? "جارٍ الحفظ..." : "حفظ القانون وتقطيع المواد"}
      </button>
    </form>
  );
}

