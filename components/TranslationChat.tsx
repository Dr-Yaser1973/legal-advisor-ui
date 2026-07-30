"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type ChatMessage = {
  id: number;
  text: string;
  createdAt: string;
  sender: { id: number; name: string | null; role: string };
};

interface Props {
  requestId: number;
  meId: number;
  /** عنوان اختياري يظهر أعلى المحادثة */
  counterpartLabel?: string;
}

export default function TranslationChat({ requestId, meId, counterpartLabel }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/translation/requests/${requestId}/messages`, {
        cache: "no-store",
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        setMessages(Array.isArray(data.messages) ? data.messages : []);
        setError(null);
      }
    } catch {
      /* تجاهل أخطاء الاستطلاع العابرة */
    } finally {
      setLoaded(true);
    }
  }, [requestId]);

  // تحميل أولي + استطلاع كل 6 ثوانٍ
  useEffect(() => {
    load();
    const t = setInterval(load, 6000);
    return () => clearInterval(t);
  }, [load]);

  // التمرير لأسفل عند وصول رسائل جديدة
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value || sending) return;

    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/translation/requests/${requestId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setError(data?.error || "تعذّر إرسال الرسالة.");
        return;
      }
      setText("");
      // إضافة تفاؤلية ثم إعادة التحميل للمزامنة
      if (data.message) setMessages((prev) => [...prev, data.message]);
      load();
    } catch {
      setError("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-3 border border-white/10 rounded-xl bg-zinc-950/60 p-3 text-right">
      <div className="text-xs font-semibold text-emerald-400 mb-1">
        💬 التفاوض على طريقة الدفع {counterpartLabel ? `— ${counterpartLabel}` : ""}
      </div>
      <p className="text-[11px] text-zinc-500 mb-2">
        اتفقوا هنا على طريقة الدفع وتفاصيل التسليم. الدفع يتم مباشرة مع المكتب خارج المنصة.
      </p>

      <div
        ref={listRef}
        className="max-h-56 overflow-y-auto space-y-2 mb-2 pr-1"
      >
        {!loaded ? (
          <p className="text-[11px] text-zinc-500">جارٍ التحميل…</p>
        ) : messages.length === 0 ? (
          <p className="text-[11px] text-zinc-500">لا توجد رسائل بعد. ابدأ المحادثة للاتفاق على طريقة الدفع.</p>
        ) : (
          messages.map((m) => {
            const mine = m.sender?.id === meId;
            return (
              <div
                key={m.id}
                className={`flex ${mine ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-1.5 text-xs whitespace-pre-wrap break-words ${
                    mine
                      ? "bg-emerald-600/80 text-white"
                      : "bg-zinc-800 text-zinc-100"
                  }`}
                >
                  <div className="text-[10px] opacity-70 mb-0.5">
                    {mine ? "أنت" : m.sender?.name || "الطرف الآخر"}
                  </div>
                  {m.text}
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={send} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب رسالتك…"
          maxLength={4000}
          className="flex-1 p-2 rounded bg-zinc-800 border border-zinc-700 text-xs text-right"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-xs whitespace-nowrap"
        >
          {sending ? "…" : "إرسال"}
        </button>
      </form>
      {error && <p className="text-[11px] text-red-400 mt-1">{error}</p>}
    </div>
  );
}
