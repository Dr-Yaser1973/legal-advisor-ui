 //app/admin/translation-stats/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const AI_TRANSLATION_ACTION = "AI_TRANSLATION";

export default async function TranslationOfficesStatsPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  const user = session?.user as any;

  // 🔒 أدمن فقط
  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // حدود زمنية للترجمة الذكية
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 1) مكاتب الترجمة المعتمدة
  const officesPromise = prisma.user.findMany({
    where: {
      role: "TRANSLATION_OFFICE",
      isApproved: true,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: { id: "asc" },
  });

  // 2) طلبات الترجمة (المكاتب) مجمّعة حسب المكتب والحالة
  const groupedPromise = prisma.translationRequest.groupBy({
    by: ["officeId", "status"],
    _count: { _all: true },
    where: {
      officeId: { not: null },
    },
  });

  // 3) 🤖 الترجمة الذكية — من AiUsageLog (action = AI_TRANSLATION)
  const smartTotalPromise = prisma.aiUsageLog.count({
    where: { action: AI_TRANSLATION_ACTION },
  });
  const smartTodayPromise = prisma.aiUsageLog.count({
    where: { action: AI_TRANSLATION_ACTION, createdAt: { gte: startOfToday } },
  });
  const smartMonthPromise = prisma.aiUsageLog.count({
    where: { action: AI_TRANSLATION_ACTION, createdAt: { gte: startOfMonth } },
  });
  const smartUsersPromise = prisma.aiUsageLog.findMany({
    where: { action: AI_TRANSLATION_ACTION },
    select: { userId: true },
    distinct: ["userId"],
  });

  const [
    offices,
    grouped,
    smartTotal,
    smartToday,
    smartMonth,
    smartUsers,
  ] = await Promise.all([
    officesPromise,
    groupedPromise,
    smartTotalPromise,
    smartTodayPromise,
    smartMonthPromise,
    smartUsersPromise,
  ]);

  // تجهيز بيانات كل مكتب
  const stats = offices.map((office) => {
    const rows = grouped.filter((g) => g.officeId === office.id);

    const getCount = (status: string) =>
      rows.find((r) => r.status === status)?._count._all ?? 0;

    const total = rows.reduce((sum, r) => sum + r._count._all, 0);

    return {
      id: office.id,
      name: office.name || `مكتب #${office.id}`,
      total,
      pending: getCount("PENDING"),
      accepted: getCount("ACCEPTED"),
      inProgress: getCount("IN_PROGRESS"),
      completed: getCount("COMPLETED"),
    };
  });

  const smartStats = {
    total: smartTotal,
    today: smartToday,
    month: smartMonth,
    users: smartUsers.length,
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10 text-right space-y-8">

        <div>
          <h1 className="text-2xl font-bold mb-1">
            إحصاءات الترجمة
          </h1>
          <p className="text-sm text-zinc-400">
            متابعة أداء الترجمة الذكية ومكاتب الترجمة المعتمدة
          </p>
        </div>

        {/* 🤖 بطاقات الترجمة الذكية */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            🤖 الترجمة الذكية
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
              <p className="text-xs text-zinc-400 mb-1">الإجمالي</p>
              <p className="text-2xl font-bold text-indigo-400">
                {smartStats.total}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
              <p className="text-xs text-zinc-400 mb-1">اليوم</p>
              <p className="text-2xl font-bold text-sky-400">
                {smartStats.today}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
              <p className="text-xs text-zinc-400 mb-1">هذا الشهر</p>
              <p className="text-2xl font-bold text-emerald-400">
                {smartStats.month}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
              <p className="text-xs text-zinc-400 mb-1">مستخدمون مميّزون</p>
              <p className="text-2xl font-bold text-amber-400">
                {smartStats.users}
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            * تُحتسب من سجلّ الاستخدام (AI_TRANSLATION) ولا تتضمّن حالات تنفيذ لأنها عملية فورية.
          </p>
        </div>

        {/* جدول إحصاءات المكاتب */}
        <div>
          <h2 className="text-lg font-semibold mb-3">🏢 مكاتب الترجمة</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900/70">
                <tr className="text-zinc-300">
                  <th className="px-4 py-3 text-right">المكتب</th>
                  <th className="px-4 py-3">الإجمالي</th>
                  <th className="px-4 py-3">بانتظار</th>
                  <th className="px-4 py-3">مقبولة</th>
                  <th className="px-4 py-3">قيد التنفيذ</th>
                  <th className="px-4 py-3">منفّذة</th>
                </tr>
              </thead>

              <tbody>
                {stats.map((s) => (
                  <tr
                    key={s.id}
                    className="border-t border-white/10 hover:bg-zinc-900/40"
                  >
                    <td className="px-4 py-3 font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-center">{s.total}</td>
                    <td className="px-4 py-3 text-center">{s.pending}</td>
                    <td className="px-4 py-3 text-center">{s.accepted}</td>
                    <td className="px-4 py-3 text-center">{s.inProgress}</td>
                    <td className="px-4 py-3 text-center text-emerald-400 font-semibold">
                      {s.completed}
                    </td>
                  </tr>
                ))}

                {stats.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-zinc-400"
                    >
                      لا توجد بيانات بعد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}