"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: any[];
}

export default function RagChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "مرحبًا بك، أنا المستشار القانوني الذكي. يمكنك الآن طرح أي سؤال قانوني، وسأجيبك بالاعتماد على النصوص القانونية والمستندات التي رفعتها.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom automatically
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const question = input.trim();

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/rag/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok || !data.answer) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "⚠️ حدث خطأ أثناء تحليل السؤال.",
          },
        ]);
        return;
      }

      // Append assistant message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources || [],
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ تعذر الاتصال بالمستشار الذكي.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyPress(e: any) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* Header */}
      <div className="p-4 bg-blue-600 text-white text-right shadow-md">
        <h1 className="text-2xl font-bold">🧠 المستشار القانوني الذكي (RAG Chat)</h1>
        <p className="text-sm opacity-90 mt-1">
          اسأل أي سؤال قانوني… وسأجيب بالاعتماد على المستندات والقوانين.
        </p>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-3 leading-7 whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800 shadow"
              }`}
            >
              {msg.content}
            </div>

            {/* RAG sources */}
            {msg.sources && msg.sources.length > 0 && (
              <div className="mt-2 max-w-[80%] bg-gray-50 border rounded-lg p-3 text-xs text-gray-600">
                <p className="font-bold mb-2">المقاطع المرجعية:</p>
                <ul className="space-y-2">
                  {msg.sources.map((s, i) => (
                    <li key={i} className="border-b pb-1 last:border-b-0">
                      <div className="whitespace-pre-wrap">{s.text}</div>
                      {typeof s.distance === "number" && (
                        <p className="text-[10px] text-gray-400 mt-1">
                          درجة القرب: {s.distance.toFixed(3)}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center gap-3">
          <textarea
            placeholder="اكتب سؤالك القانوني هنا..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 border rounded-xl p-3 min-h-[60px] max-h-[160px] text-right shadow-sm"
          />

          <button
            onClick={sendMessage}
            disabled={isSending || !input.trim()}
            className="px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSending ? "جاري التحليل..." : "إرسال"}
          </button>
        </div>
      </div>
    </div>
  );
}

