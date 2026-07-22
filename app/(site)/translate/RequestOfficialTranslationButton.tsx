 // app/(site)/translate/RequestOfficialTranslationButton.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

type TargetLang = string;

interface TranslationOffice {
  id: number;
  name: string;
}

interface RequestOfficialTranslationButtonProps {
  savedDocumentId: number | null; // رقم المستند في LegalDocument
  targetLang: TargetLang;         // AR أو EN
  disabled?: boolean;
}

// مفتاح حفظ الطلب المعلّق أثناء تسجيل الدخول عبر Google
const PENDING_KEY = "pendingTranslationRequest";

export default function RequestOfficialTranslationButton({
  savedDocumentId,
  targetLang,
  disabled,
}: RequestOfficialTranslationButtonProps) {
  const { status } = useSession();
  const searchParams = useSearchParams();
  const [offices, setOffices] = useState<TranslationOffice[]>([]);
  const [selectedOfficeId, setSelectedOfficeId] = useState<number | null>(null);
  const [loadingOffices, setLoadingOffices] = useState(false);
  const [sending, setSending] = useState(false);

  // تحميل مكاتب الترجمة المعتمدة
  useEffect(() => {
    async function loadOffices() {
      try {
        setLoadingOffices(true);
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

  // تحديد المكتب تلقائياً من الرابط (?officeId=...) — قادم من صفحة تفاصيل المكتب
  useEffect(() => {
    const officeIdParam = searchParams.get("officeId");
    if (!officeIdParam) return;
    const n = Number(officeIdParam);
    if (Number.isFinite(n) && n > 0) {
      setSelectedOfficeId(n);
    }
  }, [searchParams]);

  // إرسال الطلب فعلياً إلى الخادم
  async function submitRequest(
    documentId: number,
    officeId: number,
    lang: TargetLang
  ) {
    try {
      setSending(true);

      const res = await fetch("/api/translation/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officeId, documentId, targetLang: lang }),
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

  // بعد العودة من تسجيل دخول Google: أكمل الطلب المعلّق تلقائياً
  useEffect(() => {
    if (status !== "authenticated") return;

    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return;
    sessionStorage.removeItem(PENDING_KEY);

    try {
      const pending = JSON.parse(raw);
      if (pending?.documentId && pending?.officeId) {
        submitRequest(
          Number(pending.documentId),
          Number(pending.officeId),
          pending.targetLang || "EN"
        );
      }
    } catch {
      /* تجاهل أي طلب معلّق تالف */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function handleClick() {
    if (!savedDocumentId) {
      alert("يجب رفع المستند قبل طلب الترجمة الرسمية.");
      return;
    }

    if (!selectedOfficeId) {
      alert("يرجى اختيار مكتب الترجمة أولاً.");
      return;
    }

    // غير مسجّل الدخول: احفظ الطلب ثم سجّل الدخول عبر Google بنقرة واحدة
    if (status !== "authenticated") {
      sessionStorage.setItem(
        PENDING_KEY,
        JSON.stringify({
          documentId: savedDocumentId,
          officeId: selectedOfficeId,
          targetLang,
        })
      );
      signIn("google", { callbackUrl: window.location.href });
      return;
    }

    submitRequest(savedDocumentId, selectedOfficeId, targetLang);
  }

  const needsLogin = status !== "authenticated";

  const isDisabled =
    disabled ||
    sending ||
    loadingOffices ||
    !savedDocumentId ||
    !selectedOfficeId;

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

      {/* زر الإرسال / تسجيل الدخول عبر Google */}
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white
                   hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending
          ? "جارٍ إرسال طلب الترجمة..."
          : needsLogin
          ? "🔒 سجّل الدخول عبر Google لإرسال الطلب"
          : "طلب ترجمة رسمية من مكتب"}
      </button>

      {needsLogin && (
        <p className="text-[11px] text-zinc-400 text-center leading-5">
          تسجيل الدخول بنقرة واحدة عبر Google — لن تفقد مستندك، وسيُرسَل طلبك
          تلقائياً بعد الدخول.
        </p>
      )}
    </div>
  );
}
