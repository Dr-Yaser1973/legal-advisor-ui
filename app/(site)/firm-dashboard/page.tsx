 // app/(site)/firm-dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import FirmRequestCard from "./FirmRequestCard";
import Link from "next/link";
import EmployeeManager from "@/components/EmployeeManager";
import MyAssignments from "@/components/MyAssignments";

export const dynamic = "force-dynamic";

function statusLabel(status: string) {
  switch (status) {
    case "PENDING":     return "بانتظار ردّنا";
    case "OFFER_SENT":  return "تم إرسال العرض";
    case "ACCEPTED":    return "قبل العميل العرض";
    case "IN_PROGRESS": return "قيد التنفيذ";
    case "COMPLETED":   return "منجزة";
    case "CANCELED":    return "ملغاة";
    default:            return status;
  }
}

function statusColor(status: string) {
  switch (status) {
    case "PENDING":     return "text-amber-300 border-amber-500/40 bg-amber-500/10";
    case "OFFER_SENT":  return "text-blue-300 border-blue-500/40 bg-blue-500/10";
    case "ACCEPTED":    return "text-emerald-300 border-emerald-500/40 bg-emerald-500/10";
    case "IN_PROGRESS": return "text-sky-300 border-sky-500/40 bg-sky-500/10";
    case "COMPLETED":   return "text-zinc-300 border-zinc-500/40 bg-zinc-500/10";
    case "CANCELED":    return "text-red-300 border-red-500/40 bg-red-500/10";
    default:            return "text-zinc-300 border-zinc-600 bg-zinc-700/40";
  }
}

const QUICK_LINKS = [
  { href: "/consultations", emoji: "⚖️", label: "الاستشارات" },
  { href: "/contracts",     emoji: "📄", label: "العقود" },
  { href: "/cases",         emoji: "📁", label: "القضايا" },
  { href: "/library",       emoji: "📚", label: "المكتبة" },
];

