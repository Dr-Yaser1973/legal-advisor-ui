"use client";

import { useState } from "react";

export default function ResendInviteButton() {
  const [loading, setLoading] = useState(false);

  async function resend() {
    const email = prompt("أدخل البريد الإلكتروني لمكتب الترجمة:");
    if (!email) return;

    setLoading(true);

    try {
      const res = await fetch("/api/admin/translation-offices/resend-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "فشل إعادة الإرسال");
        return;
      }

      alert("✅ تم إرسال رابط التفعيل");
    } catch {
      alert("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={resend}
      disabled={loading}
      className="inline-flex items-center px-4 py-2
                 rounded-lg bg-amber-600 hover:bg-amber-500
                 text-sm font-medium disabled:opacity-50"
    >
      {loading ? "جارٍ الإرسال..." : "↻ إعادة إرسال التفعيل"}
    </button>
  );
}

