 "use client";

import { useEffect, useState, useRef } from "react";

interface Props {
  roomId: number;
  userId: number;
}

export default function ChatRoomClient({ roomId, userId }: Props) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // جلب الرسائل
  const loadMessages = async () => {
    const res = await fetch(`/api/chat/${roomId}/messages`);
    const data = await res.json();
    setMessages(data);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;

    setLoading(true);

    const res = await fetch(`/api/chat/${roomId}/messages/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    setText("");
    setLoading(false);
    await loadMessages();
  };

  return (
    <div className="flex flex-col h-[70vh] border border-zinc-700 rounded-xl bg-zinc-900">
      {/* الرسائل */}
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

        <div ref={bottomRef}></div>
      </div>

      {/* مربع الإدخال */}
      <div className="border-t border-zinc-700 p-3 flex gap-2">
        <input
          type="text"
          className="flex-1 rounded-md bg-zinc-800 border border-zinc-600 px-3 py-2 text-sm"
          placeholder="اكتب رسالة..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-md"
        >
          إرسال
        </button>
      </div>
    </div>
  );
}
