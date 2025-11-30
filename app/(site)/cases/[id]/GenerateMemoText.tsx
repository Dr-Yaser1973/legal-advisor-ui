"use client";

import { useState } from "react";

export function GenerateMemoText({ caseId }: { caseId: number }) {
  const [loading, setLoading] = useState(false);
  const [memo, setMemo] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cases/${caseId}/memo-text`, {
        method: "POST",
      });

      if (!res.ok) {
        console.error("failed to generate memo text");
        alert("فشل في توليد المذكرة. تأكد من إعداد مفتاح OpenAI.");
        return;
      }

      const json = (await res.json()) as { memo?: string };
      setMemo(json.memo ?? "لم يتم استلام نص المذكرة من الخادم.");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ غير متوقع أثناء توليد المذكرة.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!memo) return;
    try {
      await navigator.clipboard.writeText(memo);
      alert("تم نسخ نص المذكرة إلى الحافظة.");
    } catch {
      alert("تعذر نسخ النص، يمكنك تحديده يدويًا ونسخه.");
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full rounded-2xl border border-emerald-500/40 bg-emerald-600/20 px-3 py-2 text-xs font-medium text-emerald-100 hover:bg-emerald-600/30 disabled:opacity-60"
      >
        {loading ? "جاري توليد المذكرة..." : "توليد مذكرة نصية"}
      </button>

      {memo && (
        <div className="mt-2 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-zinc-200">
              نص المذكرة
            </span>
            <button
              onClick={handleCopy}
              className="text-[11px] underline text-emerald-300 hover:text-emerald-200"
            >
              نسخ النص
            </button>
          </div>
          <div className="max-h-[320px] overflow-auto rounded-2xl border border-white/10 bg-zinc-900/70 p-3 text-xs leading-relaxed whitespace-pre-wrap">
            {memo}
          </div>
        </div>
      )}
    </div>
  );
}

