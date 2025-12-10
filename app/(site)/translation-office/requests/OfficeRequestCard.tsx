 // app/(site)/translation-office/requests/OfficeRequestCard.tsx
"use client";

import { useState } from "react";

export type OfficeRequestItem = {
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

  async function handleAccept() {
    setLoading(true);
    setMsg(null);
    setError(null);

    try {
      const res = await fetch(
        `/api/translation/office/requests/${item.id}/accept`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestId: item.id, // 👈 نرسل رقم الطلب صراحة
            price: Number(price),
            currency: "IQD",
            note,
          }),
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
          `تعذر قبول الطلب (رمز الحالة ${res.status}). حاول مرة أخرى لاحقًا.`;
        setError(msg);
        return;
      }

      setMsg("تم قبول الطلب وتحديد السعر، ولن يظهر بعد الآن في قائمة الطلبات الجديدة.");
    } catch (e) {
      console.error(e);
      setLoading(false);
      setError("حدث خطأ غير متوقع أثناء الاتصال بالخادم");
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
      </div>

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
          onClick={handleAccept}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-xs"
        >
          {loading ? "جارٍ قبول الطلب..." : "قبول الطلب بهذا السعر"}
        </button>
        {msg && <p className="text-[11px] text-emerald-400">{msg}</p>}
        {error && <p className="text-[11px] text-red-400">{error}</p>}
      </div>
    </div>
  );
}
