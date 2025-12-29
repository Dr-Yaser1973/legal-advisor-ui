 // app/admin/contracts-stats/page.tsx
import AdminSidebar from "@/components/admin/AdminSidebar";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DailyRow = { day: Date; count: number };
type ByUserRow = { userId: number | null; email: string | null; name: string | null; count: number };
type ByLangRow = { language: string | null; count: number };

function fmtDay(d: Date) {
  // يعرض يوم/شهر/سنة بالعراقي
  return new Intl.DateTimeFormat("ar-IQ", { dateStyle: "medium" }).format(d);
}

export default async function AdminContractsStatsPage() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/unauthorized");

  const now = new Date();
  const start30 = new Date(now);
  start30.setDate(start30.getDate() - 30);

  // 1) إجمالي العقود (كل الوقت + آخر 30 يوم)
  const [totalAll, total30] = await Promise.all([
    prisma.generatedContract.count(),
    prisma.generatedContract.count({ where: { createdAt: { gte: start30 } } }),
  ]);

  // 2) توزيع يومي (آخر 30 يوم) - Postgres
  const daily = await prisma.$queryRaw<DailyRow[]>`
    SELECT
      date_trunc('day', "createdAt") AS day,
      COUNT(*)::int AS count
    FROM "GeneratedContract"
    WHERE "createdAt" >= ${start30}
    GROUP BY 1
    ORDER BY 1 ASC
  `;

  // 3) حسب المستخدم (Top 20) - Postgres
  const byUser = await prisma.$queryRaw<ByUserRow[]>`
    SELECT
      gc."createdById" AS "userId",
      u."email" AS "email",
      u."name" AS "name",
      COUNT(*)::int AS count
    FROM "GeneratedContract" gc
    LEFT JOIN "User" u ON u."id" = gc."createdById"
    GROUP BY gc."createdById", u."email", u."name"
    ORDER BY count DESC
    LIMIT 20
  `;

  // 4) حسب اللغة (AR/EN) اعتماداً على template.language
  const byLang = await prisma.$queryRaw<ByLangRow[]>`
    SELECT
      ct."language"::text AS "language",
      COUNT(*)::int AS count
    FROM "GeneratedContract" gc
    LEFT JOIN "ContractTemplate" ct ON ct."id" = gc."templateId"
    GROUP BY ct."language"
    ORDER BY count DESC
  `;

  // 5) Top Templates (اختياري لكن مفيد جداً) - أكثر القوالب استخداماً
  const topTemplates = await prisma.$queryRaw<
    { templateId: number | null; slug: string | null; title: string | null; language: string | null; count: number }[]
  >`
    SELECT
      ct."id" AS "templateId",
      ct."slug" AS "slug",
      ct."title" AS "title",
      ct."language"::text AS "language",
      COUNT(*)::int AS count
    FROM "GeneratedContract" gc
    LEFT JOIN "ContractTemplate" ct ON ct."id" = gc."templateId"
    GROUP BY ct."id", ct."slug", ct."title", ct."language"
    ORDER BY count DESC
    LIMIT 10
  `;

  return (
    <div className="flex gap-0">
      <AdminSidebar />

      <section className="flex-1 p-6 space-y-6">
        <header className="border-b border-white/10 pb-4">
          <h1 className="text-xl font-semibold">إحصائيات العقود المولَّدة</h1>
          <p className="text-sm text-zinc-400 mt-1">
            توزيع يومي (آخر 30 يوم) + حسب المستخدم + حسب اللغة.
          </p>
        </header>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-3">
          <KpiCard title="إجمالي العقود (كل الوقت)" value={totalAll} />
          <KpiCard title="إجمالي العقود (آخر 30 يوم)" value={total30} />
          <KpiCard
            title="متوسط يومي (آخر 30 يوم)"
            value={Math.round((total30 / 30) * 10) / 10}
          />
        </div>

        {/* Daily */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
          <h2 className="font-semibold mb-3">التوزيع اليومي (آخر 30 يوم)</h2>
          {daily.length === 0 ? (
            <p className="text-sm text-zinc-400">لا توجد بيانات كافية.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-zinc-300">
                  <tr className="border-b border-white/10">
                    <th className="p-2 text-right">اليوم</th>
                    <th className="p-2 text-right">عدد العقود</th>
                  </tr>
                </thead>
                <tbody>
                  {daily.map((r, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0">
                      <td className="p-2">{fmtDay(new Date(r.day))}</td>
                      <td className="p-2">{r.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* By User + By Lang */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
            <h2 className="font-semibold mb-3">أكثر المستخدمين توليداً للعقود (Top 20)</h2>
            {byUser.length === 0 ? (
              <p className="text-sm text-zinc-400">لا توجد بيانات.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-zinc-300">
                    <tr className="border-b border-white/10">
                      <th className="p-2 text-right">المستخدم</th>
                      <th className="p-2 text-right">البريد</th>
                      <th className="p-2 text-right">العدد</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byUser.map((r, i) => (
                      <tr key={i} className="border-b border-white/5 last:border-0">
                        <td className="p-2">{r.name ?? (r.userId ? `User #${r.userId}` : "غير معروف")}</td>
                        <td className="p-2 ltr text-left">{r.email ?? "-"}</td>
                        <td className="p-2">{r.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
            <h2 className="font-semibold mb-3">العقود حسب اللغة</h2>
            {byLang.length === 0 ? (
              <p className="text-sm text-zinc-400">لا توجد بيانات.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-zinc-300">
                    <tr className="border-b border-white/10">
                      <th className="p-2 text-right">اللغة</th>
                      <th className="p-2 text-right">العدد</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byLang.map((r, i) => (
                      <tr key={i} className="border-b border-white/5 last:border-0">
                        <td className="p-2">{r.language ?? "غير محدد"}</td>
                        <td className="p-2">{r.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Top Templates (اختياري) */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
          <h2 className="font-semibold mb-3">أكثر القوالب استخداماً (Top 10)</h2>
          {topTemplates.length === 0 ? (
            <p className="text-sm text-zinc-400">لا توجد بيانات.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-zinc-300">
                  <tr className="border-b border-white/10">
                    <th className="p-2 text-right">Slug</th>
                    <th className="p-2 text-right">العنوان</th>
                    <th className="p-2 text-right">اللغة</th>
                    <th className="p-2 text-right">العدد</th>
                  </tr>
                </thead>
                <tbody>
                  {topTemplates.map((r, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0">
                      <td className="p-2">{r.slug ?? "-"}</td>
                      <td className="p-2">{r.title ?? "-"}</td>
                      <td className="p-2">{r.language ?? "-"}</td>
                      <td className="p-2">{r.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </section>
    </div>
  );
}

function KpiCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
      <div className="text-xs text-zinc-400">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}
