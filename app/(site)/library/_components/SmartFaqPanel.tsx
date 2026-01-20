"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";

export default function SmartFaqPanel({ lawUnitId }: { lawUnitId: number }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function ask() {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer(null);

    const res = await fetch(`/api/library/${lawUnitId}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    setAnswer(data.answer || "لم يتم العثور على إجابة.");
    setLoading(false);
  }

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 mt-4">
      <div className="flex items-center gap-2 mb-2 text-sm text-zinc-300">
        <Sparkles size={16} />
        اسأل هذه المادة قانونيًا
      </div>

      <div className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="اكتب سؤالك القانوني هنا..."
          className="flex-1 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white"
        />
        <button
          onClick={ask}
          disabled={loading}
          className="rounded-lg bg-emerald-600 px-3 py-2 text-sm hover:bg-emerald-500 disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </div>

      {loading && (
        <div className="text-xs text-zinc-400 mt-2">
          جاري تحليل السؤال قانونيًا...
        </div>
      )}

      {answer && (
        <div className="mt-3 rounded-lg bg-zinc-800 p-3 text-sm text-zinc-200 whitespace-pre-line">
          {answer}
        </div>
      )}
    </div>
  );
}

