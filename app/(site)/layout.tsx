//app/(site)/layout.tsx
import type { ReactNode } from "react";
import Providers from "@/app/providers";
import AuthButton from "@/components/AuthButton";
import BetaAnnouncementModal from "@/components/BetaAnnouncementModal";
import Sidebar from "@/components/Sidebar";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <BetaAnnouncementModal />

      <div className="flex min-h-screen bg-zinc-950 text-zinc-50" dir="rtl">

        {/* Sidebar */}
        <Sidebar />

        {/* المحتوى الرئيسي */}
        <div className="flex flex-col flex-1 min-w-0">

          {/* Header مبسط */}
          <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur px-6 py-3 flex items-center justify-end">
            <AuthButton />
          </header>

          {/* المحتوى */}
          <main className="flex-1 px-6 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-white/10 py-6 px-6 text-center text-sm text-zinc-400 space-y-2">
            <p className="leading-relaxed text-xs">
              ⚖️ <span className="font-semibold text-zinc-200">إخلاء مسؤولية قانونية:</span>{" "}
              جميع المعلومات والخدمات المقدمة داخل منصة المستشار القانوني تهدف لأغراض
              معلوماتية فقط ولا تُعد بديلاً عن الاستشارة القانونية المتخصصة.
            </p>
            <p className="text-[11px] text-zinc-600">
              © {new Date().getFullYear()} المستشار القانوني — جميع الحقوق محفوظة.
            </p>
          </footer>

        </div>
      </div>
    </Providers>
  );
}