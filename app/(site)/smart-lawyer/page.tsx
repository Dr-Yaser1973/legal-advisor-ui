 "use client";

import { useState } from "react";
import {
  FileText,
  UploadCloud,
  HelpCircle,
  Bot,
  Clipboard,
} from "lucide-react";

interface RagSource {
  id?: number;
  text?: string;
  distance?: number;
  documentId?: number;
}

export default function SmartLawyerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<RagSource[]>([]);

  // 👇 مهم: ربط الملف بالاستشارة عبر lawDocId
  const [lawDocId, setLawDocId] = useState<number | null>(null);

  // 📂 رفع الملف إلى /api/upload
  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      alert("الرجاء اختيار ملف أولاً");
      return;
    }

    try {
      setIsUploading(true);
      setUploadDone(false);

      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok || data.ok === false) {
        console.error("Upload failed:", data);
        alert(data.error || "فشل رفع الملف");
        return;
      }

      // تم الرفع بنجاح
      setUploadDone(true);

      // التقاط قيمة lawDocId الراجعة من الراوت
      if (typeof data.lawDocId === "number") {
        setLawDocId(data.lawDocId);
      }

      // (اختياري) سؤال افتراضي مباشرة
      if (!question.trim()) {
        setQuestion(
          "أريد رأيًا قانونيًا شاملًا في هذا المستند المرفوع من جميع النواحي القانونية."
        );
      }
    } catch (err) {
      console.error("Unexpected upload error:", err);
      alert("حدث خطأ أثناء رفع الملف");
    } finally {
      setIsUploading(false);
    }
  }

  // 🤖 سؤال المستشار القانوني الذكي
  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) {
      alert("الرجاء إدخال السؤال القانوني");
      return;
    }

    try {
      setIsAsking(true);
      setAnswer("");
      setSources([]);

      const payload: any = { question };
      if (lawDocId) payload.lawDocId = lawDocId;

      const res = await fetch("/api/rag/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.answer) {
        console.error("RAG error:", data);
        alert(data.error || "فشل التحليل الذكي للسؤال");
        return;
      }

      setAnswer(data.answer);
      setSources(data.sources || []);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء استدعاء المستشار الذكي");
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-6 text-right text-zinc-100"
      dir="rtl"
    >
      <h1 className="text-3xl font-bold mb-6 flex items-center justify-end gap-2">
        <span>🧠 المستشار القانوني الذكي</span>
        <span className="text-sm font-normal text-zinc-400">
          (تحليل المستندات + استشارة قانونية)
        </span>
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 🔹 عمود الرفع */}
        <div className="border border-white/10 rounded-xl p-4 bg-zinc-900/70 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>1️⃣ رفع ملف قانوني (PDF فقط)</span>
            </h2>
          </div>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-zinc-300">
                اختر ملفًا قانونيًا (عقد، حكم، مذكرة...):
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full border border-zinc-700 bg-zinc-900/60 text-sm text-zinc-100 rounded-lg px-3 py-2 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isUploading || !file}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              {isUploading ? "جارٍ الرفع ومعالجة المستند..." : "رفع ومعالجة المستند"}
            </button>

            {uploadDone && (
              <p className="text-emerald-400 text-sm">
                ✅ تم رفع المستند ومعالجته وربطه بالاستشارة الذكية.
              </p>
            )}

            {lawDocId && (
              <p className="text-xs text-zinc-400">
                🔗 رقم المستند في قاعدة البيانات: {lawDocId} — سيتم اعتماد هذا
                المستند كأساس في التحليل.
              </p>
            )}
          </form>
        </div>

        {/* 🔹 عمود السؤال */}
        <div className="border border-white/10 rounded-xl p-4 bg-zinc-900/70 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-400" />
              <span>2️⃣ طرح سؤال قانوني</span>
            </h2>
          </div>

          <form onSubmit={handleAsk} className="space-y-4">
            <div>
              <textarea
                className="w-full border border-zinc-700 bg-zinc-900/60 text-sm text-zinc-100 rounded-lg px-3 py-3 min-h-[120px] leading-7 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="اكتب هنا سؤالك القانوني حول المستند..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isAsking || !question.trim()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Bot className="w-4 h-4" />
              {isAsking ? "جارٍ التحليل..." : "استشارة قانونية ذكية"}
            </button>
          </form>

          {/* 🔹 عرض الإجابة */}
          {answer && (
            <div className="mt-4 border-t border-zinc-800 pt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span>نتيجة الاستشارة:</span>
                </h3>
                <button
                  onClick={() => navigator.clipboard.writeText(answer)}
                  className="inline-flex items-center gap-1 text-xs text-emerald-300 hover:text-emerald-200 hover:underline"
                >
                  <Clipboard className="w-3 h-3" />
                  نسخ الإجابة
                </button>
              </div>

              <p className="whitespace-pre-wrap leading-8 text-zinc-100 text-sm">
                {answer}
              </p>

              {/* 🔹 المقاطع المرجعية */}
              {sources && sources.length > 0 && (
                <div className="mt-4 bg-zinc-900/80 border border-zinc-700 rounded-lg p-3">
                  <h4 className="font-semibold mb-2 text-xs text-zinc-200">
                    المقاطع المرجعية المستند إليها:
                  </h4>
                  <ul className="space-y-2 text-[11px] leading-6 max-h-48 overflow-y-auto">
                    {sources.map((s, idx) => (
                      <li
                        key={idx}
                        className="border-b border-zinc-800 pb-2 last:border-b-0"
                      >
                        <div className="text-zinc-300 whitespace-pre-wrap">
                          {s.text}
                        </div>
                        {typeof s.distance === "number" && (
                          <div className="text-[10px] text-zinc-500 mt-1">
                            درجة القرب: {s.distance.toFixed(3)}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
