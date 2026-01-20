 "use client";

import { useEffect, useState } from "react";

type Level = "basic" | "pro" | "business";

export default function ExplainPanel({
  lawUnitId,
}: {
  lawUnitId: number;
}) {
  const [level, setLevel] = useState<Level>("basic");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🔥 جديد: رقم المادة أو نصها
  const [articleNo, setArticleNo] = useState("");
  const [articleText, setArticleText] = useState("");

  async function load(lv: Level) {
    if (!articleNo && !articleText) {
      setText("يرجى إدخال رقم المادة أو نص المادة لبدء الشرح.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("level", lv);

      if (articleNo) params.set("article", articleNo);
      if (articleText) params.set("text", articleText);

      const res = await fetch(
        `/api/library/${lawUnitId}/explain?${params.toString()}`,
        { cache: "no-store" }
      );

      const data = await res.json();

      if (!data?.ok) {
        throw new Error(data?.error || "فشل تحميل الشرح");
      }

      setText(data.explanation);
    } catch (e: any) {
      setError(e?.message || "حدث خطأ أثناء الشرح");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // لا نحمل تلقائيًا إلا بعد إدخال مادة
  }, [lawUnitId, level]);

  return (
    <div className="space-y-4">
      {/* إدخال المادة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          value={articleNo}
          onChange={(e) => setArticleNo(e.target.value)}
          placeholder="رقم المادة (مثال: 45)"
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
        />

        <textarea
          value={articleText}
          onChange={(e) => setArticleText(e.target.value)}
          placeholder="أو الصق نص المادة القانونية هنا"
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
          rows={2}
        />
      </div>

      {/* مستوى الشرح */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "basic", label: "مبسط" },
          { key: "pro", label: "احترافي" },
          { key: "business", label: "شركات" },
        ].map((b) => (
          <button
            key={b.key}
            onClick={() => {
              setLevel(b.key as Level);
              load(b.key as Level);
            }}
            className={`rounded-lg px-3 py-1.5 text-sm border transition
              ${
                level === b.key
                  ? "bg-emerald-900/40 border-emerald-700 text-emerald-300"
                  : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* المحتوى */}
      {loading && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-sm text-zinc-300">
          جارٍ إنشاء شرح المادة…
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-900/40 bg-red-950/30 p-6 text-sm text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && text && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-sm leading-8 text-zinc-200 whitespace-pre-wrap">
          {text}
        </div>
      )}
    </div>
  );
}
