 // app/(site)/translate/requests/AcceptOfferButton.tsx
"use client";

import { useState } from "react";

type AcceptOfferButtonProps = {
  requestId: number;
};

export default function AcceptOfferButton({
  requestId,
}: AcceptOfferButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!requestId || Number.isNaN(requestId)) {
      alert("رقم الطلب غير صالح");
      return;
    }

    const confirmed = window.confirm(
      "هل أنت متأكد من الموافقة على عرض مكتب الترجمة والبدء بالتنفيذ؟"
    );
    if (!confirmed) return;

    try {
      setLoading(true);

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
            `تعذر تأكيد الموافقة (رمز الحالة ${res.status}). حاول مرة أخرى لاحقًا.`
        );
        return;
      }

      alert("تم تأكيد العرض، ويمكن لمكتب الترجمة البدء في التنفيذ.");
      // تحديث الصفحة لعرض الحالة الجديدة IN_PROGRESS مثلاً
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ غير متوقع أثناء تأكيد الموافقة على العرض.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleClick}
      className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:opacity-60 text-sm font-semibold"
    >
      {loading ? "جار تأكيد الموافقة..." : "الموافقة على العرض وبدء التنفيذ"}
    </button>
  );
}
