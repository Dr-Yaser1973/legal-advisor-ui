//app/(site)/smart-lawyer/page.tsx
"use client";

import { useState } from "react";
import {
  FileText,
  UploadCloud,
  HelpCircle,
  Bot,
  Clipboard,
  Check,
  Loader2,
  Sparkles,
  ShieldCheck,
  ScrollText,
  CheckCircle2,
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
  const [uploadErr, setUploadErr] = useState<string | null>(null);

  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [askErr, setAskErr] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<RagSource[]>([]);
  const [copied, setCopied] = useState(false);

  // 👇 مهم: ربط الملف بالاستشارة عبر lawDocId
  const [lawDocId, setLawDocId] = useState<number | null>(null);

  function authRedirected(res: Response) {
    return res.redirected && res.url.includes("/login");
  }

  // 📂 رفع الملف إلى /api/upload
  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setUploadErr(null);
    if (!file) {
      setUploadErr("الرجاء اختيار ملف أولاً.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadDone(false);

      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: form });

      if (authRedirected(res)) {
        setUploadErr("يجب تسجيل الدخول لاستخدام المستشار الذكي.");
        return;
      }

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        setUploadErr("يجب تسجيل الدخول أولاً لاستخدام هذه الخدمة.");
        return;
      }

      if (!res.ok || data.ok === false) {
        setUploadErr(data.error || "فشل رفع الملف.");
        return;
      }

      setUploadDone(true);
      if (typeof data.lawDocId === "number") setLawDocId(data.lawDocId);

      if (!question.trim()) {
        setQuestion(
          "أريد رأيًا قانونيًا شاملًا في هذا المستند المرفوع من جميع النواحي القانونية."
        );
      }
    } catch {
      setUploadErr("حدث خطأ غير متوقع أثناء رفع الملف.");
    } finally {
      setIsUploading(false);
    }
  }

  // 🤖 سؤال المستشار القانوني الذكي
  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    setAskErr(null);
    if (!question.trim()) {
      setAskErr("الرجاء إدخال السؤال القانوني.");
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

      if (authRedirected(res)) {
        setAskErr("يجب تسجيل الدخول لطرح استشارة ذكية.");
        return;
      }

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        setAskErr("يجب تسجيل الدخول أولاً لاستخدام هذه الخدمة.");
        return;
      }

      if (!res.ok || !data.answer) {
        setAskErr(data.error || "فشل التحليل الذكي للسؤال.");
        return;
      }

      setAnswer(data.answer);
      setSources(data.sources || []);
    } catch {
      setAskErr("حدث خطأ أثناء استدعاء المستشار الذكي.");
    } finally {
      setIsAsking(false);
    }
  }

  function copyAnswer() {
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 text-zinc-100" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* ── الهيرو ── */}
        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-600/20 via-zinc-900 to-blue-600/20 p-8 mb-8">
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">المستشار القانوني الذكي</h1>
            </div>
            <p className="text-zinc-300 max-w-2xl leading-relaxed">
              ارفع مستندك القانوني (عقد، حكم، مذكرة…) واطرح أسئلتك — يحلّله الذكاء الاصطناعي
              ويجيبك مستنداً إلى نصّ المستند نفسه.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {[
                { icon: ScrollText, label: "تحليل مستندات PDF" },
                { icon: ShieldCheck, label: "إجابات مستندة للنص" },
                { icon: Bot, label: "بالعربية الفصحى" },
              ].map((c) => (
                <span key={c.label} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                  <c.icon className="w-3.5 h-3.5 text-emerald-400" />
                  {c.label}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* ── الخطوتان ── */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* 1️⃣ الرفع */}
          <section className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-sm font-bold">1</span>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                رفع مستند قانوني
              </h2>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <label className="group block cursor-pointer rounded-xl border-2 border-dashed border-zinc-700 hover:border-emerald-500/60 bg-zinc-950/40 px-4 py-8 text-center transition">
                <UploadCloud className="w-9 h-9 mx-auto mb-2 text-zinc-500 group-hover:text-emerald-400 transition" />
                <div className="text-sm text-zinc-300">
                  {file ? file.name : "اضغط لاختيار ملف PDF"}
                </div>
                <div className="text-xs text-zinc-500 mt-1">عقد • حكم • مذكرة — PDF فقط</div>
                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => { setFile(e.target.files?.[0] ?? null); setUploadDone(false); setUploadErr(null); }}
                />
              </label>

              <button
                type="submit"
                disabled={isUploading || !file}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                {isUploading ? "جارٍ الرفع والمعالجة…" : "رفع ومعالجة المستند"}
              </button>

              {uploadErr && (
                <p className="text-sm text-red-300 border border-red-500/40 bg-red-950/30 rounded-lg px-3 py-2">{uploadErr}</p>
              )}

              {uploadDone && (
                <div className="flex items-center gap-2 text-sm text-emerald-300 border border-emerald-500/40 bg-emerald-950/20 rounded-lg px-3 py-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  تمّت معالجة المستند وربطه بالتحليل الذكي.
                </div>
              )}
            </form>
          </section>

          {/* 2️⃣ السؤال */}
          <section className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/40 text-blue-300 flex items-center justify-center text-sm font-bold">2</span>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-400" />
                اطرح سؤالك القانوني
              </h2>
            </div>

            <form onSubmit={handleAsk} className="space-y-4">
              <textarea
                className="w-full border border-zinc-700 bg-zinc-950/60 text-sm text-zinc-100 rounded-xl px-3 py-3 min-h-[140px] leading-7 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                placeholder="مثال: ما المخاطر القانونية في هذا العقد؟ وما بنوده المجحفة؟"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />

              <button
                type="submit"
                disabled={isAsking || !question.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAsking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                {isAsking ? "جارٍ التحليل…" : "استشارة قانونية ذكية"}
              </button>

              {askErr && (
                <p className="text-sm text-red-300 border border-red-500/40 bg-red-950/30 rounded-lg px-3 py-2">{askErr}</p>
              )}
              <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-blue-400" />
                يمكنك السؤال دون رفع مستند — أو رفع مستند أولاً لإجابة مستندة إليه.
              </p>
            </form>
          </section>
        </div>

        {/* ── نتيجة الاستشارة ── */}
        {(isAsking || answer) && (
          <section className="mt-6 rounded-2xl border border-emerald-500/30 bg-zinc-900/70 p-6 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-400" />
                نتيجة الاستشارة
              </h3>
              {answer && (
                <button
                  onClick={copyAnswer}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-zinc-300 hover:bg-white/5 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clipboard className="w-3.5 h-3.5" />}
                  {copied ? "تم النسخ" : "نسخ الإجابة"}
                </button>
              )}
            </div>

            {isAsking && !answer ? (
              <div className="flex items-center gap-3 text-zinc-400 text-sm py-6 justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                يحلّل المستشار الذكي سؤالك…
              </div>
            ) : (
              <p className="whitespace-pre-wrap leading-8 text-zinc-100 text-sm">{answer}</p>
            )}

            {/* المقاطع المرجعية (بلا تفاصيل تقنية) */}
            {sources.length > 0 && (
              <details className="mt-5 group">
                <summary className="cursor-pointer text-xs text-zinc-400 hover:text-zinc-200 select-none">
                  📎 المقاطع المرجعية من المستند ({sources.length})
                </summary>
                <ul className="mt-3 space-y-2 text-[12px] leading-6 max-h-60 overflow-y-auto pr-1">
                  {sources.map((s, idx) => (
                    <li key={idx} className="border-r-2 border-emerald-500/40 bg-zinc-950/40 rounded-lg px-3 py-2 text-zinc-300 whitespace-pre-wrap">
                      {s.text}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </section>
        )}

        {/* ── تنبيه قانوني ── */}
        <p className="mt-8 text-center text-xs text-zinc-500 leading-6 max-w-2xl mx-auto">
          ⚖️ هذه الاستشارة الذكية للاسترشاد فقط ولا تُغني عن استشارة محامٍ بشري مختص.
          يمكنك طلب استشارة موثّقة عبر <a href="/consultations" className="text-emerald-400 hover:underline">صفحة الاستشارات</a>.
        </p>
      </div>
    </div>
  );
}
