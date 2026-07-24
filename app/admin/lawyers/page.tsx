 // app/admin/lawyers/page.tsx
import AdminSidebar from "@/components/admin/AdminSidebar";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Scale, CheckCircle2, Clock, UserCheck } from "lucide-react";
import AccountActions from "@/components/admin/AccountActions";
import AddAccountForm from "@/components/admin/AddAccountForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fmtDate(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("ar-IQ", { dateStyle: "medium" }).format(d);
}

export default async function AdminLawyersPage() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/unauthorized");

  const lawyers = await prisma.user.findMany({
    where: { role: "LAWYER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      password: true, // حالة التفعيل فقط (لا يُعرض)
      isApproved: true,
      createdAt: true,
      lawyerProfile: {
        select: { specialties: true, city: true, pendingBio: true, pendingAvatarPath: true },
      },
    },
  });

  const approved = lawyers.filter((l) => l.isApproved).length;
  const pending = lawyers.length - approved;
  const pendingEdits = lawyers.filter(
    (l) => l.lawyerProfile?.pendingBio || l.lawyerProfile?.pendingAvatarPath
  ).length;

  return (
    <div className="flex gap-0">
      <AdminSidebar />

      <section className="flex-1 p-6 space-y-6">
        <header className="border-b border-white/10 pb-4 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-400" /> المحامون
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              المحامون المعتمدون — إضافة يدوية، اعتماد، مراسلة، وحذف الحساب.
            </p>
          </div>
          {pendingEdits > 0 && (
            <Link
              href="/admin/lawyer-approvals"
              className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 px-3 py-2 text-xs"
            >
              <UserCheck className="w-3.5 h-3.5" /> {pendingEdits} تعديل ملف بانتظار المراجعة
            </Link>
          )}
        </header>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-3">
          <KpiCard title="إجمالي المحامين" value={lawyers.length} />
          <KpiCard title="معتمدون" value={approved} accent="emerald" />
          <KpiCard title="بانتظار الاعتماد" value={pending} accent="amber" />
        </div>

        {/* إضافة يدوية */}
        <AddAccountForm role="LAWYER" title="إضافة محامٍ يدوياً" />

        {/* القائمة */}
        {lawyers.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-4 py-12 text-center text-sm text-zinc-400">
            لا يوجد محامون مسجّلون بعد.
          </div>
        ) : (
          <div className="space-y-3">
            {lawyers.map((l) => (
              <div
                key={l.id}
                className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white">
                        {l.name || `محامٍ #${l.id}`}
                      </span>
                      <span className="text-xs text-zinc-500">#{l.id}</span>
                      {l.isApproved ? (
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
                      {l.email && <span>✉️ {l.email}</span>}
                      {l.phone && <span>📞 {l.phone}</span>}
                      {l.lawyerProfile?.city && <span>📍 {l.lawyerProfile.city}</span>}
                      {l.lawyerProfile?.specialties && (
                        <span>⚖️ {l.lawyerProfile.specialties}</span>
                      )}
                      <span>سُجّل: {fmtDate(l.createdAt)}</span>
                    </div>
                  </div>

                  <AccountActions
                    userId={l.id}
                    email={l.email}
                    name={l.name || `محامٍ #${l.id}`}
                    isApproved={l.isApproved}
                    kind="lawyer"
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
