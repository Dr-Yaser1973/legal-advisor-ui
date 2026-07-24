"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

// زر إعادة إرسال رابط التفعيل لمكتب ترجمة لم يُفعّل حسابه بعد
export default function ResendInviteButton({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function resend() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/translation-offices/resend-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setMsg(data?.error || "تعذّر إرسال الدعوة.");
        return;
      }
      setMsg("✓ أُرسلت الدعوة");
    } catch {
      setMsg("خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={resend}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 px-3 py-1.5 text-xs disabled:opacity-50"
      >
        <Mail className="w-3 h-3" />
        {loading ? "جارٍ الإرسال…" : "إعادة إرسال الدعوة"}
      </button>
      {msg && <span className="text-[11px] text-zinc-400">{msg}</span>}
    </div>
  );
}
