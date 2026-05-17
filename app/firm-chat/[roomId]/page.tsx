"use client";
// app/firm-chat/[roomId]/page.tsx

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Send, Building2, User2 } from "lucide-react";

export default function FirmChatRoomPage(props: {
  params: Promise<{ roomId: string }>;
}) {
  const { data: session } = useSession();
  const currentUserId = Number((session?.user as any)?.id);

  const [roomId, setRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loadingSend, setLoadingSend] = useState(false);
  const [roomInfo, setRoomInfo] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // unwrap params
  useEffect(() => {
    let mounted = true;
    (async () => {
      const resolved = await props.params;
      const id = Number(resolved.roomId);
      if (mounted) setRoomId(Number.isFinite(id) ? id : null);
    })();
    return () => { mounted = false; };
  }, [props.params]);

  async function loadMessages(id: number) {
    const res = await fetch(`/api/firm-chat/${id}/messages`, { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setMessages(data.messages || []);
    if (!roomInfo && data.room) setRoomInfo(data.room);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function sendMessage() {
    const t = text.trim();
    if (!t || roomId === null || loadingSend) return;
    setLoadingSend(true);
    try {
      const res = await fetch(`/api/firm-chat/${roomId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t }),
      });
      if (!res.ok) return;
      setText("");
      await loadMessages(roomId);
      inputRef.current?.focus();
    } finally {
      setLoadingSend(false);
    }
  }

  useEffect(() => {
    if (roomId === null) return;
    loadMessages(roomId);
    const interval = setInterval(() => loadMessages(roomId), 3000);
    return () => clearInterval(interval);
  }, [roomId]);

  if (roomId === null) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        جارٍ التحميل...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col" dir="rtl">

      {/* الهيدر */}
      <div className="border-b border-zinc-800 bg-zinc-900 px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <Building2 className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">
            غرفة الاستشارة #{roomId}
          </div>
          <div className="text-xs text-zinc-400">استشارة مع مكتب معتمد</div>
        </div>
        <div className="mr-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-zinc-400">متصل</span>
        </div>
      </div>

      {/* الرسائل */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-zinc-500 text-sm py-10">
            لا توجد رسائل بعد — ابدأ المحادثة
          </div>
        )}

        {messages.map((m: any) => {
          const isMe = m.senderId === currentUserId;
          return (
            <div key={m.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>

              {/* الأيقونة */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${isMe ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-amber-500/20 border border-amber-500/30"}`}>
                {isMe
                  ? <User2 className="w-3.5 h-3.5 text-emerald-400" />
                  : <Building2 className="w-3.5 h-3.5 text-amber-400" />
                }
              </div>

              {/* الرسالة */}
              <div className={`max-w-[75%] space-y-1 ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isMe
                  ? "bg-emerald-600 text-white rounded-tl-sm"
                  : "bg-zinc-800 text-zinc-100 rounded-tr-sm border border-zinc-700"
                }`}>
                  {m.text}
                </div>
                <div className="text-[10px] text-zinc-500 px-1">
                  {new Date(m.createdAt).toLocaleTimeString("ar-IQ", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* مربع الإرسال */}
      <div className="border-t border-zinc-800 bg-zinc-900 px-4 py-3">
        <div className="flex gap-2 items-center">
          <button
            onClick={sendMessage}
            disabled={loadingSend || !text.trim()}
            className="w-10 h-10 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 flex items-center justify-center flex-shrink-0 transition"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition"
            placeholder="اكتب رسالتك..."
          />
        </div>
      </div>

    </div>
  );
}

