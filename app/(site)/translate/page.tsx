"use client";
//app/(site)/translate/page.tsx
import { useState, Suspense } from "react";
import ReactMarkdown from "react-markdown";
import RequestOfficialTranslationButton from "./RequestOfficialTranslationButton";
import Link from "next/link";
import { useLocale } from "@/lib/hooks/useLocale";

type TargetLang = "AR" | "EN" | "FR" | "TR" | "FA";

const T = {
  ar: {
    title: "🌐 ترجمة قانونية معتمدة للمستندات",
    subtitle:
      "اطلب ترجمة قانونية رسمية مصدّقة من مكاتب ترجمة معتمدة (للمحاكم، السفارات، الدوائر الرسمية والجامعات)، أو استخدم الترجمة الذكية الفورية لفهم مستنداتك.",
    needCertified: "تحتاج ترجمة قانونية معتمدة؟",
    needCertifiedDesc:
      "ارفع مستندك أدناه واطلب الترجمة مباشرة، أو تصفّح المكاتب المعتمدة أولاً.",
    browseOffices: "تصفّح مكاتب الترجمة ↗",
    step1: "١) رفع المستند",
    uploaded: "✓ تم رفع المستند بنجاح — يمكنك الآن طلب الترجمة المعتمدة أدناه.",
    uploadHint: "يمكنك رفع ملف PDF أو نصّي أو صورة من الهاتف.",
    step2: "٢) اطلب الترجمة المعتمدة",
    step2Desc:
      "ترجمة رسمية مصدّقة من مكتب معتمد، معترف بها أمام الجهات الرسمية. يدفع العميل للمكتب مباشرة حسب الوثيقة.",
    targetLang: "لغة الهدف:",
    en: "الإنجليزية",
    ar: "العربية",
    fr: "الفرنسية",
    tr: "التركية",
    fa: "الفارسية",
    step2Hint:
      "ارفع المستند (PDF أو صورة) واختر لغة الهدف، ثم اختر المكتب المعتمد وأرسل طلبك — لا حاجة لاستخراج النص للترجمة الرسمية.",
    myRequests: "📄 عرض طلباتي في الترجمة الرسمية ومتابعة حالتها ↗",
    step3: "٣) الترجمة الذكية الفورية",
    step3Tag: "(للفهم فقط — ليست بديلاً عن الترجمة الرسمية)",
    step3Desc:
      "أداة سريعة لفهم مضمون المستند بالذكاء الاصطناعي. تتطلّب استخراج النص أولاً.",
    extracting: "جارٍ استخراج النص...",
    extractBtn: "استخراج النص من الملف",
    ocrNote:
      "ملاحظة: إذا كان الملف صورة ممسوحة ضوئيًا فقد لا يتمكن النظام من استخراج النص بالكامل.",
    extractedText: "النص المستخرج:",
    from: "من:",
    to: "إلى:",
    modeLabel: "نوع الترجمة:",
    modeFormal: "ترجمة قانونية رسمية الأسلوب",
    modeSimple: "ترجمة مبسطة للفهم العام",
    modeFree: "ترجمة حرة مع إعادة صياغة",
    modeReview: "ترجمة مع تدقيق قانوني شديد",
    translating: "جارٍ الترجمة...",
    translateBtn: "ترجمة الآن",
    smartResult: "الترجمة الذكية:",
    copy: "نسخ الترجمة",
    smartNote:
      "هذه الترجمة آلية وتهدف إلى المساعدة في الفهم، ولا تُعتبر بديلًا عن الترجمة الرسمية المعتمدة أمام الجهات الرسمية.",
    alertPickFile: "يرجى اختيار ملف أولًا",
    alertExtractFail: "فشل استخراج النص من الملف",
    alertExtractErr: "حدث خطأ أثناء استخراج النص",
    alertNoText: "لا يوجد نص للترجمة",
    alertTranslateFail: "فشل الترجمة الذكية",
    alertTranslateErr: "حدث خطأ أثناء الترجمة",
  },
  en: {
    title: "🌐 Certified Legal Document Translation",
    subtitle:
      "Request an official certified legal translation from accredited translation offices (for courts, embassies, government departments, and universities), or use instant smart translation to understand your documents.",
    needCertified: "Need a certified legal translation?",
    needCertifiedDesc:
      "Upload your document below and request translation directly, or browse the accredited offices first.",
    browseOffices: "Browse translation offices ↗",
    step1: "1) Upload the document",
    uploaded: "✓ Document uploaded successfully — you can now request the certified translation below.",
    uploadHint: "You can upload a PDF, a text file, or a photo from your phone.",
    step2: "2) Request the certified translation",
    step2Desc:
      "An official certified translation from an accredited office, recognized by official authorities. The client pays the office directly per document.",
    targetLang: "Target language:",
    en: "English",
    ar: "Arabic",
    fr: "French",
    tr: "Turkish",
    fa: "Persian",
    step2Hint:
      "Upload the document (PDF or image), choose the target language, then select the accredited office and send your request — no text extraction is needed for the official translation.",
    myRequests: "📄 View my official translation requests and track their status ↗",
    step3: "3) Instant smart translation",
    step3Tag: "(for understanding only — not a substitute for the official translation)",
    step3Desc:
      "A quick AI tool to understand the document’s content. It requires extracting the text first.",
    extracting: "Extracting text...",
    extractBtn: "Extract text from file",
    ocrNote:
      "Note: if the file is a scanned image, the system may not be able to fully extract the text.",
    extractedText: "Extracted text:",
    from: "From:",
    to: "To:",
    modeLabel: "Translation type:",
    modeFormal: "Formal legal translation style",
    modeSimple: "Simplified for general understanding",
    modeFree: "Free translation with rephrasing",
    modeReview: "Translation with strict legal review",
    translating: "Translating...",
    translateBtn: "Translate now",
    smartResult: "Smart translation:",
    copy: "Copy translation",
    smartNote:
      "This is a machine translation intended to help understanding, and is not a substitute for the official certified translation before official authorities.",
    alertPickFile: "Please choose a file first",
    alertExtractFail: "Failed to extract text from the file",
    alertExtractErr: "An error occurred while extracting the text",
    alertNoText: "No text to translate",
    alertTranslateFail: "Smart translation failed",
    alertTranslateErr: "An error occurred during translation",
  },
} as const;

