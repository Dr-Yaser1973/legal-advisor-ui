"use client";

import { useState } from "react";

export function GenerateMemoButton({ caseId }: { caseId: number }) {
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    try {
      setLoading(true);
      const res = await fetch(`/api/cases/${caseId}/memo`, {
        method: "POST",
      });

      if (!res.ok) {
        console.error("failed to generate memo");
        alert("فشل في توليد المذكرة القانونية.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `memo_case_${caseId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء توليد المذكرة.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3 flex flex-col gap-2 text-xs">
      <h3 className="font-semibold text-sm mb-1">مذكرة قانونية PDF</h3>
      <p className="text-[11px] text-zinc-400">
        توليد مذكرة قانونية بناءً على بيانات القضية والتحليل وملاحظاتك.
      </p>
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="mt-1 rounded-xl bg-sky-600 px-3 py-1.5 text-xs font-medium hover:bg-sky-500 disabled:opacity-60 transition"
      >
        {loading ? "جاري التوليد..." : "توليد مذكرة PDF"}
      </button>
    </div>
  );
}

