 "use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  roomId: number;
  userId: number;
}

export default function ChatRoomClient({ roomId, userId }: Props) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    try {
      const res = await fetch(`/api/chat/${roomId}/messages`, {
        cache: "no-store",
      });

      if (!res.ok) return;

      const data = await res.json();
      setMessages(data);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch {
      // تجاهل مؤقتًا
    }
  };

  useEffect(() => {
    // ✅ عند فتح الغرفة أو تغيير roomId
    loadMessages();

    setPolling(true);
    const interval = setInterval(loadMessages, 2000); // أسرع قليلاً

    return () => {
      clearInterval(interval);
      setPolling(false);
    };
  }, [roomId]); // ✅ مهم

  const sendMessage = async () => {
    const t = text.trim();
    if (!t) return;

    setLoading(true);
    try {
      // ✅ هذا هو المسار الصحيح حسب API الذي أرسلته: /api/chat/[roomId]/send
      const res = await fetch(`/api/chat/${roomId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t }),
      });

      if (!res.ok) {
        setLoading(false);
        return;
      }

      setText("");
      await loadMessages();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] border border-zinc-700 rounded-xl bg-zinc-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-2 rounded-lg max-w-xs ${
              m.senderId === userId
                ? "bg-emerald-600 text-white ml-auto"
                : "bg-zinc-800 text-zinc-200 mr-auto"
            }`}
          >
            <div className="text-sm whitespace-pre-wrap">{m.text}</div>
            <div className="text-xs opacity-60 mt-1">
              {new Date(m.createdAt).toLocaleTimeString("ar-IQ")}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-zinc-700 p-3 flex gap-2">
        <input
          type="text"
          className="flex-1 rounded-md bg-zinc-800 border border-zinc-600 px-3 py-2 text-sm"
          placeholder={polling ? "اكتب رسالة..." : "تحميل..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-md disabled:opacity-60"
        >
          {loading ? "..." : "إرسال"}
        </button>
      </div>
    </div>
  );
}
