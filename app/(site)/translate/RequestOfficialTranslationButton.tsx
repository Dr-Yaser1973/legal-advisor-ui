 // app/(site)/translate/RequestOfficialTranslationButton.tsx
"use client";

import { useEffect, useState } from "react";

type TargetLang = "AR" | "EN";

interface TranslationOffice {
  id: number;
  name: string;
}

interface RequestOfficialTranslationButtonProps {
  savedDocumentId: number | null; // رقم المستند في LegalDocument
  targetLang: TargetLang;         // AR أو EN
  disabled?: boolean;
}

export default function RequestOfficialTranslationButton({
  savedDocumentId,
  targetLang,
  disabled,
}: RequestOfficialTranslationButtonProps) {
  const [offices, setOffices] = useState<TranslationOffice[]>([]);
  const [selectedOfficeId, setSelectedOfficeId] = useState<number | null>(null);
  const [loadingOffices, setLoadingOffices] = useState(false);
  const [sending, setSending] = useState(false);

  // تحميل مكاتب الترجمة المعتمدة
  useEffect(() => {
    async function loadOffices() {
      try {
        setLoadingOffices(true);

        // عدّل هذا المسار إذا كان مختلفًا عندك
        const res = await fetch("/api/translation/offices");
        const data = await res.json();

        if (!res.ok || !data.ok) {
          console.error("offices error:", data);
          return;
        }

        setOffices(data.offices || []);
      } catch (err) {
        console.error("loadOffices error:", err);
      } finally {
        setLoadingOffices(false);
      }
    }

    loadOffices();
  }, []);

  async function handleClick() {
    if (!savedDocumentId) {
      alert("يجب حفظ المستند قبل طلب الترجمة الرسمية.");
      return;
    }

    if (!selectedOfficeId) {
      alert("يرجى اختيار مكتب الترجمة أولاً.");
      return;
    }

    try {
      setSending(true);

      const res = await fetch("/api/translation/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          officeId: selectedOfficeId,
          documentId: savedDocumentId,
          targetLang,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        console.error("request error:", data);
        alert(data.error || "حدث خطأ أثناء إنشاء طلب الترجمة الرسمية.");
        return;
      }

      alert("تم إنشاء طلب الترجمة الرسمية وإرساله إلى مكتب الترجمة بنجاح.");
    } catch (err) {
      console.error("unexpected error:", err);
      alert("حدث خطأ غير متوقع أثناء إرسال طلب الترجمة.");
    } finally {
      setSending(false);
    }
  }

  // نجعل التعطيل فقط عند الإرسال أو تحميل المكاتب أو disabled الخارجي
  const isDisabled = disabled || sending || loadingOffices;

  return (
    <div className="space-y-3">
      {/* اختيار مكتب الترجمة */}
      <div>
        <label className="block text-sm mb-1">مكتب الترجمة</label>
        <select
          className="w-full border border-white/10 rounded bg-zinc-900/70 p-2 text-sm text-zinc-100"
          value={selectedOfficeId ?? ""}
          onChange={(e) =>
            setSelectedOfficeId(e.target.value ? Number(e.target.value) : null)
          }
          disabled={loadingOffices || offices.length === 0}
        >
          <option value="">
            {loadingOffices
              ? "جارٍ تحميل مكاتب الترجمة..."
              : "اختر مكتب الترجمة المعتمد"}
          </option>
          {offices.map((office) => (
            <option key={office.id} value={office.id}>
              {office.name}
            </option>
          ))}
        </select>
      </div>

      {/* عرض لغة الهدف */}
      <p className="text-xs text-zinc-400">
        اللغة المستهدفة:{" "}
        <span className="font-semibold">
          {targetLang === "AR" ? "العربية" : "الإنجليزية"}
        </span>
      </p>

      {/* زر الإرسال */}
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white
                   hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? "جارٍ إرسال طلب الترجمة..." : "طلب ترجمة رسمية من مكتب"}
      </button>
    </div>
  );
}
