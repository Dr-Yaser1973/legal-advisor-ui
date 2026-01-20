"use client";

import { useEffect, useState } from "react";

type Faq = {
  id: number;
  question: string;
  answer: string;
};

export function FaqPanel({
  lawUnitId,
  isAdmin,
}: {
  lawUnitId: number;
  isAdmin: boolean;
}) {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/library/${lawUnitId}/faq`, {
      cache: "no-store",
    });
    const data = await res.json();
    setFaqs(data?.faqs || []);
    setLoading(false);
  }

  async function addFaq() {
    if (!q.trim() || !a.trim()) return;

    await fetch(`/api/library/${lawUnitId}/faq`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q, answer: a }),
    });

    setQ("");
    setA("");
    load();
  }

  async function removeFaq(id: number) {
    await fetch(`/api/library/faq/${id}`, {
      method: "DELETE",
    });
    load();
  }

  useEffect(() => {
    load();
  }, [lawUnitId]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">
        جارٍ تحميل الأسئلة...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* إضافة سؤال (ADMIN فقط) */}
      {isAdmin && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="اكتب السؤال..."
            className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-zinc-200"
          />
          <textarea
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="اكتب الإجابة..."
            rows={3}
            className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-zinc-200"
          />
          <button
            onClick={addFaq}
            className="rounded-lg bg-emerald-900/40 border border-emerald-700 px-4 py-1.5 text-sm text-emerald-300 hover:bg-emerald-900/60"
          >
            + إضافة سؤال
          </button>
        </div>
      )}

      {/* العرض */}
      {faqs.length ? (
        faqs.map((f) => (
          <div
            key={f.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
          >
            <div className="flex justify-between items-center">
              <div className="text-sm font-semibold text-zinc-100">
                {f.question}
              </div>

              {isAdmin && (
                <button
                  onClick={() => removeFaq(f.id)}
                  className="text-xs text-red-400 hover:underline"
                >
                  حذف
                </button>
              )}
            </div>

            <div className="mt-2 text-sm leading-7 text-zinc-300">
              {f.answer}
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">
          لا توجد أسئلة شائعة بعد.
        </div>
      )}
    </div>
  );
}

