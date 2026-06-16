 // app/admin/page.tsx
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";
import GrowthSparkline from "@/components/admin/GrowthSparkline";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import {
  Users, MessageCircle, Languages, AlertCircle, UserCheck,
  TrendingUp, User, Building2, Briefcase, BookOpen, BarChart3,
  Clock, ArrowLeft,
} from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // ── الإحصاءات + الاتجاهات ──────────────────────────────────
  const [
    totalUsers, activeUsers, pendingUsers, pendingOrgs, pendingProfileEdits,
    totalLawyers, totalFirms, totalCompanies, totalTransOffices,
    totalConsultations, consultsToday,
    totalTranslations, pendingTranslations,
    totalOrgs,
    usersThisWeek, usersLastWeek,
    recentUsers,
    allUserDates,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { status: "PENDING" } }),
    prisma.organization.count({ where: { isApproved: false } }),
    prisma.lawyerProfile.count({
      where: {
        OR: [{ pendingBio: { not: null } }, { pendingAvatarPath: { not: null } }],
      },
    }),
    prisma.user.count({ where: { role: "LAWYER" } }),
    prisma.user.count({ where: { role: "LAW_FIRM" } }),
    prisma.user.count({ where: { role: "COMPANY" } }),
    prisma.user.count({ where: { role: "TRANSLATION_OFFICE" } }),
    prisma.consultation.count(),
    prisma.consultation.count({ where: { createdAt: { gte: dayAgo } } }),
    prisma.translationRequest.count(),
    prisma.translationRequest.count({ where: { status: "PENDING" } }),
    prisma.organization.count(),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.user.count({
      where: { createdAt: { gte: twoWeeksAgo, lt: weekAgo } },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, role: true, status: true },
    }),
    // تواريخ كل المستخدمين لرسم منحنى النمو (8 أسابيع)
    prisma.user.findMany({ select: { createdAt: true } }),
  ]);

  // نسبة نمو الأسبوع مقابل السابق
  const growthPct =
    usersLastWeek > 0
      ? Math.round(((usersThisWeek - usersLastWeek) / usersLastWeek) * 100)
      : usersThisWeek > 0
      ? 100
      : 0;

  // بناء منحنى النمو التراكمي على 8 أسابيع
  const weeks = 8;
  const cumulative: number[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const cutoff = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    cumulative.push(
      allUserDates.filter((u) => u.createdAt <= cutoff).length
    );
  }

  const roleLabel: Record<string, string> = {
    ADMIN: "أدمن", CLIENT: "عميل", LAWYER: "محامٍ",
    LAW_FIRM: "مكتب محاماة", COMPANY: "شركة", TRANSLATION_OFFICE: "مكتب ترجمة",
  };

  const statusLabel: Record<string, { text: string; cls: string }> = {
    ACTIVE: { text: "نشط", cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    PENDING: { text: "معلّق", cls: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    SUSPENDED: { text: "موقوف", cls: "text-red-400 bg-red-500/10 border-red-500/20" },
    EXPIRED: { text: "منتهٍ", cls: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20" },
  };

  const distribution = [
    { label: "محامون", value: totalLawyers, icon: User, color: "text-blue-400" },
    { label: "مكاتب محاماة", value: totalFirms, icon: Building2, color: "text-purple-400" },
    { label: "شركات", value: totalCompanies, icon: Briefcase, color: "text-teal-400" },
    { label: "مكاتب ترجمة", value: totalTransOffices, icon: Languages, color: "text-amber-400" },
  ];

  const health = [
    { label: "المستخدمون النشطون", value: activeUsers, total: totalUsers, color: "bg-emerald-500" },
    { label: "المؤسسات المعتمدة", value: totalOrgs - pendingOrgs, total: totalOrgs, color: "bg-purple-500" },
    { label: "ترجمات منجزة", value: totalTranslations - pendingTranslations, total: totalTranslations, color: "bg-amber-500" },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50" dir="rtl">
      <AdminSidebar />

      <section className="flex-1 p-6 space-y-5 overflow-auto">

        {/* الهيدر */}
        <header className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">لوحة الإدارة</h1>
            <p className="text-sm text-zinc-400 mt-0.5">
              مرحباً، {user.name || user.email} — نظرة شاملة على المنصة
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Clock className="w-3.5 h-3.5" /> محدّث الآن
          </span>
        </header>

        {/* تنبيهات الأعمال */}
        <div className="space-y-2">
          {pendingUsers > 0 && (
            <Link href="/admin/users" className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 hover:bg-amber-500/15 transition">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <span className="flex-1 text-sm text-amber-100">
                <span className="font-semibold">{pendingUsers} طلب تسجيل</span> بانتظار موافقتك
              </span>
              <ArrowLeft className="w-4 h-4 text-amber-400" />
            </Link>
          )}
          {pendingProfileEdits > 0 && (
            <Link href="/admin/lawyer-approvals" className="flex items-center gap-3 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-3 hover:bg-purple-500/15 transition">
              <UserCheck className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <span className="flex-1 text-sm text-purple-100">
                <span className="font-semibold">{pendingProfileEdits} تعديل ملف</span> محامين بانتظار المراجعة
              </span>
              <ArrowLeft className="w-4 h-4 text-purple-400" />
            </Link>
          )}
          {pendingOrgs > 0 && (
            <Link href="/admin/users" className="flex items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 hover:bg-blue-500/15 transition">
              <Building2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <span className="flex-1 text-sm text-blue-100">
                <span className="font-semibold">{pendingOrgs} مؤسسة</span> بانتظار الاعتماد
              </span>
              <ArrowLeft className="w-4 h-4 text-blue-400" />
            </Link>
          )}
        </div>

        {/* المؤشّر البطولي + الثانوية */}
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-3">
          {/* البطولي: إجمالي المستخدمين + المنحنى */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-zinc-400">إجمالي المستخدمين</span>
              <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                growthPct >= 0
                  ? "text-emerald-300 bg-emerald-500/10"
                  : "text-red-300 bg-red-500/10"
              }`}>
                <TrendingUp className="w-3 h-3" />
                {growthPct >= 0 ? "+" : ""}{growthPct}%
              </span>
            </div>
            <div className="text-4xl font-bold text-white leading-none mb-1">
              {totalUsers.toLocaleString("ar-IQ")}
            </div>
            <div className="text-xs text-zinc-500 mb-4">
              {usersThisWeek} مستخدماً جديداً هذا الأسبوع
            </div>
            <GrowthSparkline data={cumulative} />
          </div>

          {/* الثانوية */}
          <div className="flex flex-col gap-3">
            <Link href="/admin/consultations" className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 hover:border-zinc-700 transition flex-1">
              <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                <MessageCircle className="w-4 h-4" /> الاستشارات
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{totalConsultations}</span>
                {consultsToday > 0 && (
                  <span className="text-xs text-emerald-400">+{consultsToday} اليوم</span>
                )}
              </div>
            </Link>
            <Link href="/admin/translation-stats" className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 hover:border-zinc-700 transition flex-1">
              <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                <Languages className="w-4 h-4" /> طلبات الترجمة
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{totalTranslations}</span>
                {pendingTranslations > 0 && (
                  <span className="text-xs text-amber-400">{pendingTranslations} معلّقة</span>
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* توزّع المستخدمين */}
        <div>
          <div className="text-sm text-zinc-400 mb-2">توزّع المستخدمين</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {distribution.map((d) => {
              const Icon = d.icon;
              return (
                <Link key={d.label} href="/admin/users" className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-center hover:border-zinc-700 transition">
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${d.color}`} />
                  <div className="text-xl font-bold text-white">{d.value}</div>
                  <div className="text-xs text-zinc-500">{d.label}</div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* أحدث المستخدمين + صحّة المنصة */}
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-3">
          {/* أحدث المستخدمين */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
              <h2 className="text-sm font-semibold text-zinc-200">أحدث المستخدمين</h2>
              <Link href="/admin/users" className="text-xs text-emerald-400 hover:underline">
                عرض الكل ←
              </Link>
            </div>
            <div className="divide-y divide-zinc-800">
              {recentUsers.map((u) => {
                const st = statusLabel[u.status] || {
                  text: u.status,
                  cls: "text-zinc-400 bg-zinc-800 border-zinc-700",
                };
                return (
                  <div key={u.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-800/40 transition">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                      {u.name?.charAt(0) || u.email?.charAt(0) || "؟"}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-zinc-200">{u.name || u.email}</div>
                      <div className="text-[11px] text-zinc-500">
                        {roleLabel[u.role] || u.role}
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${st.cls}`}>
                      {st.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* صحّة المنصة */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <h2 className="text-sm font-semibold text-zinc-200 mb-3">صحّة المنصة</h2>
            <div className="space-y-3">
              {health.map((h) => {
                const pct = h.total > 0 ? Math.round((h.value / h.total) * 100) : 0;
                return (
                  <div key={h.label}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-zinc-400">{h.label}</span>
                      <span className="text-zinc-300">{h.value} / {h.total}</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full ${h.color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}