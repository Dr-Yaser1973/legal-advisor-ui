"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Sparkles, Gift } from "lucide-react";

// مفتاح جديد ليظهر إعلان الإطلاق لمن سبق أن أغلق نافذة النسخة التجريبية.
const SEEN_KEY = "launch_free_month_seen_v1";

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
      <div
        className="
          relative w-full max-w-3xl
          rounded-3xl border border-white/10
          bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950
          shadow-2xl overflow-hidden text-right

          max-h-[90vh] sm:max-h-none
          flex flex-col
        "
      >
        {/* زر الإغلاق */}
        <button
          onClick={close}
          className="absolute left-3 top-3 z-10 rounded-full border border-white/10 bg-black/40 p-1.5 text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
          aria-label="إغلاق"
        >
          <X className="h-4 w-4" />
        </button>

        {/* الشريط العلوي — مسافة يسار أكبر (pl-14) كي لا تتراكب الشارة مع زر الإغلاق */}
        <div className="flex items-center justify-between gap-3 pr-6 pl-14 pt-4 pb-2 border-b border-white/10 bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-400/50">
              <Sparkles className="h-4 w-4 text-emerald-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-emerald-300">
                الإطلاق الرسمي • Now Live
              </span>
              <span className="text-[11px] text-zinc-400">
                Legal Advisor Platform
              </span>
            </div>
          </div>

          <span className="text-[11px] rounded-full border border-amber-400/50 bg-amber-500/10 px-2 py-0.5 text-amber-200">
            مجاني لمدة شهر • Free for 1 month
          </span>
        </div>

        {/* المحتوى (Scrollable في الموبايل) */}
        <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
          {/* عربي */}
          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              🚀 الإطلاق الرسمي لمنصة المستشار القانوني
            </h2>
            <p className="text-sm text-zinc-200 leading-7">
              يسعدنا أن نعلن عن الإطلاق الرسمي لمنصة{" "}
              <span className="font-semibold text-emerald-300">
                المستشار القانوني
              </span>{" "}
              المتخصصة في الاستشارات القانونية الذكية، العقود، الترجمة القانونية،
              والمكتبة القانونية.
            </p>

            {/* عرض المجانية */}
            <div className="mt-3 flex items-start gap-3 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-400/50">
                <Gift className="h-4 w-4 text-emerald-300" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-200">
                  🎉 جميع الخدمات مجانية لمدة شهر كامل
                </p>
                <p className="mt-0.5 text-xs text-emerald-100/80 leading-6">
                  احتفالاً بالإطلاق، استمتع بكل مزايا المنصة — الاستشارات والعقود
                  والترجمة والمكتبة — بدون أي رسوم طوال الشهر الأول.
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm text-zinc-300 leading-7">
              نذكّر بأن النتائج المقدمة عبر الذكاء الاصطناعي والقوالب الجاهزة
              والترجمة هي لأغراض إرشادية، ولا تُعد بديلاً عن الاستشارة القانونية
              المتخصصة.
            </p>
          </section>

          <div className="h-px w-full bg-white/10" />

          {/* English */}
          <section className="text-left">
            <h2 className="text-base font-semibold text-white mb-1">
              🚀 Official Launch of the Legal Advisor Platform
            </h2>
            <p className="text-xs text-zinc-300 leading-6">
              We are pleased to announce the official launch of the{" "}
              <span className="font-semibold text-emerald-300">
                Legal Advisor
              </span>{" "}
              platform, offering AI-powered legal consultations, smart contract
              templates, legal translation, and a comprehensive legal library.
            </p>
            <p className="mt-2 text-xs font-semibold text-emerald-300 leading-6">
              🎉 All services are free for a full month to celebrate the launch.
            </p>
            <p className="mt-2 text-xs text-zinc-400 leading-6">
              All AI results, templates, and translations are informational and do not
              replace professional legal advice.
            </p>
          </section>
        </div>

        {/* الأزرار (ثابتة في الأسفل للموبايل) */}
        <div className="
          flex flex-col sm:flex-row
          items-stretch sm:items-center
          justify-between gap-3
          px-6 pb-5 pt-3
          border-t border-white/10
          bg-zinc-900/80
          sticky bottom-0
        ">
          <div className="text-[11px] text-zinc-400 text-right leading-5">
            <p>باستمرارك في استخدام المنصة، فإنك تقرّ بموافقتك على الشروط والأحكام.</p>
            <p className="mt-0.5">
              By continuing to use the platform, you agree to the Terms &amp;
              Conditions.
            </p>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Link
              href="/terms"
              className="rounded-xl border border-white/15 px-3 py-1.5 text-[12px] text-zinc-100 hover:bg-zinc-800/80 transition"
            >
              عرض الشروط / View Terms
            </Link>

            <button
              onClick={close}
              className="
                rounded-xl bg-emerald-600 hover:bg-emerald-700
                px-4 py-2 sm:py-1.5
                text-sm sm:text-[12px]
                font-medium text-white shadow-md
              "
            >
              ابدأ الآن مجاناً
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
