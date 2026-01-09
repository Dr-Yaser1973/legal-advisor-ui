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
        setError(
          data?.error ||
            `تعذر تسليم الترجمة (رمز ${res.status})`
        );
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
    <div className="border border-emerald-700/40 rounded-xl bg-zinc-900/50 p-4 space-y-3">
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
            السعر: {item.price} {item.currency || "IQD"}
          </div>
        )}
      </div>

      {/* رفع ملف PDF */}
      <div className="space-y-1">
        <label className="text-xs text-zinc-400">
          ملف الترجمة (PDF فقط)
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-xs text-zinc-300"
        />
      </div>

      {/* ملاحظات التسليم */}
      <textarea
        placeholder="ملاحظات التسليم (اختياري)"
        value={deliveryNote}
        onChange={(e) => setDeliveryNote(e.target.value)}
        className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-xs text-right"
        rows={3}
      />

      <button
        type="button"
        disabled={loading || !!msg}
        onClick={handleComplete}
        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-xs"
      >
        {loading
          ? "جارٍ تسليم الترجمة..."
          : msg
          ? "تم التسليم ✅"
          : "تسليم الترجمة"}
      </button>

      {msg && <p className="text-[11px] text-emerald-400">{msg}</p>}
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}
