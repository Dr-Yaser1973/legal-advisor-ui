 "use client";

import { useState } from "react";

type AcceptOfferButtonProps = {
  requestId: number;
};

export function AcceptOfferButton({ requestId }: AcceptOfferButtonProps) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (loading) return;

    setLoading(true);
    setMsg(null);
    setError(null);

    try {
      const res = await fetch(
        `/api/translation/client/requests/${requestId}/accept-offer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // نقرأ الرد كنص أولاً ثم نحاول تحويله لـ JSON
      const text = await res.text();
      let data: any = null;

      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("Response is not valid JSON:", text);
        }
      }

      setLoading(false);

      if (!res.ok || !data?.ok) {
        const msg =
          data?.error ||
          `تعذّر تأكيد الموافقة (رمز الحالة ${res.status}). حاول مرة أخرى لاحقًا.`;
        setError(msg);
        return;
      }

      setMsg(
        "تم تأكيد موافقتك على عرض مكتب الترجمة، وتم إرسال إشعار للمكتب لبدء التنفيذ."
      );
    } catch (err) {
      console.error("accept-offer fetch error:", err);
      setLoading(false);
      setError("حدث خطأ أثناء الاتصال بالخادم. حاول مرة أخرى لاحقًا.");
    }
  }

  // لو تمت العملية بنجاح نعرض رسالة بدلاً من الزر
  if (msg) {
    return (
      <p className="text-[11px] text-emerald-400 mt-2 text-right">
        {msg}
      </p>
    );
  }

  return (
    <div className="mt-3 space-y-1 text-right">
      <button
        type="button"
        disabled={loading}
        onClick={handleClick}
        className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-sm font-semibold"
      >
        {loading ? "جارٍ تأكيد الموافقة..." : "الموافقة على العرض وبدء التنفيذ"}
      </button>
      {error && (
        <p className="text-[11px] text-red-400 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
