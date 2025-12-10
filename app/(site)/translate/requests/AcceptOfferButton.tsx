 "use client";

import { useState } from "react";

export default function AcceptOfferButton({ requestId }: { requestId: number }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    setMsg(null);

    try {
      const res = await fetch(
        `/api/translation/client/requests/${requestId}/accept-offer`,
        {
          method: "POST",
        }
      );

      const data = await res.json(); // ← الحل هنا

      setLoading(false);

      if (!res.ok || !data.ok) {
        setError(data.error || "تعذر تأكيد الموافقة");
        return;
      }

      setMsg("تم تأكيد الموافقة! يمكنك الآن متابعة حالة الطلب.");
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("حدث خطأ أثناء الاتصال بالخادم");
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleClick}
      className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-sm font-semibold"
    >
      {loading ? "جارٍ تأكيد الموافقة…" : "الموافقة على العرض وبدء التنفيذ"}
    </button>
  );
}
