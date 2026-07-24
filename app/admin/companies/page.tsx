 // app/admin/companies/page.tsx
import AdminSidebar from "@/components/admin/AdminSidebar";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Building2, Users, MapPin, CheckCircle2, Clock } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fmtDate(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("ar-IQ", { dateStyle: "medium" }).format(d);
}

export default async function AdminCompaniesPage() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/unauthorized");

  // الشركات = المؤسسات من نوع COMPANY
  const companies = await prisma.organization.findMany({
    where: { type: "COMPANY" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      website: true,
      description: true,
      isApproved: true,
      isActive: true,
      subscriptionEndsAt: true,
      createdAt: true,
      _count: { select: { branches: true, members: true, cases: true } },
      branches: {
        select: { id: true, name: true, city: true, _count: { select: { users: true } } },
      },
    },
  });

  const approved = companies.filter((c) => c.isApproved).length;
  const pending = companies.length - approved;

  return (
    <div className="flex gap-0">
      <AdminSidebar />

      <section className="flex-1 p-6 space-y-6">
        <header className="border-b border-white/10 pb-4">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-400" /> الشركات
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            المؤسسات المسجّلة من نوع «شركة» — الاعتماد يتم من صفحة المستخدمين عند
            الموافقة على حساب الشركة.
          </p>
        </header>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-3">
          <KpiCard title="إجمالي الشركات" value={companies.length} />
          <KpiCard title="معتمدة" value={approved} accent="emerald" />
          <KpiCard title="بانتظار الاعتماد" value={pending} accent="amber" />
        </div>

        {/* القائمة */}
        {companies.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-4 py-12 text-center text-sm text-zinc-400">
            لا توجد شركات مسجّلة بعد.
          </div>
        ) : (
          <div className="space-y-3">
            {companies.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{c.name}</span>
                      <span className="text-xs text-zinc-500">#{c.id}</span>
                      {c.isApproved ? (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> معتمدة
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> بانتظار الاعتماد
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-400 flex flex-wrap gap-x-4 gap-y-1">
                      {c.email && <span>✉️ {c.email}</span>}
                      {c.phone && <span>📞 {c.phone}</span>}
                      {c.website && <span className="ltr text-left">🌐 {c.website}</span>}
                      <span>سُجّلت: {fmtDate(c.createdAt)}</span>
                    </div>
                    {c.description && (
                      <p className="text-xs text-zinc-500 mt-1">{c.description}</p>
                    )}

                    {/* الفروع */}
                    {c.branches.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {c.branches.map((b) => (
                          <span
                            key={b.id}
                            className="inline-flex items-center gap-1 text-[11px] bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full text-zinc-300"
                          >
                            <MapPin className="w-3 h-3 text-teal-400" />
                            {b.name} · {b.city} ({b._count.users})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* عدّادات */}
                  <div className="flex gap-4 text-center shrink-0">
                    <Counter label="فروع" value={c._count.branches} />
                    <Counter label="أعضاء" value={c._count.members} icon={<Users className="w-3 h-3" />} />
                    <Counter label="قضايا" value={c._count.cases} />
                  </div>
                </div>

                {!c.isApproved && (
                  <div className="mt-3 pt-3 border-t border-white/10 text-xs text-zinc-400">
                    لاعتماد هذه الشركة، وافق على حساب الشركة من{" "}
                    <Link href="/admin/users" className="text-emerald-400 hover:underline">
                      صفحة المستخدمين
                    </Link>
                    .
                  </div>
                )}
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

function Counter({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
        {icon}
        {value}
      </div>
      <div className="text-[10px] text-zinc-500">{label}</div>
    </div>
  );
}
