 "use client";

import { useEffect, useState } from "react";

export default function ChatRoomPage(props: { params: Promise<{ roomId: string }> }) {
  const [roomId, setRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  // 🔥 هنا نقوم بعمل unwrap للـ params لأنها Promise في Next.js 16
  useEffect(() => {
    async function unwrapParams() {
      const resolved = await props.params;
      setRoomId(Number(resolved.roomId));
    }
    unwrapParams();
  }, [props.params]);

  async function loadMessages(id: number) {
    const res = await fetch(`/api/chat/${id}/messages`);
    if (res.ok) {
      setMessages(await res.json());
    }
  }

  async function sendMessage() {
    if (!text.trim() || roomId === null) return;

    const res = await fetch(`/api/chat/${roomId}/send`, {
      method: "POST",
      body: JSON.stringify({ text }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setText("");
      loadMessages(roomId);
    }
  }

  useEffect(() => {
    if (roomId !== null) loadMessages(roomId);
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
            <div className="text-white">{m.text}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 bg-zinc-900 border border-white/20 rounded"
          placeholder="اكتب رسالة..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          إرسال
        </button>
      </div>
    </div>
  );
}
