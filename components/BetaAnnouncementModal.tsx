 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Sparkles } from "lucide-react";

const SEEN_KEY = "beta_seen_global_v1";

export default function BetaAnnouncementModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const seen = localStorage.getItem(SEEN_KEY);
    if (seen === "1") {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, []);

  const close = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(SEEN_KEY, "1");
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 shadow-2xl overflow-hidden text-right">

        {/* زر الإغلاق */}
        <button
          onClick={close}
          className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/40 p-1.5 text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
          aria-label="إغلاق"
        >
          <X className="h-4 w-4" />
        </button>

        {/* شريط علوي */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2 border-b border-white/10 bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-400/50">
              <Sparkles className="h-4 w-4 text-emerald-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-emerald-300">
                النسخة التجريبية • Beta
              </span>
              <span className="text-[11px] text-zinc-400">
                Legal Advisor Platform
              </span>
            </div>
          </div>

          <span className="text-[11px] rounded-full border border-amber-400/50 bg-amber-500/10 px-2 py-0.5 text-amber-200">
            تجريبي – للاختبار فقط • Beta for testing
          </span>
        </div>

        {/* المحتوى */}
        <div className="px-6 py-5 space-y-5">
          {/* عربي */}
          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              🚀 الإطلاق التجريبي لمنصة المستشار القانوني
            </h2>
            <p className="text-sm text-zinc-200 leading-7">
              يسعدنا أن نعلن عن الإطلاق التجريبي لمنصة{" "}
              <span className="font-semibold text-emerald-300">
                المستشار القانوني
              </span>{" "}
              المتخصصة في الاستشارات القانونية الذكية، العقود، الترجمة القانونية،
              والمكتبة القانونية.
            </p>
            <p className="mt-2 text-sm text-zinc-300 leading-7">
              تهدف هذه النسخة إلى تجربة الخدمات الأساسية للمنصة وجمع الملاحظات من
              المستخدمين قبل الإطلاق الرسمي. نذكّر بأن النتائج المقدمة عبر الذكاء
              الاصطناعي والقوالب الجاهزة والترجمة لا تُعد بديلاً عن الاستشارة
              القانونية المتخصصة.
            </p>
          </section>

          <div className="h-px w-full bg-white/10" />

          {/* English */}
          <section className="text-left">
            <h2 className="text-base font-semibold text-white mb-1">
              🚀 Beta Launch of the Legal Advisor Platform
            </h2>
            <p className="text-xs text-zinc-300 leading-6">
              We are pleased to announce the beta launch of the{" "}
              <span className="font-semibold text-emerald-300">
                Legal Advisor
              </span>{" "}
              platform, offering AI-powered legal consultations, smart contract
              templates, legal translation, and a comprehensive legal library.
            </p>
            <p className="mt-2 text-xs text-zinc-400 leading-6">
              This beta version is provided for testing and feedback purposes only.
              All AI results, templates, and translations are informational and do not
              replace professional legal advice.
            </p>
          </section>
        </div>

        {/* الأزرار */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-6 pb-5 pt-3 border-t border-white/10 bg-zinc-900/60">
          <div className="text-[11px] text-zinc-400 text-right sm:text-right leading-5">
            <p>باستمرارك في استخدام المنصة، فإنك تقرّ بأن هذه نسخة تجريبية.</p>
            <p className="mt-0.5">
              By continuing to use the platform, you acknowledge that this is a beta version.
            </p>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Link
              href="/terms"
              className="rounded-xl border border-white/15 px-3 py-1.5 text-[12px] text-zinc-100 hover:bg-zinc-800/80 transition"
            >
              عرض الشروط وإخلاء المسؤولية / View Terms
            </Link>
            <button
              onClick={close}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 text-[12px] font-medium text-white shadow-md"
            >
              متابعة واستخدام المنصة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
