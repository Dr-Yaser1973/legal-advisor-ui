"use client";

import { useState } from "react";

export type OfficeInProgressItem = {
  id: number;
  targetLang: "AR" | "EN";
  sourceDoc: {
    id: number;
    title: string | null;
    filename: string | null;
  };
  client: {
    id: number;
    name: string | null;
    email: string | null;
  };
  price?: number | null;
  currency?: string | null;
  note?: string | null;
};

export default function OfficeInProgressCard({
  item,
}: {
  item: OfficeInProgressItem;
}) {
  const [deliveryNote, setDeliveryNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleComplete() {
    setLoading(true);
    setMsg(null);
    setError(null);

    try {
      const res = await fetch(
        `/api/translation/office/requests/${item.id}/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deliveryNote }),
        }
      );

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
          `تعذر إنهاء الطلب (رمز الحالة ${res.status}). حاول مرة أخرى لاحقًا.`;
        setError(msg);
        return;
      }

      setMsg("تم إنهاء الطلب، ولن يظهر بعد الآن في قائمة الطلبات قيد التنفيذ.");
    } catch (e) {
      console.error(e);
      setLoading(false);
      setError("حدث خطأ غير متوقع أثناء الاتصال بالخادم");
    }
  }

  return (
    <div className="border border-emerald-700/40 rounded-xl bg-zinc-900/50 p-4 space-y-2">
      <div className="text-sm text-zinc-200">
        <div className="font-semibold mb-1">
          الملف: {item.sourceDoc.title || item.sourceDoc.filename}
        </div>
        <div className="text-xs text-zinc-400">
          العميل: {item.client.name || item.client.email}
        </div>
        <div className="text-xs text-zinc-400">
          اللغة المستهدفة:{" "}
          {item.targetLang === "EN" ? "الإنجليزية" : "العربية"}
        </div>
        {typeof item.price === "number" && (
          <div className="text-xs text-zinc-300 mt-1">
            السعر المتفق عليه: {item.price} {item.currency || "IQD"}
          </div>
        )}
        {item.note && (
          <div className="text-[11px] text-zinc-400 mt-1 whitespace-pre-line">
            ملاحظات العرض: {item.note}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <textarea
          placeholder="ملاحظات التسليم أو رابط الملف النهائي (اختياري)"
          value={deliveryNote}
          onChange={(e) => setDeliveryNote(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-xs text-right"
          rows={3}
        />
        <button
          type="button"
          disabled={loading}
          onClick={handleComplete}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-xs"
        >
          {loading ? "جارٍ إنهاء الطلب..." : "تأكيد إنهاء الترجمة"}
        </button>
        {msg && <p className="text-[11px] text-emerald-400">{msg}</p>}
        {error && <p className="text-[11px] text-red-400">{error}</p>}
      </div>
    </div>
  );
}

