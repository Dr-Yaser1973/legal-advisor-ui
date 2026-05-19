 // app/admin/page.tsx
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import {
  BookOpen, Users, MessageCircle, FileText,
  BarChart3, Building2, CheckCircle2, Clock,
  TrendingUp, AlertCircle, Languages,
} from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");

  // ── جلب الإحصاءات ──────────────────────────────────────────
  const [
    totalUsers, pendingUsers, activeUsers,
    totalLawyers, totalFirms, totalCompanies,
    totalConsultations, totalContracts,
    totalTranslations, pendingTranslations,
    totalOrgs, pendingOrgs,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { role: "LAWYER" } }),
    prisma.user.count({ where: { role: "LAW_FIRM" } }),
    prisma.user.count({ where: { role: "COMPANY" } }),
    prisma.consultation.count(),
    prisma.generatedContract.count(),
    prisma.translationRequest.count(),
    prisma.translationRequest.count({ where: { status: "PENDING" } }),
    prisma.organization.count(),
    prisma.organization.count({ where: { isApproved: false } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    }),
  ]);

  const stats = [
    { label: "إجمالي المستخدمين", value: totalUsers,        icon: Users,          color: "emerald", href: "/admin/users" },
    { label: "بانتظار الموافقة",  value: pendingUsers,      icon: Clock,          color: "amber",   href: "/admin/users" },
    { label: "المحامون الأفراد",  value: totalLawyers,      icon: CheckCircle2,   color: "blue",    href: "/admin/users" },
    { label: "مكاتب المحاماة",    value: totalFirms,        icon: Building2,      color: "purple",  href: "/admin/users" },
    { label: "الشركات",           value: totalCompanies,    icon: TrendingUp,     color: "teal",    href: "/admin/users" },
    { label: "الاستشارات",        value: totalConsultations,icon: MessageCircle,  color: "emerald", href: "/admin/consultations" },
    { label: "العقود المولّدة",    value: totalContracts,    icon: FileText,       color: "blue",    href: "/admin/contracts-stats" },
    { label: "طلبات الترجمة",     value: totalTranslations, icon: Languages,      color: "amber",   href: "/admin/translation-stats" },
  ];

  const colorMap: Record<string, string> = {
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber:   "text-amber-400   bg-amber-500/10   border-amber-500/20",
    blue:    "text-blue-400    bg-blue-500/10    border-blue-500/20",
    purple:  "text-purple-400  bg-purple-500/10  border-purple-500/20",
    teal:    "text-teal-400    bg-teal-500/10    border-teal-500/20",
  };

  const roleLabel: Record<string, string> = {
    ADMIN: "أدمن", CLIENT: "عميل", LAWYER: "محامٍ",
    LAW_FIRM: "مكتب محاماة", COMPANY: "شركة",
    TRANSLATION_OFFICE: "مكتب ترجمة",
  };

  const statusLabel: Record<string, { text: string; cls: string }> = {
    ACTIVE:    { text: "نشط",    cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    PENDING:   { text: "معلق",   cls: "text-amber-400   bg-amber-500/10   border-amber-500/20" },
    SUSPENDED: { text: "موقوف",  cls: "text-red-400     bg-red-500/10     border-red-500/20" },
    EXPIRED:   { text: "منتهي",  cls: "text-zinc-400    bg-zinc-500/10    border-zinc-500/20" },
  };

  return (
    <div className="flex gap-0 min-h-screen bg-zinc-950 text-zinc-50" dir="rtl">
      <AdminSidebar />

      <section className="flex-1 p-6 space-y-6 overflow-auto">

        {/* الهيدر */}
        <header className="flex items-start justify-between flex-wrap gap-4 border-b border-white/10 pb-5">
          <div>
            <h1 className="text-xl font-bold text-white">لوحة الإدارة</h1>
            <p className="text-sm text-zinc-400 mt-1">مرحباً، {user.name || user.email} — نظرة شاملة على المنصة</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {pendingUsers > 0 && (
              <Link href="/admin/users" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium hover:bg-amber-500/20 transition">
                <AlertCircle className="w-3.5 h-3.5" />
                {pendingUsers} طلب بانتظار الموافقة
              </Link>
            )}
            {pendingOrgs > 0 && (
              <Link href="/admin/users" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-medium hover:bg-blue-500/20 transition">
                <Building2 className="w-3.5 h-3.5" />
                {pendingOrgs} مؤسسة بانتظار الاعتماد
              </Link>
            )}
          </div>
        </header>

        {/* الإحصاءات */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s) => {
            const Icon = s.icon;
            const cls = colorMap[s.color];
            return (
              <Link key={s.label} href={s.href} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 hover:border-zinc-700 transition group">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${cls}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-2xl font-bold text-white group-hover:text-emerald-300 transition">{s.value}</span>
                </div>
                <div className="text-xs text-zinc-400">{s.label}</div>
              </Link>
            );
          })}
        </div>

        {/* المحتوى الرئيسي */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* أحدث المستخدمين */}
          <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
              <h2 className="text-sm font-semibold text-zinc-200">أحدث المستخدمين</h2>
              <Link href="/admin/users" className="text-xs text-emerald-400 hover:underline">عرض الكل ←</Link>
            </div>
            <div className="divide-y divide-zinc-800">
              {recentUsers.map((u) => {
                const st = statusLabel[u.status] || { text: u.status, cls: "text-zinc-400 bg-zinc-800 border-zinc-700" };
                return (
                  <div key={u.id} className="flex items-center justify-between px-4 py-3 hover:bg-zinc-800/40 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                        {u.name?.charAt(0) || u.email?.charAt(0) || "؟"}
                      </div>
                      <div>
                        <div className="text-sm text-zinc-200">{u.name || u.email}</div>
                        <div className="text-[10px] text-zinc-500">{roleLabel[u.role] || u.role}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${st.cls}`}>{st.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* الروابط السريعة */}
          <div className="space-y-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-800">
                <h2 className="text-sm font-semibold text-zinc-200">الإجراءات السريعة</h2>
              </div>
              <div className="p-3 space-y-1.5">
                {[
                  { href: "/admin/users",             label: "مراجعة الطلبات المعلقة",  icon: Clock,         urgent: pendingUsers > 0 },
                  { href: "/admin/library",           label: "إدارة المكتبة",           icon: BookOpen,      urgent: false },
                  { href: "/admin/consultations",     label: "مراقبة الاستشارات",       icon: MessageCircle, urgent: false },
                  { href: "/admin/translation-stats", label: "إحصاءات الترجمة",         icon: BarChart3,     urgent: pendingTranslations > 0 },
                  { href: "/admin/external-sources",  label: "استيراد المصادر",         icon: TrendingUp,    urgent: false },
                ].map((l) => {
                  const Icon = l.icon;
                  return (
                    <Link key={l.href} href={l.href} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${l.urgent ? "bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/15" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"}`}>
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="flex-1">{l.label}</span>
                      {l.urgent && <span className="text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded-full font-bold">جديد</span>}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* ملخص المنصة */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
              <h2 className="text-sm font-semibold text-zinc-200">ملخص المنصة</h2>
              {[
                { label: "المستخدمون النشطون", value: activeUsers,         total: totalUsers },
                { label: "المؤسسات المعتمدة", value: totalOrgs - pendingOrgs, total: totalOrgs },
                { label: "ترجمات منجزة",      value: totalTranslations - pendingTranslations, total: totalTranslations },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400">{item.label}</span>
                    <span className="text-zinc-300">{item.value}/{item.total}</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: item.total > 0 ? `${Math.round((item.value / item.total) * 100)}%` : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
