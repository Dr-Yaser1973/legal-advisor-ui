// app/admin/consultations/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminConsultationsPage() {
  const session: any = await getServerSession(authOptions as any);
  const role = session?.user?.role ?? "LAWYER";

  if (!session || role !== "ADMIN") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-right">
        <h1 className="text-2xl font-bold mb-4">لوحة الاستشارات</h1>
        <p className="text-sm text-red-400">
          هذه الصفحة متاحة لمدير النظام (ADMIN) فقط.
        </p>
      </div>
    );
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [totalUsers, totalLawyers, totalConsultations, last7DaysConsultations, latestConsultations] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "LAWYER" } }),
      prisma.consultation.count(),
      prisma.consultation.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.consultation.findMany({
        orderBy: { createdAt: "desc" },
        take: 30,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
    ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-right">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">لوحة الاستشارات</h1>
        <p className="text-sm text-zinc-400">
          نظرة سريعة على الاستشارات المقدّمة عبر المنصّة، مع عرض أحدث
          الاستشارات وأصحابها.
        </p>
      </header>

      {/* كروت الإحصائيات */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatCard label="إجمالي المستخدمين" value={totalUsers} />
        <StatCard label="إجمالي المحامين" value={totalLawyers} />
        <StatCard label="إجمالي الاستشارات" value={totalConsultations} />
        <StatCard
          label="استشارات آخر 7 أيام"
          value={last7DaysConsultations}
        />
      </div>

      {/* جدول أحدث الاستشارات */}
      <section className="border border-zinc-800 rounded-2xl bg-zinc-900/80 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">أحدث الاستشارات</h2>
          <p className="text-xs text-zinc-400">
            تم عرض آخر {latestConsultations.length} استشارة.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="py-2 text-right">العنوان</th>
                <th className="py-2 text-right">صاحب الاستشارة</th>
                <th className="py-2 text-right">الدور</th>
                <th className="py-2 text-right">التاريخ</th>
                <th className="py-2 text-right">ملخص</th>
              </tr>
            </thead>
            <tbody>
              {latestConsultations.map((c) => (
                <tr key={c.id} className="border-b border-zinc-900/70">
                  <td className="py-2 align-top">
                    <div className="font-medium">{c.title}</div>
                  </td>
                  <td className="py-2 align-top">
                    <div className="text-sm">
                      {c.user?.name || "بدون اسم"}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {c.user?.email || "بدون بريد"}
                    </div>
                  </td>
                  <td className="py-2 align-top text-xs text-zinc-300">
                    {c.user?.role || "-"}
                  </td>
                  <td className="py-2 align-top text-xs text-zinc-300">
                    {new Date(c.createdAt).toLocaleString("ar-IQ")}
                  </td>
                  <td className="py-2 align-top text-xs text-zinc-400 max-w-xs">
                    {c.description.length > 160
                      ? c.description.slice(0, 160) + "…"
                      : c.description}
                  </td>
                </tr>
              ))}

              {latestConsultations.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-4 text-center text-zinc-400 text-sm"
                  >
                    لا توجد استشارات حتى الآن.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 text-right">
      <div className="text-xs text-zinc-400 mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

