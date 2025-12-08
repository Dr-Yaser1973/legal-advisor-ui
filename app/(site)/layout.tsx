 // app/(site)/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";
import Providers from "@/app/providers";
import AuthButton from "@/components/AuthButton";
import { BookOpen, Scale } from "lucide-react";

// 🔥 استدعاء المودال الخاص بالإطلاق التجريبي
import BetaAnnouncementModal from "@/components/BetaAnnouncementModal";

type NavLinkProps = {
  href: string;
  label: string;
  icon?: React.ReactNode;
};

function NavLink({ href, label, icon }: NavLinkProps) {
  return (
    <Link
      className="px-3 py-2 rounded-lg hover:bg-white/10 transition-colors inline-flex items-center gap-2 text-sm"
      href={href}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 group"
      aria-label="العودة إلى الصفحة الرئيسية"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-emerald-400/50 bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
        <Scale className="h-5 w-5" />
      </div>

      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-tight">
          المستشار القانوني
        </span>
        <span className="text-[11px] text-zinc-400">
          منصة الاستشارات والعقود والترجمة القانونية
        </span>
      </div>
    </Link>
  );
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      {/* 🔥 إعلان الإطلاق التجريبي — يظهر في الصفحة الرئيسية فقط */}
      <BetaAnnouncementModal />

      {/* === الهيدر === */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between py-3 gap-4">
          <div className="flex items-center gap-6">
            <Logo />

            <nav className="hidden md:flex items-center gap-1">
              <NavLink
                href="/library"
                label="المكتبة القانونية"
                icon={<BookOpen className="h-4 w-4" />}
              />
              <NavLink href="/contracts" label="العقود الذكية" />
              <NavLink href="/consultations" label="الاستشارات" />
              <NavLink href="/smart-lawyer" label="المحامي الذكي" />
              <NavLink href="/cases" label="إدارة القضايا" />
              <NavLink href="/translation" label="الترجمة القانونية" />
              <NavLink href="/lawyers" label="المحامون" />
                {/* روابط خاصة بالأدوار (لكن الحماية الحقيقية داخل الصفحات نفسها) */}
              <NavLink href="/lawyers/my-consults" label="استشاراتي كمحامٍ" />
              <NavLink href="/admin" label="لوحة الإدارة" />
              <NavLink href="/translation-office" label="مكاتب الترجمة" />

            </nav>
          </div>

          <div className="flex items-center gap-3">
            <AuthButton />
          </div>
        </div>
      </header>

      {/* === المحتوى الرئيسي === */}
      <main className="min-h-screen bg-zinc-950 text-zinc-50">
        <div className="container mx-auto py-8">{children}</div>

        {/* === الفوتر (Footer) === */}
        <footer className="border-t border-white/10 py-8 mt-12 text-center text-sm text-zinc-400 space-y-3">

          <p className="leading-relaxed">
            ⚖️ <span className="font-semibold text-zinc-200">إخلاء مسؤولية قانونية:</span>
            جميع المعلومات والخدمات المقدمة داخل منصة المستشار القانوني — بما في ذلك
            الاستشارات الذكية، العقود، الترجمة القانونية، والمحتوى داخل المكتبة —
            تهدف لأغراض معلوماتية فقط ولا تُعد بديلاً عن الاستشارة القانونية
            المتخصصة المقدَّمة من محامٍ معتمد.
          </p>

          <p className="leading-relaxed">
            ⚠️ تعتمد الاستشارات الذكية على الذكاء الاصطناعي وقد لا تعكس حكماً قانونياً
            نهائياً أو استشارة رسمية، ويُنصح دائمًا بمراجعة محامٍ مختص قبل اتخاذ أي إجراء.
          </p>

          <hr className="border-white/10 w-1/2 mx-auto" />

          <p className="text-xs leading-relaxed text-zinc-500">
            ⚖️ <span className="font-semibold">Legal Disclaimer:</span>  
            All services and content provided by “Legal Advisor Platform”—including
            AI consultations, contract generation, legal translations, and library documents—
            are for informational purposes only and do not constitute professional or
            official legal advice.
          </p>

          <p className="text-xs leading-relaxed text-zinc-500">
            AI-powered legal responses may not reflect final legal judgments and should
            always be reviewed with a licensed attorney before taking any action.
          </p>

          <p className="text-[11px] text-zinc-600 mt-4">
            © {new Date().getFullYear()} المستشار القانوني — جميع الحقوق محفوظة.
          </p>
        </footer>
      </main>
    </Providers>
  );
}
