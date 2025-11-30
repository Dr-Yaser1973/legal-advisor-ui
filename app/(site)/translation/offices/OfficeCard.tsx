 "use client";

import { useState } from "react";

export interface Office {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
}

interface Props {
  office: Office;
  documentId: number;
  targetLang: "AR" | "EN";
}

export function OfficeCard({ office, documentId, targetLang }: Props) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    if (!documentId) {
      alert(
        "لا يوجد معرّف مستند صالح. تأكد من حفظ الملف أولاً في جدول LegalDocument وربطه بالترجمة."
      );
      return;
    }

    setLoading(true);
    setError(null);
    setMsg(null);

    try {
      const res = await fetch("/api/translation/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          officeId: office.id,   // 👈 مهم جداً
          targetLang,
          note,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "تعذر إرسال طلب الترجمة");
      }

      setMsg("تم إرسال طلب الترجمة إلى هذا المكتب بنجاح.");
    } catch (e: any) {
      console.error(e);
      setError(e.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-white/10 rounded-xl bg-zinc-900/40 p-4 space-y-2">
      <div className="text-sm">
        <div className="font-semibold">{office.name || "مكتب ترجمة"}</div>
        {office.location && (
          <div className="text-zinc-400 text-xs">العنوان: {office.location}</div>
        )}
        {office.phone && (
          <div className="text-zinc-400 text-xs">الهاتف: {office.phone}</div>
        )}
        {office.email && (
          <div className="text-zinc-400 text-xs">البريد الإلكتروني: {office.email}</div>
        )}
      </div>

      <textarea
        className="w-full text-xs border border-zinc-700 bg-zinc-800 rounded-lg p-2 text-right"
        placeholder="ملاحظاتك حول الترجمة المطلوبة (اختياري)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
      />

      <button
        type="button"
        onClick={handleSend}
        disabled={loading}
        className="mt-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-xs"
      >
        {loading ? "جارٍ إرسال الطلب..." : "إرسال طلب ترجمة إلى هذا المكتب"}
      </button>

      {msg && <p className="text-[11px] text-emerald-400 mt-1">{msg}</p>}
      {error && <p className="text-[11px] text-red-400 mt-1">{error}</p>}
    </div>
  );
}
