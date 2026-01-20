"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";

export default function FaqEditor({
  lawUnitId,
  canEdit,
}: {
  lawUnitId: number;
  canEdit: boolean;
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  if (!canEdit) return null;

  async function submit() {
    if (!question || !answer) return;

    setLoading(true);
    await fetch(`/api/library/${lawUnitId}/faq`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer }),
    });

    setQuestion("");
    setAnswer("");
    setLoading(false);
  }

  return (
    <div className="rounded-xl border border-amber-600 bg-zinc-900 p-4 mt-4">
      <div className="flex items-center gap-2 mb-2 text-sm text-amber-400">
        <PlusCircle size={16} />
        إضافة سؤال شائع (للمحامين / الإدارة)
      </div>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="اكتب السؤال القانوني..."
        className="w-full mb-2 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm"
      />

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="اكتب الجواب القانوني المهني..."
        className="w-full min-h-[100px] rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm"
      />

      <button
        disabled={loading}
        onClick={submit}
        className="mt-2 rounded-lg bg-amber-600 px-3 py-2 text-sm hover:bg-amber-500 disabled:opacity-50"
      >
        حفظ السؤال
      </button>
    </div>
  );
}