export default function LegalTranslationPage() {
  const { locale, dir } = useLocale();
  const t = T[locale];

  const [file, setFile] = useState<File | null>(null);
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loadingExtract, setLoadingExtract] = useState(false);
  const [loadingTranslate, setLoadingTranslate] = useState(false);
  const [fromLang, setFromLang] = useState<TargetLang>("AR");
  const [toLang, setToLang] = useState<TargetLang>("EN");
  const [mode, setMode] = useState("formal");
  const [documentId, setDocumentId] = useState<number | null>(null);
  // لغة هدف مستقلة للترجمة المعتمدة (AR/EN فقط)
  const [officialLang, setOfficialLang] = useState<"AR" | "EN">("EN");

  async function extractText() {
    if (!file) {
      alert(t.alertPickFile);
      return;
    }
    setLoadingExtract(true);
    setSourceText("");

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/translation/extract", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        alert(data.error || t.alertExtractFail);
        return;
      }

      setSourceText(data.text || "");
      if (!documentId && data.documentId) {
        setDocumentId(data.documentId);
      }
    } catch (err) {
      console.error(err);
      alert(t.alertExtractErr);
    } finally {
      setLoadingExtract(false);
    }
  }

  async function translate() {
    if (!sourceText.trim()) {
      alert(t.alertNoText);
      return;
    }
    setLoadingTranslate(true);
    setTranslatedText("");

    try {
      const res = await fetch("/api/translation/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sourceText, fromLang, toLang, mode }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert(data.error || t.alertTranslateFail);
        return;
      }

      setTranslatedText(data.translated || "");
    } catch (err) {
      console.error(err);
      alert(t.alertTranslateErr);
    } finally {
      setLoadingTranslate(false);
    }
  }

  // رفع الملف (يُستدعى عند اختيار ملف) — يخزّن المستند ويهيّئ الطلب المعتمد
  async function handleFileChange(f: File | null) {
    setFile(f);
    if (!f) return;

    const form = new FormData();
    form.append("file", f);

    try {
      const res = await fetch("/api/translation/official/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (res.ok && data.ok && data.documentId) {
        setDocumentId(data.documentId);
      }
    } catch (err) {
      console.error("upload error:", err);
    }
  }

  const canRequestOfficial = !!documentId;
  const align = dir === "rtl" ? "text-right" : "text-left";

  return (
    <div className={`max-w-3xl mx-auto px-4 py-8 ${align} text-zinc-100`} dir={dir}>
      <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
      <p className="text-sm text-zinc-400 mb-6">{t.subtitle}</p>

      {/* لافتة رئيسية: تصفّح المكاتب المعتمدة */}
      <div className="mb-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-emerald-200">{t.needCertified}</h2>
            <p className="text-sm text-zinc-300 mt-1">{t.needCertifiedDesc}</p>
          </div>
          <Link
            href="/translation-offices"
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl
                       bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold
                       px-5 py-3 transition"
          >
            {t.browseOffices}
          </Link>
        </div>
      </div>

      {/* ١) رفع المستند */}
      <div className="border border-white/10 rounded-xl bg-zinc-900/70 p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">{t.step1}</h2>

        <input
          type="file"
          accept=".pdf,.txt,.jpg,.jpeg,.png,image/*"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          className="border border-white/10 rounded bg-zinc-900/70 text-sm text-zinc-100 p-2 w-full"
        />

        {documentId ? (
          <p className="mt-3 text-xs text-emerald-400">{t.uploaded}</p>
        ) : (
          <p className="mt-3 text-[11px] text-zinc-500">{t.uploadHint}</p>
        )}
      </div>

      {/* ٢) الترجمة المعتمدة — القسم الأساسي */}
      <div className="border-2 border-emerald-500/50 rounded-xl bg-emerald-500/5 p-5 mb-6">
        <h2 className="text-xl font-semibold mb-1 text-emerald-100">{t.step2}</h2>
        <p className="text-sm text-zinc-300 mb-4">{t.step2Desc}</p>

        <label className="text-sm block mb-1">{t.targetLang}</label>
        <select
          className="w-full sm:w-56 border border-white/10 p-2 rounded bg-zinc-900/70 text-sm text-zinc-100 mb-4"
          value={officialLang}
          onChange={(e) => setOfficialLang(e.target.value as "AR" | "EN")}
        >
          <option value="EN">{t.en}</option>
          <option value="AR">{t.ar}</option>
        </select>

        <Suspense fallback={null}>
          <RequestOfficialTranslationButton
            savedDocumentId={documentId}
            targetLang={officialLang}
            disabled={!canRequestOfficial}
          />
        </Suspense>

        <p className="text-[11px] text-zinc-400 mt-3">{t.step2Hint}</p>

        <div className="mt-4 pt-4 border-t border-white/10">
          <a
            href="/translate/requests"
            className="inline-flex items-center gap-2 text-sm text-emerald-300 hover:text-emerald-200 transition"
          >
            {t.myRequests}
          </a>
        </div>
      </div>

      {/* ٣) الترجمة الذكية الفورية — أداة ثانوية */}
      <div className="border border-white/10 rounded-xl bg-zinc-900/50 p-4">
        <h2 className="text-lg font-semibold mb-1">
          {t.step3}{" "}
          <span className="text-xs font-normal text-zinc-500">{t.step3Tag}</span>
        </h2>
        <p className="text-xs text-zinc-500 mb-4">{t.step3Desc}</p>

        <button
          onClick={extractText}
          disabled={loadingExtract || !file}
          className="px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg
                     hover:bg-amber-400 disabled:opacity-50"
        >
          {loadingExtract ? t.extracting : t.extractBtn}
        </button>

        <p className="mt-2 text-[11px] text-zinc-500">{t.ocrNote}</p>

        <h3 className="font-semibold mb-2 mt-4">{t.extractedText}</h3>
        <textarea
          className="w-full border border-white/10 rounded-lg bg-zinc-900/70
                     text-zinc-100 p-3 min-h-[160px] leading-7
                     focus:outline-none focus:ring-2 focus:ring-amber-500/60"
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3 my-4">
          <div>
            <label className="text-sm mb-1 block">{t.from}</label>
            <select
              className="w-full border border-white/10 p-2 rounded bg-zinc-900/70 text-sm text-zinc-100"
              value={fromLang}
              onChange={(e) => setFromLang(e.target.value as TargetLang)}
            >
              <option value="AR">{t.ar}</option>
              <option value="EN">{t.en}</option>
              <option value="FR">{t.fr}</option>
              <option value="TR">{t.tr}</option>
              <option value="FA">{t.fa}</option>
            </select>
          </div>

          <div>
            <label className="text-sm mb-1 block">{t.to}</label>
            <select
              className="w-full border border-white/10 p-2 rounded bg-zinc-900/70 text-sm text-zinc-100"
              value={toLang}
              onChange={(e) => setToLang(e.target.value as TargetLang)}
            >
              <option value="AR">{t.ar}</option>
              <option value="EN">{t.en}</option>
              <option value="FR">{t.fr}</option>
              <option value="TR">{t.tr}</option>
              <option value="FA">{t.fa}</option>
            </select>
          </div>
        </div>

        <label className="font-semibold text-sm">{t.modeLabel}</label>
        <select
          className="w-full border border-white/10 p-2 rounded my-2 bg-zinc-900/70 text-sm text-zinc-100"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="formal">{t.modeFormal}</option>
          <option value="simple">{t.modeSimple}</option>
          <option value="free">{t.modeFree}</option>
          <option value="review">{t.modeReview}</option>
        </select>

        <button
          onClick={translate}
          disabled={loadingTranslate || !sourceText}
          className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg
                     hover:bg-emerald-700 disabled:opacity-50"
        >
          {loadingTranslate ? t.translating : t.translateBtn}
        </button>

        {translatedText && (
          <>
            <hr className="my-4 border-zinc-800" />
            <h3 className="font-semibold mb-2">{t.smartResult}</h3>

            <div className="prose prose-sm max-w-none border border-white/10
                            rounded-lg p-4 bg-zinc-900/70 text-zinc-100 leading-8">
              <ReactMarkdown>{translatedText}</ReactMarkdown>
            </div>

            <button
              onClick={() => navigator.clipboard.writeText(translatedText)}
              className="mt-3 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-black"
            >
              {t.copy}
            </button>

            <p className="mt-2 text-[11px] text-zinc-500">{t.smartNote}</p>
          </>
        )}
      </div>
    </div>
  );
}
