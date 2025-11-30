"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function SmartContractsPage() {
  const [scenario, setScenario] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleDraft(e: React.FormEvent) {
    e.preventDefault();
    if (!scenario.trim()) {
      alert("يرجى وصف الحالة القانونية أو العقد المطلوب");
      return;
    }

    setIsLoading(true);
    setResult("");

    try {
      // يمكنك ربط هذا إما مع /api/contracts/smart-draft أو مع /api/rag/ask
      const res = await fetch("/api/contracts/smart-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario }),
      });

      const data = await res.json();
      if (!res.ok || !data.draft) {
        console.error(data);
        alert(data.error || "فشل توليد مسودة العقد");
        return;
      }

      setResult(data.draft);
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء التواصل مع المساعد الذكي");
    } finally {
      setIsLoading(false);
    }
  }

  function copyToClipboard() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    alert("تم نسخ المسودة إلى الحافظة");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-right">
      <h1 className="text-3xl font-bold mb-4">🤝 المساعد الذكي لصياغة العقود</h1>

      <p className="text-gray-600 mb-6 leading-7">
        اكتب وصفًا للحالة القانونية أو للعلاقة التعاقدية بين الطرفين، وسيتولى النظام
        اقتراح بنود عقد مناسبة (تمهيد، التزامات، مدة العقد، الجزاءات، فسخ العقد...).
        يمكنك بعد ذلك نسخ المسودة إلى صفحة توليد العقود أو تعديلها يدويًا.
      </p>

      <form onSubmit={handleDraft} className="space-y-4 mb-6">
        <label className="block font-semibold mb-1">
          وصف الحالة / المطلوب من العقد:
        </label>
        <textarea
          className="w-full border rounded-lg p-3 min-h-[160px] leading-8"
          placeholder="مثال: عقد إيجار شقة سكنية في بغداد لمدة سنة بين مالك ومستأجر، مع بيان الأجرة الشهرية، وواجبات الصيانة، وشروط الفسخ..."
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {isLoading ? "جاري توليد المسودة..." : "توليد مسودة عقد"}
        </button>
      </form>

      {result && (
        <div className="border rounded-xl bg-white shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">✍️ مسودة العقد المقترحة</h2>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1 rounded-lg text-sm bg-gray-800 text-white hover:bg-black"
            >
              نسخ المسودة
            </button>
          </div>

          <div className="prose prose-sm max-w-none text-right leading-8">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

