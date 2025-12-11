 "use client";

import { useState } from "react";

export default function AcceptOfferButton({ requestId }: { requestId: number }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!confirm("هل أنت متأكد من الموافقة على عرض المكتب وبدء تنفيذ الترجمة؟")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/translation/client/requests/${requestId}/accept-offer`,
        {
          method: "POST",
        }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        alert(
          data?.error ||
            "تعذر تأكيد الموافقة على العرض، يمكنك المحاولة لاحقًا."
        );
        return;
      }

      alert("تم تأكيد الموافقة على العرض، وسيبدأ مكتب الترجمة بتنفيذ الطلب.");
      // تحديث بسيط للصفحة
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ غير متوقع أثناء الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleClick}
      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-xs font-semibold"
    >
      {loading ? "جارٍ تأكيد الموافقة..." : "موافقة على عرض المكتب وبدء التنفيذ"}
    </button>
  );
}
