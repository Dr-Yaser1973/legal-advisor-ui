 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AnalyzeCase({ caseId }: { caseId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    try {
      setLoading(true);
      const res = await fetch(`/api/cases/${caseId}/analyze`, {
        method: "POST",
      });

      if (!res.ok) {
        console.error("failed to analyze case");
        alert("فشل في تحليل القضية. تأكد من إعداد مفتاح OpenAI والـ API.");
        return;
      }

      // يمكن قراءة النص وإظهاره مباشرة، لكن نكتفي بالتحديث
      // حتى تُعرض النتيجة في قسم التحليل في الصفحة (aiAnalysis)
      router.refresh();
      alert("تم إجراء التحليل، وستظهر نتائجه في قسم تحليل الذكاء الاصطناعي.");
    } catch (e) {
      console.error(e);
      alert("حدث خطأ غير متوقع أثناء تحليل القضية.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3 flex flex-col gap-2 text-xs">
      <h3 className="font-semibold text-sm mb-1">تحليل القضية</h3>
      <p className="text-[11px] text-zinc-400">
        استخدام الذكاء الاصطناعي لتلخيص وقائع القضية وتحديد النقاط القانونية
        المهمة واقتراح المسار الاستراتيجي.
      </p>
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={loading}
        className="mt-1 rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-medium hover:bg-purple-500 disabled:opacity-60 transition"
      >
        {loading ? "جاري التحليل..." : "تحليل القضية بالذكاء الاصطناعي"}
      </button>
    </div>
  );
}
