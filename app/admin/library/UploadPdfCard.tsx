 "use client";

import { LAW_CATEGORIES } from "@/lib/lawCategories";
import { useState } from "react";

export default function UploadPdfCard() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("file") as File | null;

    if (!file) {
      setError("الرجاء اختيار ملف PDF.");
      setLoading(false);
      return;
    }

    try {
       const res = await fetch("/api/library/upload", {

        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "فشل رفع الملف.");
      } else {
        setMsg("تم رفع الملف ومعالجته بنجاح.");
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
      className="mt-6 border border-zinc-800 rounded-2xl bg-zinc-900/70 p-4 space-y-3"
    >
      <h2 className="text-lg font-semibold mb-1">رفع ملف PDF جديد</h2>
      <p className="text-xs text-zinc-400 mb-2">
        يمكن إنشاء سجل قانوني (LawDoc) تلقائيًا من النص المستخرج من الملف.
      </p>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs mb-1">عنوان المستند</label>
          <input
            name="title"
            required
            className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm"
            placeholder="مثال: قانون العمل العراقي"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">الاختصاص</label>
          <input
            name="jurisdiction"
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
        <label className="block text-xs mb-1">ملف PDF</label>
        <input
          type="file"
          name="file"
          accept="application/pdf"
          required
          className="w-full text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="autoLawDoc"
          type="checkbox"
          name="autoLawDoc"
          value="true"
          defaultChecked
          className="h-4 w-4"
        />
        <label htmlFor="autoLawDoc" className="text-xs text-zinc-300">
          إنشاء قانون (LawDoc) تلقائيًا وتقطيع المواد من النص المستخرج
        </label>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
      {msg && <p className="text-xs text-emerald-400">{msg}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 hover:bg-blue-500 px-6 py-2 text-sm font-medium disabled:opacity-60"
      >
        {loading ? "جارٍ الرفع والمعالجة..." : "رفع الملف ومعالجته"}
      </button>
    </form>
  );
}
