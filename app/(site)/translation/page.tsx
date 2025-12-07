 "use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { RequestOfficialTranslationButton } from "./RequestOfficialTranslationButton";

export default function LegalTranslationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loadingExtract, setLoadingExtract] = useState(false);
  const [loadingTranslate, setLoadingTranslate] = useState(false);
  const [fromLang, setFromLang] = useState<"AR" | "EN">("AR");
  const [toLang, setToLang] = useState<"AR" | "EN">("EN");
  const [mode, setMode] = useState("formal");
  const [documentId, setDocumentId] = useState<number | null>(null); // معرّف LegalDocument

  async function extractText() {
    if (!file) {
      alert("يرجى اختيار ملف أولًا");
      return;
    }
    setLoadingExtract(true);
    setSourceText("");
    setDocumentId(null);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/translation/extract", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "فشل استخراج النص");
        return;
      }

      setSourceText(data.text || "");

      // استقبال documentId الحقيقي القادم من الـ API
      if (data.documentId) {
        setDocumentId(data.documentId);
      } else {
        // احتياطًا لو الـ API لم يُرجع documentId
        console.warn("no documentId returned from /api/translation/extract");
      }
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء استخراج النص");
    } finally {
      setLoadingExtract(false);
    }
  }

  async function translate() {
    if (!sourceText.trim()) {
      alert("لا يوجد نص للترجمة");
      return;
    }

    setLoadingTranslate(true);
    setTranslatedText("");

    try {
      const res = await fetch("/api/translation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sourceText,
          fromLang,
          toLang,
          mode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "فشل الترجمة");
        return;
      }

      setTranslatedText(data.translated || "");
    } catch (e) {
      console.error(e);
      alert("خطأ أثناء الترجمة");
    } finally {
      setLoadingTranslate(false);
    }
  }

