 // app/admin/translation-offices/page.tsx
import AdminSidebar from "@/components/admin/AdminSidebar";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Languages, Plus, CheckCircle2, Clock, BarChart3 } from "lucide-react";
import ResendInviteButton from "./ResendInviteButton";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fmtDate(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("ar-IQ", { dateStyle: "medium" }).format(d);
}

export default async function AdminTranslationOfficesPage() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/unauthorized");

  // مكاتب الترجمة = مستخدمون بدور TRANSLATION_OFFICE
  const offices = await prisma.user.findMany({
    where: { role: "TRANSLATION_OFFICE" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      location: true,
      password: true, // نستعمله فقط لتحديد هل فُعّل الحساب (لا يُعرض)
      isApproved: true,
      createdAt: true,
      _count: { select: { OfficeTranslationRequests: true } },
    },
  });

  const activated = offices.filter((o) => o.password).length;
  const pending = offices.length - activated;

  return (
    <div className="flex gap-0">
      <AdminSidebar />

      <section className="flex-1 p-6 space-y-6">
        <header className="border-b border-white/10 pb-4 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Languages className="w-5 h-5 text-amber-400" /> مكاتب الترجمة
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              المكاتب المعتمدة على المنصّة وحالة تفعيل حساباتها وطلبات الترجمة
              الموجّهة إليها.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/translation-stats"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 text-zinc-300 hover:bg-zinc-800 px-3 py-2 text-xs"
            >
              <BarChart3 className="w-3.5 h-3.5" /> الإحصاءات
            </Link>
            <Link
              href="/admin/translation-offices/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 text-xs font-medium"
            >
              <Plus className="w-3.5 h-3.5" /> إضافة مكتب
            </Link>
          </div>
        </header>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-3">
          <KpiCard title="إجمالي المكاتب" value={offices.length} />
          <KpiCard title="حسابات مفعّلة" value={activated} accent="emerald" />
          <KpiCard title="بانتظار التفعيل" value={pending} accent="amber" />
        </div>

        {/* القائمة */}
        {offices.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-4 py-12 text-center text-sm text-zinc-400">
            لا توجد مكاتب ترجمة مسجّلة بعد.{" "}
            <Link href="/admin/translation-offices/new" className="text-emerald-400 hover:underline">
              أضف أول مكتب
            </Link>
            .
          </div>
        ) : (
          <div className="space-y-3">
            {offices.map((o) => {
              const isActivated = !!o.password;
              return (
                <div
                  key={o.id}
                  className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          {o.name || `مكتب #${o.id}`}
                        </span>
                        <span className="text-xs text-zinc-500">#{o.id}</span>
                        {isActivated ? (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> مُفعّل
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" /> بانتظار التفعيل
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-400 flex flex-wrap gap-x-4 gap-y-1">
                        {o.email && <span>✉️ {o.email}</span>}
                        {o.phone && <span>📞 {o.phone}</span>}
                        {o.location && <span>📍 {o.location}</span>}
                        <span>سُجّل: {fmtDate(o.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">
                          {o._count.OfficeTranslationRequests}
                        </div>
                        <div className="text-[10px] text-zinc-500">طلبات ترجمة</div>
                      </div>
                      {!isActivated && o.email && (
                        <ResendInviteButton email={o.email} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function KpiCard({
  title,
  value,
  accent = "default",
}: {
  title: string;
  value: number;
  accent?: "default" | "emerald" | "amber";
}) {
  const color =
    accent === "emerald"
      ? "text-emerald-400"
      : accent === "amber"
      ? "text-amber-400"
      : "text-white";
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
      <div className="text-xs text-zinc-400">{title}</div>
      <div className={`text-2xl font-bold mt-2 ${color}`}>{value}</div>
    </div>
  );
}
