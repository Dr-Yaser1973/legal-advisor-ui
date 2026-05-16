// app/(site)/firm-dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import FirmRequestCard from "./FirmRequestCard";

export const dynamic = "force-dynamic";

function statusLabel(status: string) {
  switch (status) {
    case "PENDING":    return "بانتظار ردّنا";
    case "OFFER_SENT": return "تم إرسال العرض";
    case "ACCEPTED":   return "قبل العميل العرض";
    case "IN_PROGRESS":return "قيد التنفيذ";
    case "COMPLETED":  return "منجزة";
    case "CANCELED":   return "ملغاة";
    default:           return status;
  }
}

function statusColor(status: string) {
  switch (status) {
    case "PENDING":    return "text-amber-300 border-amber-500/40 bg-amber-500/10";
    case "OFFER_SENT": return "text-blue-300 border-blue-500/40 bg-blue-500/10";
    case "ACCEPTED":   return "text-emerald-300 border-emerald-500/40 bg-emerald-500/10";
    case "IN_PROGRESS":return "text-sky-300 border-sky-500/40 bg-sky-500/10";
    case "COMPLETED":  return "text-zinc-300 border-zinc-500/40 bg-zinc-500/10";
    case "CANCELED":   return "text-red-300 border-red-500/40 bg-red-500/10";
    default:           return "text-zinc-300 border-zinc-600 bg-zinc-700/40";
  }
}

export default async function FirmDashboardPage() {

  // ── الجلسة ───────────────────────────────────────────────────
  const session = (await getServerSession(authOptions as any)) as any;
  const user = session?.user as any;

  if (!user || !user.email) redirect("/login");

  // التحقق من أن المستخدم ينتمي لفرع مؤسسة
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: {
      id: true,
      role: true,
      isApproved: true,
      branchId: true,
      branch: {
        include: {
          org: { select: { id: true, name: true, type: true } },
        },
      },
    },
  });

  if (!dbUser) redirect("/login");
  if (!dbUser.branchId || !dbUser.branch) redirect("/dashboard");

  const orgId    = dbUser.branch.orgId;
  const branchId = dbUser.branchId;
  const orgName  = dbUser.branch.org.name;

  // ── الطلبات الواردة (PENDING) ────────────────────────────────
  const pending = await prisma.firmConsultRequest.findMany({
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
  });

  // ── الطلبات التي أُرسل عليها عرض (OFFER_SENT) ───────────────
  const offered = await prisma.firmConsultRequest.findMany({
    where: { orgId, branchId, status: "OFFER_SENT" },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { id: true, name: true, email: true } },
      offer: true,
    },
  });

  // ── الطلبات المقبولة والجارية ─────────────────────────────────
  const active = await prisma.firmConsultRequest.findMany({
    where: { orgId, branchId, status: { in: ["ACCEPTED", "IN_PROGRESS"] } },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { id: true, name: true, email: true } },
      offer: true,
      chatRoom: { select: { id: true } },
    },
  });

  // ── الطلبات المكتملة ──────────────────────────────────────────
  const completed = await prisma.firmConsultRequest.findMany({
    where: { orgId, branchId, status: "COMPLETED" },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      client: { select: { id: true, name: true, email: true } },
      offer: true,
    },
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-white" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-10 text-right space-y-10">

        {/* الهيدر */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">لوحة تحكم {orgName}</h1>
            <p className="text-sm text-zinc-400">
              متابعة طلبات الاستشارة الواردة وإدارة العروض والمحادثات.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="text-center bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 min-w-[80px]">
              <div className="text-xl font-bold text-amber-400">{pending.length}</div>
              <div className="text-xs text-zinc-400">جديد</div>
            </div>
            <div className="text-center bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 min-w-[80px]">
              <div className="text-xl font-bold text-blue-400">{offered.length}</div>
              <div className="text-xs text-zinc-400">عرض مُرسل</div>
            </div>
            <div className="text-center bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 min-w-[80px]">
              <div className="text-xl font-bold text-emerald-400">{active.length}</div>
              <div className="text-xs text-zinc-400">نشط</div>
            </div>
            <div className="text-center bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 min-w-[80px]">
              <div className="text-xl font-bold text-zinc-300">{completed.length}</div>
              <div className="text-xs text-zinc-400">منجز</div>
            </div>
          </div>
        </div>

        {/* ── الطلبات الجديدة الواردة ── */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
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

        {/* ── العروض المُرسلة ── */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
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
                    <span className={`text-xs px-3 py-0.5 rounded-full border ${statusColor(req.status)}`}>
                      {statusLabel(req.status)}
                    </span>
                    <span className="text-xs text-zinc-500">#{req.id}</span>
                  </div>
                  <div className="text-sm font-semibold text-white">{req.subject}</div>
                  <div className="text-xs text-zinc-400">العميل: {req.client?.name || req.client?.email}</div>
                  {req.offer && (
                    <div className="text-xs text-blue-300 border border-blue-500/20 bg-blue-500/5 rounded-lg p-2">
                      العرض المُرسل: <span className="font-bold">{req.offer.fee} {req.offer.currency}</span>
                      {req.offer.note && <span className="text-zinc-400"> — {req.offer.note}</span>}
                    </div>
                  )}
                  <div className="text-xs text-zinc-500">{new Date(req.createdAt).toLocaleString("ar-IQ")}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── الطلبات النشطة ── */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            الطلبات النشطة
          </h2>

          {active.length === 0 ? (
            <p className="text-sm text-zinc-500">لا توجد طلبات نشطة حالياً.</p>
          ) : (
            <div className="space-y-3">
              {active.map((req) => (
                <div key={req.id} className="border border-emerald-500/20 rounded-xl bg-zinc-900/50 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-3 py-0.5 rounded-full border ${statusColor(req.status)}`}>
                      {statusLabel(req.status)}
                    </span>
                    <span className="text-xs text-zinc-500">#{req.id}</span>
                  </div>
                  <div className="text-sm font-semibold text-white">{req.subject}</div>
                  <div className="text-xs text-zinc-400">العميل: {req.client?.name || req.client?.email}</div>
                  {req.offer && (
                    <div className="text-xs text-zinc-300">
                      الأتعاب المتفق عليها: <span className="font-bold text-emerald-300">{req.offer.fee} {req.offer.currency}</span>
                    </div>
                  )}
                  {req.chatRoom && (
                    <a
                      href={`/firm-chat/${req.chatRoom.id}`}
                      className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
                    >
                      فتح المحادثة ←
                    </a>
                  )}
                  <div className="text-xs text-zinc-500">{new Date(req.createdAt).toLocaleString("ar-IQ")}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── الطلبات المكتملة ── */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
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
                    <span className={`text-xs px-3 py-0.5 rounded-full border ${statusColor(req.status)}`}>
                      {statusLabel(req.status)}
                    </span>
                    <span className="text-xs text-zinc-500">#{req.id}</span>
                  </div>
                  <div className="text-sm font-semibold text-white">{req.subject}</div>
                  <div className="text-xs text-zinc-400">العميل: {req.client?.name || req.client?.email}</div>
                  {req.offer && (
                    <div className="text-xs text-zinc-400">
                      الأتعاب: {req.offer.fee} {req.offer.currency}
                    </div>
                  )}
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

