"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type SupportMsg = {
  id: number;
  body: string;
  fromAdmin: boolean;
  createdAt: string;
  sender: { id: number; name: string | null; role: string };
};

interface Props {
  /** مسار GET/POST للرسائل (نفسه للجانبين) */
  endpoint: string;
  /** هل المُشاهد أدمن؟ يحدّد محاذاة الفقاعات */
  viewerIsAdmin: boolean;
}

export default function SupportChat({ endpoint, viewerIsAdmin }: Props) {
  const [messages, setMessages] = useState<SupportMsg[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
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
  }, [endpoint]);

  useEffect(() => {
    load();
    const t = setInterval(load, 6000);
    return () => clearInterval(t);
  }, [load]);

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
      const res = await fetch(endpoint, {
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
      if (data.message) setMessages((prev) => [...prev, data.message]);
      load();
    } catch {
      setError("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="border border-white/10 rounded-xl bg-zinc-950/60 p-3 text-right">
      <div
        ref={listRef}
        className="max-h-[420px] min-h-[220px] overflow-y-auto space-y-2 mb-3 pr-1"
      >
        {!loaded ? (
          <p className="text-xs text-zinc-500">جارٍ التحميل…</p>
        ) : messages.length === 0 ? (
          <p className="text-xs text-zinc-500">لا توجد رسائل بعد.</p>
        ) : (
          messages.map((m) => {
            const mine = viewerIsAdmin === m.fromAdmin;
            const label = m.fromAdmin ? "الإدارة" : m.sender?.name || "المستخدم";
            return (
              <div key={m.id} className={`flex ${mine ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-1.5 text-sm whitespace-pre-wrap break-words ${
                    mine ? "bg-emerald-600/80 text-white" : "bg-zinc-800 text-zinc-100"
                  }`}
                >
                  <div className="text-[10px] opacity-70 mb-0.5">
                    {mine ? "أنت" : label}
                  </div>
                  {m.body}
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
          className="flex-1 p-2 rounded bg-zinc-800 border border-zinc-700 text-sm text-right"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-sm whitespace-nowrap"
        >
          {sending ? "…" : "إرسال"}
        </button>
      </form>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
