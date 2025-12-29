 import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TranslationOfficesStatsPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  const user = session?.user as any;

  // 🔒 أدمن فقط
  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // 1) جلب كل مكاتب الترجمة المعتمدة
  const offices = await prisma.user.findMany({
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

  // 2) جلب كل طلبات الترجمة مجمّعة حسب المكتب والحالة
  const grouped = await prisma.translationRequest.groupBy({
    by: ["officeId", "status"],
    _count: { _all: true },
    where: {
      officeId: { not: null },
    },
  });

  // 3) تجهيز البيانات لكل مكتب
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

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10 text-right space-y-8">

        <div>
          <h1 className="text-2xl font-bold mb-1">
            إحصاءات مكاتب الترجمة
          </h1>
          <p className="text-sm text-zinc-400">
            متابعة أداء كل مكتب ترجمة على حدة
          </p>
        </div>

        {/* جدول الإحصاءات */}
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
    </main>
  );
}
