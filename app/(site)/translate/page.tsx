"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import RequestOfficialTranslationButton from "./RequestOfficialTranslationButton";
import Link from "next/link";


type TargetLang = "AR" | "EN" | "FR" | "TR" | "FA";
export const metadata = {
  title: "الترجمة القانونية | Legal Translation",
  description: "ترجمة قانونية دقيقة بالذكاء الاصطناعي أو مع مكاتب ترجمة متخصصة. Accurate legal translation via AI or certified offices.",
  alternates: { canonical: "/translation" },
  openGraph: {
    title: "الترجمة القانونية الذكية",
    description: "ترجمة المستندات القانونية بدقة عالية.",
    url: "https://smartlegaladvisor.com/translate",
  },
};

export default function LegalTranslationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loadingExtract, setLoadingExtract] = useState(false);
  const [loadingTranslate, setLoadingTranslate] = useState(false);
  const [fromLang, setFromLang] = useState<TargetLang>("AR");
  const [toLang, setToLang] = useState<TargetLang>("EN");
  const [mode, setMode] = useState("formal");
  const [documentId, setDocumentId] = useState<number | null>(null);

  async function extractText() {
    if (!file) {
      alert("يرجى اختيار ملف أولًا");
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
        alert(data.error || "فشل استخراج النص من الملف");
        return;
      }

      setSourceText(data.text || "");
       if (!documentId && data.documentId) {
  setDocumentId(data.documentId);
}

    } catch (err) {
      console.error(err);
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
      const res = await fetch("/api/translation/ai", {
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
      if (!res.ok || !data.ok) {
        alert(data.error || "فشل الترجمة الذكية");
        return;
      }

      setTranslatedText(data.translated || "");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الترجمة");
    } finally {
      setLoadingTranslate(false);
    }
  }
   
    async function uploadDocumentOnly() {
    if (!file) {
      alert("يرجى اختيار ملف أولًا");
      return;
    }

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/translation/official/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        alert(data.error || "فشل رفع المستند");
        return;
      }

      setDocumentId(data.documentId); // ⭐ المفتاح
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء رفع المستند");
    }
  }

   const canRequestOfficial =
  !!documentId;


  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-right text-zinc-100">
      <h1 className="text-3xl font-bold mb-2">
        🌐 الترجمة القانونية للمستندات
      </h1>
      <p className="text-sm text-zinc-400 mb-6">
        يمكنك استخدام الترجمة الذكية الفوري
        ة لفهم المستندات، أو طلب ترجمة
        رسمية معتمدة من مكاتب الترجمة الشريكة مع المنصّة.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* العمود الأيسر: رفع المستند واستخراج النص */}
        <div className="border border-white/10 rounded-xl bg-zinc-900/70 p-4">
          <h2 className="text-xl font-semibold mb-3">١) رفع المستند</h2>

           <input
  type="file"
  accept=".pdf,.txt"
  onChange={async (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);

    if (!f) return;

    // ⬅️ رفع الملف فقط (بدون استخراج نص)
    const form = new FormData();
    form.append("file", f);

    try {
      const res = await fetch("/api/translation/official/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (res.ok && data.ok && data.documentId) {
        setDocumentId(data.documentId); // ⭐ المفتاح
      }
    } catch (err) {
      console.error("upload error:", err);
    }
  }}
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

          <p className="mt-2 text-[11px] text-zinc-500">
            ملاحظة: إذا كان الملف عبارة عن صور ممسوحة ضوئيًا فقد لا يتمكن
            النظام من استخراج النص بالكامل.
          </p>
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
                  onChange={(e) => setFromLang(e.target.value as TargetLang)}
                >
                   <option value="AR">العربية</option>
<option value="EN">الإنجليزية</option>
<option value="FR">الفرنسية</option>
<option value="TR">التركية</option>
<option value="FA">الفارسية</option>

                </select>
              </div>

              <div>
                <label className="text-sm mb-1 block">إلى:</label>
                <select
                  className="w-full border border-white/10 p-2 rounded bg-zinc-900/70 text-sm text-zinc-100"
                  value={toLang}
                  onChange={(e) => setToLang(e.target.value as TargetLang)}
                >
                  <option value="AR">العربية</option>
<option value="EN">الإنجليزية</option>
<option value="FR">الفرنسية</option>
<option value="TR">التركية</option>
<option value="FA">الفارسية</option>

                </select>
              </div>
            </div>

            <label className="font-semibold text-sm">نوع الترجمة:</label>
            <select
              className="w-full border border-white/10 p-2 rounded my-2 bg-zinc-900/70 text-sm text-zinc-100"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="formal">ترجمة قانونية رسمية الأسلوب</option>
              <option value="simple">ترجمة مبسطة للفهم العام</option>
              <option value="free">ترجمة حرة مع إعادة صياغة</option>
              <option value="review">ترجمة مع تدقيق قانوني شديد</option>
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

                <p className="mt-2 text-[11px] text-zinc-500">
                  هذه الترجمة آلية وتهدف إلى المساعدة في الفهم، ولا تُعتبر بديلًا
                  عن الترجمة الرسمية المعتمدة أمام الجهات الرسمية.
                </p>
              </>
            )}
          </div>

          {/* كارت طلب الترجمة الرسمية من مكتب معتمد */}
    
          <div className="border border-white/10 rounded-xl bg-zinc-900/70 p-4">
            <h2 className="text-xl font-semibold mb-2">
           ٣ طلب ترجمة رسمية من مكتب معتمد
            </h2>
                           <Link
           href="/translation-offices"
           className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
               bg-emerald-600 hover:bg-emerald-500
               text-white text-sm font-medium"
            >
            عرض مكاتب الترجمة المعتمدة
            </Link>
</div>
            <p className="text-sm text-zinc-400 mb-3">
              إذا كنت بحاجة إلى ترجمة رسمية مصدّقة (للدوائر الرسمية، المحاكم،
              الجامعات)، يمكنك إرسال طلبك إلى أحد مكاتب الترجمة المعتمدة
              المتعاونة مع المنصّة.
            </p>

             <RequestOfficialTranslationButton
             savedDocumentId={documentId}
             targetLang={toLang}
             disabled={!canRequestOfficial}
/>


            <p className="text-[11px] text-zinc-500 mt-2">
              يجب أولًا رفع المستند واستخراج النص، ثم اختيار لغة الهدف قبل
              إرسال طلب الترجمة الرسمية.
            </p>

            <div className="mt-4 border border-white/10 rounded-xl bg-zinc-950/70 p-4">
              <h2 className="text-lg font-semibold mb-2">📄 طلباتي السابقة</h2>

              <p className="text-sm text-zinc-400 mb-3">
                يمكنك عرض جميع طلبات الترجمة الرسمية التي قمت بتقديمها ومتابعة
                حالتها.
              </p>

              <a
                href="/translate/requests"
                className="inline-flex items-center rounded-xl border border-emerald-600 
                           bg-emerald-600 text-white px-4 py-2 text-sm hover:bg-emerald-700 transition"
              >
                عرض طلباتي في الترجمة الرسمية ↗
              </a>
            </div>
            <div className="flex justify-end mb-6">
      

          </div>
        </div>
      </div>
    </div>
  );
}

