// components/lawyers/OfferButton.tsx
"use client";

import { useState } from "react";

export default function OfferButton({ requestId }: { requestId: number }) {
  const [loading, setLoading] = useState(false);

  async function handleOffer() {
    const feeStr = prompt("أدخل أجرة الاستشارة (دينار عراقي):"); 
    if (!feeStr) return;
    const fee = Number(feeStr);
    if (!fee || isNaN(fee) || fee <= 0) { alert("يرجى إدخال رقم صحيح."); return; }
    const note = prompt("ملاحظة للمستفيد (اختياري):") || "";

    setLoading(true);
    const res = await fetch(`/api/lawyers/human-requests/${requestId}/offer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fee, note, currency: "IQD" }),
    });
    const json = await res.json();
    setLoading(false);
    alert(json?.message || json?.error || "تم إرسال العرض");
    if (res.ok) window.location.reload();
  }

  return (
    <button
      onClick={handleOffer}
      disabled={loading}
      className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white transition disabled:opacity-50 flex-shrink-0"
    >
      {loading ? "..." : "تقديم عرض"}
    </button>
  );
}
