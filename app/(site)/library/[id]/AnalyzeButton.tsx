
// app/(site)/library/[id]/AnalyzeButton.tsx
"use client";

import { useState } from "react";

export default function AnalyzeButton({
  docId,
  hasText,
  className,
}: {
  docId: number;
  hasText: boolean;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const res = await fetch("/api/library/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: docId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "تعذر التحليل");
      setAnalysis(json.analysis);
    } catch (e: any) {
      setError(e.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        disabled={loading || !hasText}
        onClick={run}
        className={`${className} disabled:opacity-50 disabled:cursor-not-allowed`}
        title={hasText ? "" : "لا يوجد نص محفوظ لتحليله"}
      >
        {loading ? "جاري التحليل…" : "تشغيل التحليل الذكي"}
      </button>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {analysis && (
        <div className="rounded border p-3 leading-8 whitespace-pre-wrap bg-black/5 dark:bg-white/5">
          {analysis}
        </div>
      )}
    </div>
  );
}
