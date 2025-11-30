
"use client";
import { useState } from "react";

export default function GenerateMemoButton({ caseId }: { caseId: number }) {
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    try {
      setLoading(true);
      const res = await fetch(`/api/cases/${caseId}/memo`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json().catch(()=>null);
        alert(err?.error || "فشل توليد المذكرة"); 
        setLoading(false);
        return;
      }
      // حمّل الملف
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `memo_case_${caseId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setLoading(false);
    } catch (e: any) {
      alert(e.message);
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="bg-purple-700 text-white px-4 py-2 rounded-lg"
    >
      {loading ? "جاري توليد المذكرة..." : "توليد مذكرة قانونية (PDF)"}
    </button>
  );
}
