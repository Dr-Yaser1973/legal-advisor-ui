 "use client";

import { useState } from "react";

export default function AcceptOfferButton({ requestId }: { requestId: number }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setMsg(null);
    setError(null);

    try {
      const res = await fetch(
        `/api/translation/client/requests/${requestId}/accept-offer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json().catch(() => ({}));

      setLoading(false);

      if (!res.ok || !data?.ok) {
        const message =
          data?.error ||
          `تعذر تأكيد الموافقة (رمز الحالة ${res.status})، حاول مرة أخرى لاحقًا.`;
        setError(message);
        return;
      }

      setMsg("تمت الموافقة على العرض، وسيبدأ مكتب الترجمة تنفيذ الطلب.");
    } catch (e) {
      console.error(e);
      setLoading(false);
      setError("حدث خطأ غير متوقع أثناء الاتصال بالخادم");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={loading}
        onClick={handleClick}
        className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-sm"
      >
        {loading ? "جاري تأكيد الموافقة..." : "الموافقة على العرض وبدء التنفيذ"}
      </button>

      {msg && <p className="text-[11px] text-emerald-400">{msg}</p>}
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}
