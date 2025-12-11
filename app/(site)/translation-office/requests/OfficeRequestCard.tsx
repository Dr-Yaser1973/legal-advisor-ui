 "use client";

import { useState } from "react";

export type OfficeRequestItem = {
  id: number;
  status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  hasPrice: boolean;
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
};

interface Props {
  item: OfficeRequestItem;
}

export default function OfficeRequestCard({ item }: Props) {
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  const canOffer = item.status === "PENDING" || (!item.hasPrice && item.status === "ACCEPTED");
  const canComplete = item.status === "IN_PROGRESS";

  async function sendOffer() {
    if (!price.trim()) {
      alert("يرجى إدخال سعر الترجمة");
      return;
    }

    setLoading(true);
    setMsg(null);
    setError(null);

    try {
      const res = await fetch(
        `/api/translation/office/requests/${item.id}/offer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            price: Number(price),
            currency: "IQD",
            note,
          }),
        }
      );

      const data = await res.json().catch(() => null);
      setLoading(false);

      if (!res.ok || !data?.ok) {
        setError(
          data?.error ||
            `تعذر إرسال العرض (رمز الحالة ${res.status}). حاول لاحقًا.`
        );
        return;
      }

      setMsg("تم إرسال عرض السعر للعميل.");
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("حدث خطأ غير متوقع أثناء الاتصال بالخادم");
    }
  }

  async function markCompleted() {
    if (!confirm("تأكيد: هل تريد تعليم هذا الطلب كمكتمل؟")) return;

    setCompleting(true);
    setError(null);
    setMsg(null);

    try {
      const res = await fetch(
        `/api/translation/office/requests/${item.id}/complete`,
        {
          method: "POST",
        }
      );

      const data = await res.json().catch(() => null);
      setCompleting(false);

      if (!res.ok || !data?.ok) {
        setError(
          data?.error ||
            `تعذر تعليم الطلب كمكتمل (رمز الحالة ${res.status}).`
        );
        return;
      }

      setMsg("تم تعليم الطلب كمكتمل.");
    } catch (err) {
      console.error(err);
      setCompleting(false);
      setError("حدث خطأ أثناء الاتصال بالخادم");
    }
  }

  return (
    <div className="border border-white/10 rounded-xl bg-zinc-900/40 p-4 space-y-2">
      <div className="text-sm text-zinc-300">
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
        <div className="text-xs text-zinc-400">
          الحالة الحالية: {item.status}
        </div>
      </div>

      {canOffer && (
        <div className="flex flex-col gap-2 mt-2">
          <input
            type="number"
            placeholder="سعر الترجمة (مثلاً 25000)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-xs text-right"
          />
          <textarea
            placeholder="ملاحظات إضافية (اختياري)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-xs text-right"
            rows={2}
          />
          <button
            type="button"
            disabled={loading}
            onClick={sendOffer}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-xs"
          >
            {loading ? "جارٍ إرسال العرض..." : "إرسال عرض السعر للعميل"}
          </button>
        </div>
      )}

      {canComplete && (
        <div className="mt-2">
          <button
            type="button"
            disabled={completing}
            onClick={markCompleted}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-60 text-xs"
          >
            {completing ? "جارٍ التعليم كمكتمل..." : "تعليم الطلب كمكتمل"}
          </button>
        </div>
      )}

      {msg && <p className="text-[11px] text-emerald-400">{msg}</p>}
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}
