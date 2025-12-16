 // app/(site)/translation-requests/AcceptOfferButton.tsx
"use client";

import { useState } from "react";

interface AcceptOfferButtonProps {
  requestId: number;
  // اختياري: لو أردت أن تعيد تحميل القائمة من الأب بعد القبول
  onAccepted?: () => void;
}

export default function AcceptOfferButton({
  requestId,
  onAccepted,
}: AcceptOfferButtonProps) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAccept() {
    setLoading(true);
    setMsg(null);
    setError(null);

    try {
      const res = await fetch("/api/translation/requests/accept-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        const message =
          data?.error || "تعذر تأكيد الموافقة على العرض، حاول مرة أخرى.";
        setError(message);
        return;
      }

      setMsg(data.message || "تم تأكيد الموافقة على عرض الترجمة بنجاح.");

      // لو حبيت تحدث الحالة في الأب (إخفاء الزر، تغيير النص... إلخ)
      if (onAccepted) {
        onAccepted();
      }
    } catch (e) {
      console.error(e);
      setError("حدث خطأ غير متوقع أثناء الاتصال بالخادم.");
    } finally {
      // مهم جدًا حتى لا يبقى الزر في حالة "جارٍ تأكيد الموافقة..."
      setLoading(false);
    }
  }

  return (
    <div className="mt-3 space-y-2">
      <button
        type="button"
        onClick={handleAccept}
        disabled={loading || !!msg}
        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-sm"
      >
        {loading
          ? "جارٍ تأكيد الموافقة..."
          : msg
          ? "تم تأكيد الموافقة ✅"
          : "جارِ تأكيد الموافقة..."}
      </button>

      {msg && <p className="text-[11px] text-emerald-400">{msg}</p>}
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}