export default async function FirmDashboardPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  const user = session?.user as any;
  if (!user || !user.email) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: {
      id: true,
      role: true,
      isApproved: true,
      isManager: true,
      branchId: true,
      branch: {
        include: {
          org: {
            select: {
              id: true, name: true, type: true,
              email: true, phone: true, website: true,
            },
          },
        },
      },
    },
  });

  if (!dbUser) redirect("/login");
  if (!dbUser.branchId || !dbUser.branch) redirect("/dashboard");

  const org = dbUser.branch.org;

  // ── الموظف (غير مدير): يرى مهامه + الخدمات فقط ──
  if (!dbUser.isManager) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white" dir="rtl">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          <div>
            <h1 className="text-2xl font-bold">{org.name}</h1>
            <p className="text-sm text-zinc-400 mt-1">لوحة الموظف — متابعة مهامك</p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {QUICK_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center hover:border-amber-500/40 transition">
                <div className="text-lg mb-1">{l.emoji}</div>
                <div className="text-xs text-zinc-300">{l.label}</div>
              </Link>
            ))}
          </div>

          <MyAssignments />
        </div>
      </main>
    );
  }

  // ── المدير: كل الطلبات + إدارة الموظفين ──
  const orgId = dbUser.branch.orgId;
  const branchId = dbUser.branchId;

  const [pending, offered, active, completed] = await Promise.all([
    prisma.firmConsultRequest.findMany({
      where: { orgId, branchId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: {
        client: { select: { id: true, name: true, email: true, phone: true } },
        documents: {
          include: {
            document: { select: { id: true, title: true, filePath: true, mimetype: true } },
          },
        },
      },
    }),
    prisma.firmConsultRequest.findMany({
      where: { orgId, branchId, status: "OFFER_SENT" },
      orderBy: { createdAt: "desc" },
      include: {
        client: { select: { id: true, name: true, email: true } },
        offer: true,
      },
    }),
    prisma.firmConsultRequest.findMany({
      where: { orgId, branchId, status: { in: ["ACCEPTED", "IN_PROGRESS"] } },
      orderBy: { createdAt: "desc" },
      include: {
        client: { select: { id: true, name: true, email: true } },
        offer: true,
        chatRoom: { select: { id: true } },
      },
    }),
    prisma.firmConsultRequest.findMany({
      where: { orgId, branchId, status: "COMPLETED" },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        client: { select: { id: true, name: true, email: true } },
        offer: true,
      },
    }),
  ]);

  const totalEarnings = completed.reduce((sum, r) => sum + (r.offer?.fee ?? 0), 0);
  const earningsCurrency = completed[0]?.offer?.currency || "USD";

  return (
    <main className="min-h-screen bg-zinc-950 text-white" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* الهيدر */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                ✓ مكتب معتمد
              </span>
            </div>
            <h1 className="text-2xl font-bold">{org.name}</h1>
            <p className="text-sm text-zinc-400 mt-1">
              {dbUser.branch.name} — {dbUser.branch.city}
            </p>
            <div className="flex flex-wrap gap-2 mt-2 text-xs text-zinc-500">
              {org.email && <span>✉️ {org.email}</span>}
              {org.phone && <span>📞 {org.phone}</span>}
              {org.website && (
                <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
                  🌐 {org.website}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* الإحصاءات */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "جديد",       value: pending.length,   color: "text-amber-400",  border: "border-amber-500/20",  bg: "bg-amber-500/5" },
            { label: "عرض مُرسل",  value: offered.length,   color: "text-blue-400",   border: "border-blue-500/20",   bg: "bg-blue-500/5" },
            { label: "نشط",        value: active.length,    color: "text-emerald-400",border: "border-emerald-500/20",bg: "bg-emerald-500/5" },
            { label: "منجز",       value: completed.length, color: "text-zinc-300",   border: "border-zinc-700",      bg: "bg-zinc-900/60" },
            { label: "الأرباح",    value: totalEarnings.toLocaleString(), color: "text-emerald-300", border: "border-emerald-500/20", bg: "bg-emerald-500/5", sub: earningsCurrency },
          ].map((s, i) => (
            <div key={i} className={`rounded-xl border ${s.border} ${s.bg} p-3 text-center`}>
              <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">{s.label}</div>
              {s.sub && <div className="text-[9px] text-zinc-500">{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* الروابط السريعة */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {QUICK_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center hover:border-amber-500/40 transition">
              <div className="text-lg mb-1">{l.emoji}</div>
              <div className="text-xs text-zinc-300">{l.label}</div>
            </Link>
          ))}
        </div>

        {/* إدارة الموظفين */}
        <EmployeeManager currentEmail={user.email} />

        {/* الطلبات الجديدة */}
        <section>
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse"></span>
            الطلبات الجديدة الواردة
            {pending.length > 0 && (
              <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">{pending.length}</span>
            )}
          </h2>
          {pending.length === 0 ? (
            <p className="text-sm text-zinc-500">لا توجد طلبات جديدة حالياً.</p>
          ) : (
            <div className="space-y-4">
              {pending.map((req) => (
                <FirmRequestCard
                  key={req.id}
                  requestId={req.id}
                  subject={req.subject}
                  details={req.details}
                  status={req.status}
                  statusLabel={statusLabel(req.status)}
                  statusColor={statusColor(req.status)}
                  createdAt={req.createdAt.toISOString()}
                  client={req.client}
                  documents={req.documents.map((d) => ({
                    id: d.document.id,
                    title: d.document.title,
                    filePath: d.document.filePath,
                    mimetype: d.document.mimetype,
                  }))}
                  showOfferForm
                />
              ))}
            </div>
          )}
        </section>

        {/* العروض المُرسلة */}
        <section>
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
            العروض المُرسلة — بانتظار رد العميل
          </h2>
          {offered.length === 0 ? (
            <p className="text-sm text-zinc-500">لا توجد عروض مُرسلة حالياً.</p>
          ) : (
            <div className="space-y-3">
              {offered.map((req) => (
                <div key={req.id} className="border border-blue-500/20 rounded-xl bg-zinc-900/50 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-3 py-0.5 rounded-full border ${statusColor(req.status)}`}>{statusLabel(req.status)}</span>
                    <span className="text-xs text-zinc-500">#{req.id}</span>
                  </div>
                  <div className="text-sm font-semibold">{req.subject}</div>
                  <div className="text-xs text-zinc-400">العميل: {req.client?.name || req.client?.email}</div>
                  {req.offer && (
                    <div className="text-xs text-blue-300 border border-blue-500/20 bg-blue-500/5 rounded-lg p-2">
                      العرض: <span className="font-bold">{req.offer.fee} {req.offer.currency}</span>
                      {req.offer.note && <span className="text-zinc-400"> — {req.offer.note}</span>}
                    </div>
                  )}
                  <div className="text-xs text-zinc-500">{new Date(req.createdAt).toLocaleString("ar-IQ")}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* النشطة */}
        <section>
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            الطلبات النشطة
          </h2>
          {active.length === 0 ? (
            <p className="text-sm text-zinc-500">لا توجد طلبات نشطة حالياً.</p>
          ) : (
            <div className="space-y-3">
              {active.map((req) => (
                <div key={req.id} className="border border-emerald-500/20 rounded-xl bg-zinc-900/50 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-3 py-0.5 rounded-full border ${statusColor(req.status)}`}>{statusLabel(req.status)}</span>
                    <span className="text-xs text-zinc-500">#{req.id}</span>
                  </div>
                  <div className="text-sm font-semibold">{req.subject}</div>
                  <div className="text-xs text-zinc-400">العميل: {req.client?.name || req.client?.email}</div>
                  {req.offer && (
                    <div className="text-xs text-zinc-300">
                      الأتعاب: <span className="font-bold text-emerald-300">{req.offer.fee} {req.offer.currency}</span>
                    </div>
                  )}
                  {req.chatRoom && (
                    <a href={`/firm-chat/${req.chatRoom.id}`} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition">
                      فتح المحادثة ←
                    </a>
                  )}
                  <div className="text-xs text-zinc-500">{new Date(req.createdAt).toLocaleString("ar-IQ")}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* المكتملة */}
        <section>
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-400 inline-block"></span>
            الطلبات المكتملة
          </h2>
          {completed.length === 0 ? (
            <p className="text-sm text-zinc-500">لا توجد طلبات مكتملة بعد.</p>
          ) : (
            <div className="space-y-3">
              {completed.map((req) => (
                <div key={req.id} className="border border-white/10 rounded-xl bg-zinc-900/40 p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-3 py-0.5 rounded-full border ${statusColor(req.status)}`}>{statusLabel(req.status)}</span>
                    <span className="text-xs text-zinc-500">#{req.id}</span>
                  </div>
                  <div className="text-sm font-semibold">{req.subject}</div>
                  <div className="text-xs text-zinc-400">العميل: {req.client?.name || req.client?.email}</div>
                  {req.offer && <div className="text-xs text-zinc-400">الأتعاب: {req.offer.fee} {req.offer.currency}</div>}
                  <div className="text-xs text-zinc-500">{new Date(req.createdAt).toLocaleString("ar-IQ")}</div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}