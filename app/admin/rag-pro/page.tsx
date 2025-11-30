"use client";

import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: any[];
}

export default function RagProChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<string>("");

  const chatRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom
  function scrollToBottom() {
    setTimeout(() => {
      chatRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load sessions from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("rag_sessions") || "[]");
    setSessions(saved);

    if (saved.length > 0) {
      loadSession(saved[0].id);
    }
  }, []);

  // Save session
  function saveCurrentSession(id: string, msgs: Message[]) {
    const updated = sessions.filter((s) => s.id !== id);
    updated.unshift({ id, messages: msgs });

    setSessions(updated);
    localStorage.setItem("rag_sessions", JSON.stringify(updated));
  }

  // Create new session
  function newSession() {
    const id = Date.now().toString();
    setActiveSession(id);
    setMessages([
      {
        role: "assistant",
        content:
          "مرحبًا بك 👋\nأنا المستشار القانوني الذكي. اسأل أي سؤال قانوني، وسأجيبك بالاعتماد على المستندات والقوانين المخزنة.",
      },
    ]);
    saveCurrentSession(id, []);
  }

  // Load specific session
  function loadSession(id: string) {
    const session = sessions.find((s) => s.id === id);
    if (!session) return;

    setActiveSession(id);
    setMessages(session.messages.length > 0 ? session.messages : [
      {
        role: "assistant",
        content:
          "مرحبًا بك 👋\nهذا سجل محادثتك. يمكنك الاستمرار من هنا.",
      },
    ]);
  }

  // Send message to /api/rag/ask
  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...messages, userMsg];

    setMessages(newMessages);
    setInput("");
    setIsSending(true);
    scrollToBottom();

    try {
      const res = await fetch("/api/rag/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();

      if (!res.ok || !data.answer) {
        const errMsg: Message = {
          role: "assistant",
          content: "⚠️ حدث خطأ أثناء تحليل السؤال.",
        };
        setMessages((prev) => [...prev, errMsg]);
        return;
      }

      const assistantMsg: Message = {
        role: "assistant",
        content: data.answer,
        sources: data.sources,
      };

      const finalMsgs = [...newMessages, assistantMsg];
      setMessages(finalMsgs);
      saveCurrentSession(activeSession, finalMsgs);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ مشكلة اتصال. حاول مرة أخرى.",
        },
      ]);
    } finally {
      setIsSending(false);
      scrollToBottom();
    }
  }

  function handleKey(e: any) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="w-72 bg-white border-l p-4 flex flex-col text-right">

        <button
          onClick={newSession}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg mb-4 hover:bg-blue-700"
        >
          + محادثة جديدة
        </button>

        <h3 className="font-semibold mb-3 text-gray-700">سجل المحادثات</h3>

        <div className="flex-1 overflow-y-auto space-y-2">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => loadSession(s.id)}
              className={`w-full text-right p-2 rounded-lg border ${
                activeSession === s.id
                  ? "bg-blue-50 border-blue-600 text-blue-700"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              محادثة رقم {s.id}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-blue-600 text-white text-right shadow-md">
          <h1 className="text-xl font-bold">
            🧠 المستشار القانوني الذكي — RAG Pro
          </h1>
          <p className="text-sm opacity-90 mt-1">
            نظام احترافي للاستشارات القانونية المعتمدة على المستندات والقوانين.
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-right">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                m.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 whitespace-pre-wrap leading-8 shadow ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>

              {/* RAG Sources */}
              {m.sources && (
                <div className="max-w-[80%] mt-2 bg-gray-50 border rounded-lg p-3 text-xs text-gray-600">
                  <strong className="text-sm">المقاطع المرجعية:</strong>
                  <ul className="list-disc mr-4 mt-2 space-y-2">
                    {m.sources.map((s, idx) => (
                      <li key={idx} className="border-b pb-1 last:border-b-0">
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

          <div ref={chatRef} />
        </div>

        {/* Input */}
        <div className="border-t bg-white p-4">
          <div className="flex items-center gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="اكتب سؤالك القانوني هنا..."
              className="flex-1 border rounded-2xl p-3 min-h-[70px] text-right shadow-sm"
            />

            <button
              onClick={sendMessage}
              disabled={isSending || !input.trim()}
              className="px-5 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSending ? "جارٍ التحليل..." : "إرسال"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

