"use client";
// components/admin/AccountActions.tsx
// إجراءات موحّدة على حساب (شركة/مكتب/محامٍ): اعتماد + مراسلة + حذف نهائي.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, MessageSquare, Trash2, X } from "lucide-react";

type Kind = "company" | "office" | "lawyer";

const KIND_LABEL: Record<Kind, string> = {
  company: "الشركة",
  office: "المكتب",
  lawyer: "المحامي",
};

export default function AccountActions({
  userId,
  email,
  name,
  isApproved,
  kind,
}: {
  userId: number;
  email: string | null;
  name: string;
  isApproved: boolean;
  kind: Kind;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<null | "approve" | "delete" | "message">(null);
  const [showMsg, setShowMsg] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [msgFeedback, setMsgFeedback] = useState<string | null>(null);

  async function approve() {
    setBusy("approve");
    try {
      const res = await fetch(`/api/admin/users/${userId}/approve`, { method: "POST" });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.ok) { alert(d?.error || "تعذّر الاعتماد."); return; }
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function sendMessage() {
    if (!subject.trim() || !message.trim()) {
      setMsgFeedback("العنوان والنص مطلوبان.");
      return;
    }
    setBusy("message");
    setMsgFeedback(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subject.trim(), message: message.trim() }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.ok) { setMsgFeedback(d?.error || "تعذّر الإرسال."); return; }
      setMsgFeedback(d.emailSent ? "✓ أُرسلت (إشعار + بريد)" : "✓ أُرسل إشعار داخلي");
      setSubject("");
      setMessage("");
      setTimeout(() => { setShowMsg(false); setMsgFeedback(null); }, 1200);
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    const label = KIND_LABEL[kind];
    if (!confirm(`حذف ${label} «${name}» نهائياً؟ لا يمكن التراجع.`)) return;
    if (!confirm("تأكيد أخير: سيُمحى الحساب وكل بياناته المرتبطة نهائياً. متابعة؟")) return;
    setBusy("delete");
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.ok) { alert(d?.error || "تعذّر الحذف."); return; }
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2 shrink-0">
      <div className="flex items-center gap-2">
        {!isApproved && (
          <button
            onClick={approve}
            disabled={busy !== null}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-medium disabled:opacity-50"
          >
            <CheckCircle2 className="w-3 h-3" />
            {busy === "approve" ? "…" : "اعتماد"}
          </button>
        )}
        <button
          onClick={() => setShowMsg((v) => !v)}
          disabled={busy !== null}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-xs disabled:opacity-50"
        >
          <MessageSquare className="w-3 h-3" /> مراسلة
        </button>
        <button
          onClick={remove}
          disabled={busy !== null}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/10 px-3 py-1.5 text-xs disabled:opacity-50"
        >
          <Trash2 className="w-3 h-3" />
          {busy === "delete" ? "…" : "حذف"}
        </button>
      </div>

      {/* نموذج المراسلة */}
      {showMsg && (
        <div className="w-72 rounded-xl border border-white/10 bg-zinc-950 p-3 text-right space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-200">
              رسالة إلى {name}
            </span>
            <button onClick={() => setShowMsg(false)} className="text-zinc-500 hover:text-zinc-300">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {email ? (
            <p className="text-[10px] text-zinc-500">إشعار داخلي + Push + بريد ({email})</p>
          ) : (
            <p className="text-[10px] text-amber-400">لا بريد — سيصل إشعار داخلي فقط</p>
          )}
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="العنوان"
            className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-100"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="نص الرسالة…"
            className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-100 min-h-[70px]"
          />
          {msgFeedback && <p className="text-[11px] text-zinc-400">{msgFeedback}</p>}
          <button
            onClick={sendMessage}
            disabled={busy === "message"}
            className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-medium disabled:opacity-50"
          >
            {busy === "message" ? "جارٍ الإرسال…" : "إرسال"}
          </button>
        </div>
      )}
    </div>
  );
}
