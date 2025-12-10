 "use client";

import { useState } from "react";

export function AcceptOfferButton({ requestId }: { requestId: number }) {
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
        }
      );

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        // في حال رجع الرد بدون JSON
      }

      if (!res.ok || !data?.ok) {
        const message =
          data?.error ||
          `تعذر تأكيد الموافقة (رمز الحالة ${res.status}). حاول مرة أخرى لاحقًا.`;
        setError(message);
        setLoading(false);
        return;
      }

      setMsg("تم تأكيد موافقتك على عرض مكتب الترجمة، والطلب الآن قيد التنفيذ.");
      setLoading(false);

      // حدّث الواجهة (اختياري)
      // window.location.reload();
    } catch (e) {
      console.error(e);
      setError("حدث خطأ غير متوقع أثناء الاتصال بالخادم");
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleClick}
      className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-sm font-semibold"
    >
      {loading ? "جارٍ تأكيد الموافقة..." : "الموافقة على العرض وبدء التنفيذ"}
    </button>
  );
}
