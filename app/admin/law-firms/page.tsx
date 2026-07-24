 // app/admin/law-firms/page.tsx
import AdminSidebar from "@/components/admin/AdminSidebar";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Building, CheckCircle2, Clock } from "lucide-react";
import AccountActions from "@/components/admin/AccountActions";
import AddAccountForm from "@/components/admin/AddAccountForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fmtDate(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("ar-IQ", { dateStyle: "medium" }).format(d);
}

export default async function AdminLawFirmsPage() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/unauthorized");

  // مكاتب المحاماة = مستخدمون بدور LAW_FIRM
  const firms = await prisma.user.findMany({
    where: { role: "LAW_FIRM" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      location: true,
      password: true, // حالة التفعيل فقط (لا يُعرض)
      isApproved: true,
      createdAt: true,
      branch: {
        select: {
          city: true,
          org: {
            select: {
              name: true,
              isApproved: true,
              website: true,
              _count: { select: { branches: true, members: true, cases: true } },
            },
          },
        },
      },
    },
  });

  const approved = firms.filter((f) => f.isApproved).length;
  const pending = firms.length - approved;

  return (
    <div className="flex gap-0">
      <AdminSidebar />

      <section className="flex-1 p-6 space-y-6">
        <header className="border-b border-white/10 pb-4">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Building className="w-5 h-5 text-purple-400" /> مكاتب المحاماة
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            مكاتب المحاماة المسجّلة — إضافة يدوية، اعتماد، مراسلة، وحذف الحساب.
          </p>
        </header>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-3">
          <KpiCard title="إجمالي المكاتب" value={firms.length} />
          <KpiCard title="معتمدة" value={approved} accent="emerald" />
          <KpiCard title="بانتظار الاعتماد" value={pending} accent="amber" />
        </div>

        {/* إضافة يدوية */}
        <AddAccountForm role="LAW_FIRM" title="إضافة مكتب محاماة يدوياً" />

        {/* القائمة */}
        {firms.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-4 py-12 text-center text-sm text-zinc-400">
            لا توجد مكاتب محاماة مسجّلة بعد.
          </div>
        ) : (
          <div className="space-y-3">
            {firms.map((f) => (
              <div
                key={f.id}
                className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white">
                        {f.branch?.org?.name || f.name || `مكتب #${f.id}`}
                      </span>
                      <span className="text-xs text-zinc-500">#{f.id}</span>
                      {f.isApproved ? (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> معتمد
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> بانتظار الاعتماد
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-400 flex flex-wrap gap-x-4 gap-y-1">
                      {f.email && <span>✉️ {f.email}</span>}
                      {f.phone && <span>📞 {f.phone}</span>}
                      {(f.branch?.city || f.location) && (
                        <span>📍 {f.branch?.city || f.location}</span>
                      )}
                      {f.branch?.org?.website && (
                        <span className="ltr text-left">🌐 {f.branch.org.website}</span>
                      )}
                      <span>سُجّل: {fmtDate(f.createdAt)}</span>
                    </div>
                    {f.branch?.org && (
                      <div className="flex gap-4 mt-2 text-xs text-zinc-500">
                        <span>فروع: {f.branch.org._count.branches}</span>
                        <span>أعضاء: {f.branch.org._count.members}</span>
                        <span>قضايا: {f.branch.org._count.cases}</span>
                      </div>
                    )}
                  </div>

                  <AccountActions
                    userId={f.id}
                    email={f.email}
                    name={f.branch?.org?.name || f.name || `مكتب #${f.id}`}
                    isApproved={f.isApproved}
                    kind="lawFirm"
                  />
                </div>
              </div>
            ))}
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
