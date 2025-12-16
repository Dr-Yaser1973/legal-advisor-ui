 "use client";

import { useEffect, useState, useRef } from "react";

export default function ChatRoomPage(props: {
  params: Promise<{ roomId: string }>;
}) {
  const [roomId, setRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loadingSend, setLoadingSend] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // unwrap params (Next.js 16)
  useEffect(() => {
    let mounted = true;
    (async () => {
      const resolved = await props.params;
      const id = Number(resolved.roomId);
      if (mounted) setRoomId(Number.isFinite(id) ? id : null);
    })();
    return () => {
      mounted = false;
    };
  }, [props.params]);

  async function loadMessages(id: number) {
    const res = await fetch(`/api/chat/${id}/messages`, { cache: "no-store" });
    if (!res.ok) return;

    const data = await res.json();
    setMessages(data);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function sendMessage() {
    const t = text.trim();
    if (!t || roomId === null) return;

    setLoadingSend(true);
    try {
      const res = await fetch(`/api/chat/${roomId}/send`, {
        method: "POST",
        body: JSON.stringify({ text: t }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) return;

      setText("");
      await loadMessages(roomId);
    } finally {
      setLoadingSend(false);
    }
  }

  // ✅ load + polling لتحقيق التزامن
  useEffect(() => {
    if (roomId === null) return;

    loadMessages(roomId);
    const interval = setInterval(() => loadMessages(roomId), 2000);

    return () => clearInterval(interval);
  }, [roomId]);

  if (roomId === null) {
    return <div className="text-center text-white p-10">جارِ التحميل...</div>;
  }

  return (
    <div className="p-5 text-white">
      <h1 className="text-xl mb-4">غرفة المحادثة #{roomId}</h1>

      <div className="border border-white/20 p-4 rounded h-96 overflow-y-auto">
        {messages.map((m: any) => (
          <div key={m.id} className="mb-3">
            <div className="text-zinc-300 text-sm">
              {m.sender?.name || "مستخدم"} ({m.sender?.role})
            </div>
            <div className="text-white whitespace-pre-wrap">{m.text}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 bg-zinc-900 border border-white/20 rounded"
          placeholder="اكتب رسالة..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loadingSend}
          className="px-4 py-2 bg-blue-600 rounded disabled:opacity-60"
        >
          {loadingSend ? "..." : "إرسال"}
        </button>
      </div>
    </div>
  );
}
