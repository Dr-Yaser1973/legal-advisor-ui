 //app/(site)/layout.tsx
import type { ReactNode } from "react";
import AuthButton from "@/components/AuthButton";
import NotificationBell from "@/components/NotificationBell";
import BetaAnnouncementModal from "@/components/BetaAnnouncementModal";
import Sidebar from "@/components/Sidebar";
import { getLocale } from "@/lib/i18n/server";

const FOOTER = {
  ar: {
    disclaimerLabel: "إخلاء مسؤولية قانونية:",
    disclaimer:
      "جميع المعلومات والخدمات المقدمة داخل منصة المستشار القانوني تهدف لأغراض معلوماتية فقط ولا تُعد بديلاً عن الاستشارة القانونية المتخصصة.",
    rights: "المستشار القانوني — جميع الحقوق محفوظة.",
  },
  en: {
    disclaimerLabel: "Legal disclaimer:",
    disclaimer:
      "All information and services provided within the Smart Legal Advisor platform are for informational purposes only and are not a substitute for specialized legal advice.",
    rights: "Smart Legal Advisor — All rights reserved.",
  },
} as const;

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const f = FOOTER[locale];

  return (
    <>
      <BetaAnnouncementModal />

      {/*
        لا نفرض dir هنا: يرث الاتجاه من <html dir> الذي يديره app/layout.tsx
        عبر getLocale، ويُصحّحه HtmlLangSync بعد التنقّل الناعم. فرض rtl ثابتاً
        هنا كان يبقي الهيكل يمينياً حتى في النسخة الإنجليزية.
      */}
      <div className="flex min-h-screen bg-zinc-950 text-zinc-50">
        <Sidebar />

        <div className="flex flex-col flex-1 min-w-0">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur px-6 py-3 flex items-center justify-end gap-3">
            <NotificationBell />
            <AuthButton />
          </header>

          <main className="flex-1 px-6 py-8">
            {children}
          </main>

          <footer className="border-t border-white/10 py-6 px-6 text-center text-sm text-zinc-400 space-y-2">
            <p className="leading-relaxed text-xs">
              ⚖️ <span className="font-semibold text-zinc-200">{f.disclaimerLabel}</span>{" "}
              {f.disclaimer}
            </p>
            <p className="text-[11px] text-zinc-600">
              © {new Date().getFullYear()} {f.rights}
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