return (
  <div className="max-w-6xl mx-auto px-4 py-8 text-right text-zinc-100">
    <h1 className="text-3xl font-bold mb-2">🌐 الترجمة القانونية للمستندات</h1>
    <p className="text-sm text-zinc-400 mb-6">
      يمكنك اختيار الترجمة الذكية الفورية داخل المنصّة، أو طلب ترجمة رسمية
      مصدّقة من مكتب ترجمة معتمد.
    </p>

    <div className="grid md:grid-cols-2 gap-6">
      {/* العمود الأيسر: رفع المستند واستخراج النص */}
      <div className="border border-white/10 rounded-xl bg-zinc-900/70 p-4">
        <h2 className="text-xl font-semibold mb-3">١) رفع المستند</h2>

        <input
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border border-white/10 rounded bg-zinc-900/70 text-sm text-zinc-100 p-2 w-full mb-3"
        />

        <button
          onClick={extractText}
          disabled={loadingExtract || !file}
          className="px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg 
                     hover:bg-amber-400 disabled:opacity-50"
        >
          {loadingExtract ? "جارٍ استخراج النص..." : "استخراج النص من الملف"}
        </button>

        <hr className="my-4 border-zinc-800" />

        <h3 className="font-semibold mb-2">النص المستخرج:</h3>
        <textarea
          className="w-full border border-white/10 rounded-lg bg-zinc-900/70 
                     text-zinc-100 p-3 min-h-[200px] leading-7 
                     focus:outline-none focus:ring-2 focus:ring-amber-500/60"
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
        />
      </div>

      {/* العمود الأيمن: الترجمة الذكية + الطلب الرسمي */}
      <div className="space-y-4">
        {/* كارت الترجمة الذكية */}
        <div className="border border-white/10 rounded-xl bg-zinc-900/70 p-4">
          <h2 className="text-xl font-semibold mb-3">٢) الترجمة الذكية الفورية</h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-sm mb-1 block">من:</label>
              <select
                className="w-full border border-white/10 p-2 rounded bg-zinc-900/70 text-sm text-zinc-100"
                value={fromLang}
                onChange={(e) => setFromLang(e.target.value as "AR" | "EN")}
              >
                <option value="AR">العربية</option>
                <option value="EN">الإنجليزية</option>
              </select>
            </div>

            <div>
              <label className="text-sm mb-1 block">إلى:</label>
              <select
                className="w-full border border-white/10 p-2 rounded bg-zinc-900/70 text-sm text-zinc-100"
                value={toLang}
                onChange={(e) => setToLang(e.target.value as "AR" | "EN")}
              >
                <option value="AR">العربية</option>
                <option value="EN">الإنجليزية</option>
              </select>
            </div>
          </div>

          <label className="font-semibold text-sm">نوع الترجمة:</label>
          <select
            className="w-full border border-white/10 p-2 rounded my-2 bg-zinc-900/70 text-sm text-zinc-100"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="formal">ترجمة قانونية رسمية</option>
            <option value="simple">ترجمة مبسطة</option>
            <option value="free">ترجمة حرة</option>
            <option value="review">ترجمة مع تدقيق قانوني</option>
          </select>

          <button
            onClick={translate}
            disabled={loadingTranslate || !sourceText}
            className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg 
                       hover:bg-emerald-700 disabled:opacity-50"
          >
            {loadingTranslate ? "جارٍ الترجمة..." : "ترجمة الآن"}
          </button>

          {translatedText && (
            <>
              <hr className="my-4 border-zinc-800" />
              <h3 className="font-semibold mb-2">الترجمة الذكية:</h3>

              {/* ✅ الصندوق الذي كان أبيض جداً */}
              <div className="prose prose-sm max-w-none border border-white/10 
                              rounded-lg p-4 bg-zinc-900/70 text-zinc-100 leading-8">
                <ReactMarkdown>{translatedText}</ReactMarkdown>
              </div>

              <button
                onClick={() => navigator.clipboard.writeText(translatedText)}
                className="mt-3 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-black"
              >
                نسخ الترجمة
              </button>
            </>
          )}
        </div>

        {/* كارت طلب الترجمة الرسمية من مكتب معتمد */}
        <div className="border border-white/10 rounded-xl bg-zinc-900/70 p-4">
          <h2 className="text-xl font-semibold mb-2">
            ٣) طلب ترجمة رسمية من مكتب معتمد
          </h2>
          <p className="text-sm text-zinc-400 mb-3">
            إذا كنت بحاجة إلى ترجمة رسمية مصدّقة (للدوائر الرسمية، المحاكم،
            الجامعات)، يمكنك إرسال طلبك إلى أحد مكاتب الترجمة المعتمدة
            المتعاونة مع المنصّة، وسيصلك عرض السعر والحالة في لوحة حسابك.
          </p>

          <RequestOfficialTranslationButton
            documentId={documentId}
            targetLang={toLang}
          />

          <p className="text-[11px] text-zinc-500 mt-2">
            ملاحظة: إذا لم تقم برفع الملف بعد، سيطلب منك النظام رفع الملف
            أولًا قبل الانتقال إلى صفحة مكاتب الترجمة المعتمدة.
          </p>

          {/* 🔹 زر الانتقال لطلباتي في الترجمة الرسمية */}
          <div className="mt-4 border border-white/10 rounded-xl bg-zinc-950/70 p-4">
            <h2 className="text-lg font-semibold mb-2">📄 طلباتي السابقة</h2>

            <p className="text-sm text-zinc-400 mb-3">
              يمكنك عرض جميع طلبات الترجمة الرسمية التي قمت بتقديمها مسبقًا.
            </p>

            <a
              href="/translate/requests"
              className="inline-flex items-center rounded-xl border border-emerald-600 
                         bg-emerald-600 text-white px-4 py-2 text-sm hover:bg-emerald-700 transition"
            >
              عرض طلباتي في الترجمة الرسمية ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
