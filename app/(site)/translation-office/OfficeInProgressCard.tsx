 // app/(site)/translation-office/OfficeInProgressCard.tsx
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
  const [file, setFile] = useState<File | null>(null);
  const [deliveryNote, setDeliveryNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleComplete() {
    if (!file) {
      setError("يجب رفع ملف الترجمة (PDF) قبل إنهاء الطلب");
      return;
    }

    setLoading(true);
    setMsg(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (deliveryNote) {
        formData.append("note", deliveryNote);
      }

      const res = await fetch(
        `/api/translation/requests/${item.id}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setError(data?.error || `تعذر تسليم الترجمة (رمز ${res.status})`);
        return;
      }

      setMsg("تم تسليم الترجمة بنجاح ولن يظهر الطلب ضمن الطلبات الجارية");
    } catch (e) {
      console.error(e);
      setError("حدث خطأ غير متوقع أثناء الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-purple-500/30 rounded-2xl bg-[#1e1133]/45 p-5 space-y-4">
      {/* معلومات الطلب */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <div className="text-sm font-semibold text-white flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-300 shrink-0">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
              <path d="M14 2v6h6" />
            </svg>
            {item.sourceDoc.title || item.sourceDoc.filename}
          </div>
          <div className="text-xs text-purple-200/80 flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {item.client.name || item.client.email}
          </div>
          <div className="text-xs text-purple-200/80">
            اللغة المستهدفة:{" "}
            {item.targetLang === "EN" ? "الإنجليزية" : "العربية"}
          </div>
          {typeof item.price === "number" && (
            <div className="text-xs text-amber-300">
              السعر: {item.price} {item.currency || "IQD"}
            </div>
          )}
        </div>
        <span className="whitespace-nowrap text-[11px] text-purple-200 bg-purple-500/15 px-2.5 py-1 rounded-full">
          قيد الترجمة
        </span>
      </div>

      {/* منطقة التسليم */}
      <div className="border-t border-purple-500/15 pt-4 space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs text-purple-300">
            ملف الترجمة (PDF فقط)
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-xs text-purple-200/80 file:ml-3 file:rounded-lg file:border-0 file:bg-purple-500/20 file:px-3 file:py-1.5 file:text-xs file:text-purple-100 hover:file:bg-purple-500/30 file:cursor-pointer"
          />
          {file && (
            <p className="text-[11px] text-purple-300/70 truncate">
              {file.name}
            </p>
          )}
        </div>

        <textarea
          placeholder="ملاحظات التسليم (اختياري)"
          value={deliveryNote}
          onChange={(e) => setDeliveryNote(e.target.value)}
          className="w-full p-3 rounded-xl bg-[#1e1133]/40 border border-purple-500/25 text-xs text-right text-white placeholder:text-purple-300/40 outline-none transition focus:border-amber-400/50"
          rows={3}
        />

        <button
          type="button"
          disabled={loading || !!msg}
          onClick={handleComplete}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-amber-700 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-amber-950 font-medium disabled:opacity-60 disabled:cursor-not-allowed text-xs transition"
        >
          {loading
            ? "جارٍ تسليم الترجمة..."
            : msg
            ? "تم التسليم ✓"
            : "تسليم الترجمة"}
        </button>

        {msg && <p className="text-[11px] text-emerald-400">{msg}</p>}
        {error && <p className="text-[11px] text-red-400">{error}</p>}
      </div>
    </div>
  );
}