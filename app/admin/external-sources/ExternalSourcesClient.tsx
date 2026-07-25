 "use client";

import { useState } from "react";

type PreviewItem = {
  id: number;
  title: string;
  url: string;
  lawUnitId?: number | null;
};

export default function ExternalSourcesClient() {
  const [q, setQ] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewItem[]>([]);
  const [imported, setImported] = useState<number | null>(null);

  // 🔹 استيراد من OpenAlex
  async function handleImport() {
    if (!q.trim()) {
      setError("أدخل عبارة البحث");
      return;
    }

    setLoading(true);
    setError(null);
    setPreview([]);
    setImported(null);

    try {
      const res = await fetch("/api/admin/external/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "OPENALEX",
          q,
          perPage,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "فشل الاستيراد");
      }

      setPreview(data.preview || []);
      setImported(data.imported || 0);
    } catch (e: any) {
      setError(e.message || "خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }
 
  // 🔹 تحويل إلى مادة في المكتبة
  async function handleConvert(externalItemId: number) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/external/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          externalItemId,
          category: "ACADEMIC_STUDY",
          status: "DRAFT",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "فشل التحويل");
      }

      setPreview((prev) =>
        prev.map((p) =>
          p.id === externalItemId
            ? { ...p, lawUnitId: data.lawUnitId }
            : p
        )
      );
    } catch (e: any) {
      setError(e.message || "خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
      {/* البحث */}
      <div className="grid gap-4 md:grid-cols-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="مثال: international trade law"
          className="md:col-span-2 rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-2 text-sm text-zinc-100 focus:outline-none"
        />

        <input
          type="number"
          min={1}
          max={20}
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-2 text-sm text-zinc-100"
        />
      </div>

      {/* زر الاستيراد */}
      <button
        onClick={handleImport}
        disabled={loading}
        className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
      >
        {loading ? "جاري الاستيراد..." : "📥 استيراد من OpenAlex"}
      </button>

      {/* أخطاء */}
      {error && (
        <div className="rounded-xl border border-red-800 bg-red-900/30 px-4 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* نجاح */}
      {imported !== null && (
        <div className="text-sm text-emerald-400">
          ✅ تم استيراد {imported} عنصر
        </div>
      )}

      {/* النتائج */}
      {preview.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-semibold text-zinc-200">
            النتائج:
          </div>

            {preview.map((p, index) => (
  <div
    key={`${p.id ?? "no-id"}-${index}`}
    className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-200"
  >

              <div className="font-medium">{p.title}</div>

              <a
                href={p.url}
                target="_blank"
                className="mt-1 block text-xs text-blue-400 hover:underline"
              >
                {p.url}
              </a>

              <div className="mt-3 flex gap-2">
                {p.lawUnitId ? (
                  <>
                    <span className="rounded-lg border border-emerald-700 bg-emerald-900/30 px-2 py-1 text-xs text-emerald-300">
                      ✅ تم التحويل (#{p.lawUnitId})
                    </span>
                    <a
                      href={`/library/view/${p.lawUnitId}`}
                      className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs hover:bg-zinc-900"
                    >
                      فتح المادة
                    </a>
                  </>
                ) : (
                  <button
                    onClick={() => handleConvert(p.id)}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
                    disabled={loading}
                  >
                    🔁 تحويل إلى مادة في المكتبة
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
