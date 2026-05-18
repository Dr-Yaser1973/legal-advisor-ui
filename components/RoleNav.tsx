 "use client";
// components/RoleNav.tsx
import Link from "next/link";
import { useSession } from "next-auth/react";
import { BookOpen } from "lucide-react";

function NavLink({ href, label, highlight }: { href: string; label: string; highlight?: boolean }) {
  return (
    <Link href={href} className={`px-3 py-2 rounded-lg hover:bg-white/10 transition-colors inline-flex items-center gap-2 text-sm ${highlight ? "text-amber-300 hover:text-amber-200" : ""}`}>
      {label}
    </Link>
  );
}

export default function RoleNav() {
  const { data: session } = useSession();
  const user: any         = session?.user;
  const role: string | undefined = user?.role;

  const isAdmin       = role === "ADMIN";
  const isLawFirm     = role === "LAW_FIRM";
  const isLawyer      = role === "LAWYER";
  const isTranslation = role === "TRANSLATION_OFFICE";

  return (
    <nav className="hidden md:flex items-center gap-1">

      {/* مكتبة للجميع */}
      <Link href="/library" className="px-3 py-2 rounded-lg hover:bg-white/10 transition-colors inline-flex items-center gap-2 text-sm">
        <BookOpen className="h-4 w-4" />
        <span>المكتبة القانونية</span>
      </Link>

      {/* زائر / CLIENT / COMPANY */}
      {(!role || role === "CLIENT" || role === "COMPANY") && (
        <>
          <NavLink href="/consultations" label="الاستشارات" />
          <NavLink href="/contracts"     label="العقود الذكية" />
          <NavLink href="/smart-lawyer"  label="المحامي الذكي" />
          <NavLink href="/cases"         label="إدارة القضايا" />
          <NavLink href="/translate"     label="الترجمة القانونية" />
          <NavLink href="/lawyers"       label="المحامون" />
          <NavLink href="/pricing"       label="الأسعار" />
        </>
      )}

      {/* محامٍ فرد */}
      {isLawyer && (
        <>
          <NavLink href="/consultations"       label="الاستشارات" />
          <NavLink href="/contracts"           label="العقود الذكية" />
          <NavLink href="/cases"               label="إدارة القضايا" />
          <NavLink href="/lawyers"             label="المحامون" />
          <NavLink href="/lawyers/my-consults" label="استشاراتي كمحامٍ" />
        </>
      )}

      {/* مكتب محاماة */}
      {isLawFirm && (
        <>
          <NavLink href="/consultations"  label="الاستشارات" />
          <NavLink href="/contracts"      label="العقود الذكية" />
          <NavLink href="/cases"          label="إدارة القضايا" />
          <NavLink href="/firm-dashboard" label="🏛️ لوحة المكتب" highlight />
        </>
      )}

      {/* مكتب ترجمة */}
      {isTranslation && (
        <>
          <NavLink href="/translation-office"          label="لوحة الترجمة" highlight />
          <NavLink href="/translation-office/requests" label="الطلبات الجديدة" />
        </>
      )}

      {/* أدمن — يرى كل شيء */}
      {isAdmin && (
        <>
          <NavLink href="/consultations"      label="الاستشارات" />
          <NavLink href="/contracts"          label="العقود الذكية" />
          <NavLink href="/smart-lawyer"       label="المحامي الذكي" />
          <NavLink href="/cases"              label="إدارة القضايا" />
          <NavLink href="/translate"          label="الترجمة القانونية" />
          <NavLink href="/lawyers"            label="المحامون" />
          <NavLink href="/firm-dashboard"     label="🏛️ المكاتب" />
          <NavLink href="/translation-office" label="مكاتب الترجمة" />
          <NavLink href="/pricing"            label="الأسعار" />
          <NavLink href="/admin"              label="🔑 لوحة الأدمن" highlight />
        </>
      )}

    </nav>
  );
}
