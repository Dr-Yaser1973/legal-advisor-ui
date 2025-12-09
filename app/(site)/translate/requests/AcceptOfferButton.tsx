"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AcceptOfferButton({ requestId }: { requestId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setErr(null);
    setOkMsg(null);

    try {
      const res = await fetch(
        `/api/translation/client/requests/${requestId}/accept-offer`,
        {
          method: "POST",
        }
      );

      // نستخدم نفس أسلوبك في OfficeRequestCard (نقرأ نص ثم نحاول JSON)
      const text = await res.text();
      let data: any = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("Response is not valid JSON:", text);
        }
      }

      if (!res.ok || !data?.ok) {
        setErr(
          data?.error ||
            `تعذر تأكيد قبول العرض (رمز الحالة ${res.status}). حاول مرة أخرى لاحقًا.`
        );
        setLoading(false);
        return;
      }

      setOkMsg("تمت موافقتك على عرض المكتب، ويمكنه الآن البدء في تنفيذ الترجمة.");
      setLoading(false);

      // تحديث صفحة الطلبات لتغيير الحالة إلى IN_PROGRESS
      router.refresh();
    } catch (e) {
      console.error(e);
      setErr("حدث خطأ أثناء الاتصال بالخادم.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-xs"
      >
        {loading ? "جارٍ تأكيد قبول العرض..." : "الموافقة على العرض وبدء التنفيذ"}
      </button>
      {okMsg && <p className="text-[11px] text-emerald-400">{okMsg}</p>}
      {err && <p className="text-[11px] text-red-400">{err}</p>}
    </div>
  );
}

