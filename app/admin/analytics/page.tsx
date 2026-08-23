// app/admin/analytics/page.tsx
// لوحة "مصادر الزوّار" — للأدمن فقط. تقرأ زيارات AuditLog (PAGE_VISIT)
// وتعرض توزّع القنوات + أهم المُحيلين + أهم صفحات الوصول + منحنى يومي.
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";
import GrowthSparkline from "@/components/admin/GrowthSparkline";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { BarChart3, Globe, FileText, Clock } from "lucide-react";
import {
  CHANNEL_LABELS,
  CHANNEL_COLORS,
  type Channel,
} from "@/lib/analytics/channel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VisitMeta = {
  channel?: Channel;
  referrerHost?: string | null;
  landing?: string | null;
};

const PERIODS = [
  { days: 7, label: "٧ أيام" },
  { days: 30, label: "٣٠ يوماً" },
  { days: 90, label: "٣ أشهر" },
];

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");

  const sp = await searchParams;
  const days = [7, 30, 90].includes(Number(sp?.days)) ? Number(sp.days) : 90;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // كل زيارات الفترة (createdAt + meta)
  const rows = await prisma.auditLog.findMany({
    where: { action: "PAGE_VISIT", createdAt: { gte: since } },
    select: { createdAt: true, meta: true },
    orderBy: { createdAt: "asc" },
  });

  const total = rows.length;

  // ── تجميع القنوات / المُحيلين / صفحات الوصول ─────────────
  const channelCount = new Map<string, number>();
  const referrerCount = new Map<string, number>();
  const landingCount = new Map<string, number>();

  for (const r of rows) {
    const m = (r.meta || {}) as VisitMeta;
    const ch = (m.channel || "direct") as string;
    channelCount.set(ch, (channelCount.get(ch) || 0) + 1);
    if (m.referrerHost) {
      referrerCount.set(m.referrerHost, (referrerCount.get(m.referrerHost) || 0) + 1);
    }
    if (m.landing) {
      landingCount.set(m.landing, (landingCount.get(m.landing) || 0) + 1);
    }
  }

  const channels = [...channelCount.entries()]
    .map(([channel, count]) => ({ channel: channel as Channel, count }))
    .sort((a, b) => b.count - a.count);

  const topReferrers = [...referrerCount.entries()]
    .map(([host, count]) => ({ host, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const topLandings = [...landingCount.entries()]
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // ── منحنى يومي ──────────────────────────────────────────
  const daily: number[] = [];
  const buckets = Math.min(days, 30); // حتى ٣٠ نقطة كحدّ أقصى للوضوح
  const bucketMs = (days * 24 * 60 * 60 * 1000) / buckets;
  for (let i = 0; i < buckets; i++) {
    const start = since.getTime() + i * bucketMs;
    const end = start + bucketMs;
    daily.push(
      rows.filter((r) => {
        const t = r.createdAt.getTime();
        return t >= start && t < end;
      }).length
    );
  }

  const activePeriod = days;

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50" dir="rtl">
      <AdminSidebar />

      <section className="flex-1 p-6 space-y-5 overflow-auto">
        {/* الهيدر */}
        <header className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              مصادر الزوّار
            </h1>
            <p className="text-sm text-zinc-400 mt-0.5">
              من أين يدخل الزوّار فعلياً — تتبّع أوّل-طرفي يستبعد البوتات ويَعُدّ الجلسات
            </p>
          </div>
          {/* مبدّل الفترة */}
          <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1">
            {PERIODS.map((p) => (
              <Link
                key={p.days}
                href={`/admin/analytics?days=${p.days}`}
                className={`text-xs px-3 py-1.5 rounded-lg transition ${
                  activePeriod === p.days
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {p.label}
              </Link>
            ))}
          </div>
        </header>

        {/* إجمالي الزيارات */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-zinc-400">إجمالي الزيارات (جلسات)</span>
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Clock className="w-3.5 h-3.5" /> آخر {activePeriod} يوماً
            </span>
          </div>
          <div className="text-4xl font-bold text-white leading-none mb-4">
            {total.toLocaleString("ar-IQ")}
          </div>
          <GrowthSparkline data={daily} />
        </div>

        {total === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center text-sm text-zinc-400">
            لا توجد زيارات مسجّلة بعد في هذه الفترة.
            <br />
            <span className="text-zinc-500">
              يبدأ التسجيل تلقائياً بعد نشر هذا التحديث ودخول أول زائر للموقع العام.
            </span>
          </div>
        ) : (
          <>
            {/* توزّع القنوات */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
              <h2 className="text-sm font-semibold text-zinc-200 mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                توزّع مصادر الدخول
              </h2>
              <div className="space-y-3">
                {channels.map(({ channel, count }) => {
                  const pct = Math.round((count / total) * 100);
                  const color = CHANNEL_COLORS[channel] || "bg-zinc-400";
                  const label = CHANNEL_LABELS[channel] || channel;
                  return (
                    <div key={channel}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-300">{label}</span>
                        <span className="text-zinc-400 tabular-nums">
                          {count.toLocaleString("ar-IQ")} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full`}
                          style={{ width: `${Math.max(pct, 2)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* أهم المُحيلين + أهم صفحات الوصول */}
            <div className="grid lg:grid-cols-2 gap-3">
              {/* المُحيلون */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-800">
                  <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-sky-400" />
                    أهم المواقع المُحيلة
                  </h2>
                </div>
                <div className="divide-y divide-zinc-800">
                  {topReferrers.length === 0 && (
                    <div className="px-4 py-4 text-xs text-zinc-500">
                      لا توجد إحالات خارجية — الدخول مباشر أو من محرّكات البحث.
                    </div>
                  )}
                  {topReferrers.map((r) => (
                    <div key={r.host} className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-sm text-zinc-300 truncate">{r.host}</span>
                      <span className="text-xs text-zinc-400 tabular-nums">
                        {r.count.toLocaleString("ar-IQ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* صفحات الوصول */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-800">
                  <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    أكثر صفحات الوصول (Landing)
                  </h2>
                </div>
                <div className="divide-y divide-zinc-800">
                  {topLandings.map((l) => (
                    <div key={l.path} className="flex items-center justify-between px-4 py-2.5 gap-2">
                      <span className="text-sm text-zinc-300 truncate" dir="ltr">
                        {l.path}
                      </span>
                      <span className="text-xs text-zinc-400 tabular-nums flex-shrink-0">
                        {l.count.toLocaleString("ar-IQ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-600 leading-relaxed">
              ملاحظة: هذه الأرقام تُحسب من نشر هذا التحديث فصاعداً (لا بيانات تاريخية سابقة).
              للمزيد من التفصيل — الزوّار الفريدون والدول والأجهزة — راجع تبويب Analytics في لوحة Vercel.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
