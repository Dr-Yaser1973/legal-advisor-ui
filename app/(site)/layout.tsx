 // app/(site)/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";
import Providers from "@/app/providers";
import AuthButton from "@/components/AuthButton";
import { BookOpen, Scale } from "lucide-react";
import BetaAnnouncementModal from "@/components/BetaAnnouncementModal";
import RoleNav from "@/components/RoleNav";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group" aria-label="العودة إلى الصفحة الرئيسية">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-emerald-400/50 bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
        <Scale className="h-5 w-5" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-tight">المستشار القانوني</span>
        <span className="text-[11px] text-zinc-400">منصة الاستشارات والعقود والترجمة القانونية</span>
      </div>
    </Link>
  );
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <BetaAnnouncementModal />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between py-3 gap-4">
          <div className="flex items-center gap-6">
            <Logo />
            {/* القائمة الديناميكية حسب الدور */}
            <RoleNav />
          </div>
          <div className="flex items-center gap-3">
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-zinc-950 text-zinc-50">
        <div className="container mx-auto py-8">{children}</div>

        <footer className="border-t border-white/10 py-8 mt-12 text-center text-sm text-zinc-400 space-y-3">
          <p className="leading-relaxed">
            ⚖️ <span className="font-semibold text-zinc-200">إخلاء مسؤولية قانونية:</span>{" "}
            جميع المعلومات والخدمات المقدمة داخل منصة المستشار القانوني تهدف لأغراض
            معلوماتية فقط ولا تُعد بديلاً عن الاستشارة القانونية المتخصصة.
          </p>
          <hr className="border-white/10 w-1/2 mx-auto" />
          <p className="text-[11px] text-zinc-600 mt-4">
            © {new Date().getFullYear()} المستشار القانوني — جميع الحقوق محفوظة.
          </p>
        </footer>
      </main>
    </Providers>
  );
}
