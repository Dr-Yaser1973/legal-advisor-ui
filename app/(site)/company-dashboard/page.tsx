 "use client";
// app/(site)/company-dashboard/page.tsx
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2 } from "lucide-react";
import EmployeeManager from "@/components/EmployeeManager";

export default function CompanyDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as any;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && user?.role !== "COMPANY") router.push("/dashboard");
  }, [status, user, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        جارٍ التحميل...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* الهيدر */}
        <header className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <h1 className="text-2xl font-bold">لوحة الشركة</h1>
            </div>
            <p className="text-sm text-zinc-400">إدارة حساب شركتك والموظفين</p>
          </div>
        </header>

        {/* الخدمات المتاحة */}
        <section>
          <h2 className="text-sm font-semibold text-zinc-300 mb-3">الخدمات المتاحة لشركتك</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { href: "/consultations", emoji: "⚖️", label: "الاستشارات" },
              { href: "/contracts",     emoji: "📄", label: "العقود" },
              { href: "/cases",         emoji: "📁", label: "القضايا" },
              { href: "/translate",     emoji: "🌐", label: "الترجمة" },
              { href: "/library",       emoji: "📚", label: "المكتبة" },
              { href: "/smart-lawyer",  emoji: "🤖", label: "المحامي الذكي" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center hover:border-emerald-500/40 transition">
                <div className="text-xl mb-1">{l.emoji}</div>
                <div className="text-[10px] text-zinc-300">{l.label}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* إدارة الموظفين — المكوّن المشترك */}
        <EmployeeManager currentEmail={user?.email} />

      </div>
    </main>
  );
}