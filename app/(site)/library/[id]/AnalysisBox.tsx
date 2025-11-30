
"use client";

import { useState } from "react";

export default function AnalysisBox({ title, text }: { title: string; text: string }) {
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<string>("");

  async function run() {
    setLoading(true);
    setOut("");
    try {
      const res = await fetch("/api/ai/analyze-law", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text }),
      });
      const data = await res.json();
      if (!res.ok) setOut(data?.error || "تعذر التحليل.");
      else setOut(data.analysis);
    } catch {
      setOut("تعذر الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 p-3 rounded border">
      <button
        disabled={loading}
        onClick={run}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        {loading ? "جارٍ التحليل..." : "🧠 تشغيل التحليل الذكي"}
      </button>

      {out && (
        <div className="mt-3 p-3 rounded bg-gray-900 text-gray-100 whitespace-pre-wrap leading-7">
          {out}
        </div>
      )}
    </div>
  );
}
