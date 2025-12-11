 "use client";

import { useState } from "react";

export default function OfficialTranslationRequestSection(props: {
  savedDocumentId: number | null; // id المستند بعد الحفظ
}) {
  const [officeId, setOfficeId] = useState<string>("");
  const [targetLang, setTargetLang] = useState<"AR" | "EN">("EN");
  const [loading, setLoading] = useState(false);

  async function handleOfficialRequest() {
     {
      alert("يجب أولاً رفع المستند وحفظه قبل طلب الترجمة الرسمية.");
      return;
    }

    if (!officeId) {
      alert("رجاءً اختر مكتب الترجمة.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/translation/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          officeId: Number(officeId),
          documentId: props.savedDocumentId,
          targetLang,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        alert(data?.error || "تعذر إنشاء طلب الترجمة الرسمية.");
        return;
      }

      alert(`تم إرسال طلب الترجمة بنجاح، رقم الطلب: ${data.requestId}`);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ غير متوقع أثناء الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 space-y-3 border border-white/10 rounded-xl bg-zinc-900/40 p-4">
      <h2 className="text-sm font-semibold mb-2">
        (٣) طلب ترجمة رسمية من مكتب معتمد
      </h2>

      {/* اختيار مكتب الترجمة (يمكنك استبداله بقائمة مكاتب حقيقية لاحقًا) */}
      <div className="flex flex-col gap-1 text-xs">
        <label>مكتب الترجمة</label>
        <select
          className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-right"
          value={officeId}
          onChange={(e) => setOfficeId(e.target.value)}
        >
          <option value="">اختر مكتب الترجمة...</option>
          <option value="2">Office 2 (مثال)</option>
          <option value="3">Office 3 (مثال)</option>
          {/* هنا لاحقًا تربطها بقائمة مكاتب من قاعدة البيانات */}
        </select>
      </div>

      {/* اختيار لغة الهدف */}
      <div className="flex flex-col gap-1 text-xs">
        <label>اللغة المستهدفة</label>
        <select
          className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-right"
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value as "AR" | "EN")}
        >
          <option value="EN">الإنجليزية</option>
          <option value="AR">العربية</option>
        </select>
      </div>

      <button
        type="button"
        onClick={handleOfficialRequest}
        disabled={loading}
        className="w-full mt-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-sm font-semibold"
      >
        {loading ? "جارٍ إرسال طلب الترجمة..." : "طلب ترجمة رسمية من مكتب"}
      </button>

      <p className="text-[11px] text-zinc-500 mt-1">
        بعد إرسال الطلب، سيتم إشعار مكتب الترجمة لمراجعة المستند وتحديد السعر،
        ثم يظهر العرض في صفحة "طلباتي في الترجمة الرسمية".
      </p>
    </div>
  );
}
