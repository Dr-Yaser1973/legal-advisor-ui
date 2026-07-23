 // app/(site)/cases/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { AddCaseEvent } from "./AddCaseEvent";
import { AttachDocument } from "./AttachDocument";
import { AnalyzeCase } from "./AnalyzeCase";
import { GenerateMemoButton } from "./GenerateMemoButton";
import { GenerateMemoText } from "./GenerateMemoText";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCaseAccess } from "@/lib/caseAccess";
import CaseAssignments from "./CaseAssignments";
import ClientPortalPanel from "./ClientPortalPanel";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatDate(value: Date | null | undefined) {
  if (!value) return "-";
  return value.toLocaleDateString("ar-IQ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatDateTime(value: Date | null | undefined) {
  if (!value) return "-";
  return value.toLocaleString("ar-IQ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusColor(status: string) {
  switch (status) {
    case "مفتوحة":
      return "bg-emerald-500/10 text-emerald-300 border-emerald-500/40";
    case "قيد المتابعة":
      return "bg-amber-500/10 text-amber-300 border-amber-500/40";
    case "محجوزة للحكم":
      return "bg-blue-500/10 text-blue-300 border-blue-500/40";
    case "مغلقة":
      return "bg-zinc-500/10 text-zinc-200 border-zinc-400/40";
    default:
      return "bg-zinc-500/10 text-zinc-200 border-zinc-400/40";
  }
}

const EVENT_TYPE_LABEL: Record<string, string> = {
  HEARING: "جلسة",
  DEADLINE: "موعد نهائي",
  MEETING: "اجتماع موكّل",
  TASK: "مهمة",
  VERDICT: "حكم",
  APPEAL: "طعن",
  OTHER: "حدث",
};

function eventTypeColor(t: string) {
  switch (t) {
    case "HEARING": return "bg-blue-500/10 text-blue-300 border-blue-500/40";
    case "DEADLINE": return "bg-red-500/10 text-red-300 border-red-500/40";
    case "MEETING": return "bg-emerald-500/10 text-emerald-300 border-emerald-500/40";
    case "VERDICT": return "bg-purple-500/10 text-purple-300 border-purple-500/40";
    case "APPEAL": return "bg-amber-500/10 text-amber-300 border-amber-500/40";
    default: return "bg-zinc-500/10 text-zinc-300 border-zinc-500/40";
  }
}

export default async function CasePage({ params }: PageProps) {
  // 🔐 أولاً: التحقق من الجلسة والدور
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  if (!user) {
    redirect("/login");
  }

  if (
    user.role !== "COMPANY" &&
    user.role !== "LAWYER" &&
    user.role !== "LAW_FIRM" &&
    user.role !== "ADMIN"
  ) {
    redirect("/unauthorized");
  }

  // ✅ فك الـ params (حسب نيكس 16)
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (Number.isNaN(id)) notFound();

  // جلب القضية أولاً (بدون فلتر ملكية)
  const caseItem = await prisma.case.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      events: {
        orderBy: { date: "desc" },
      },
      documents: {
        include: {
          document: true,
        },
      },
      client: { select: { id: true, name: true, email: true } },
      updates: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!caseItem) {
    notFound();
  }

  // 🔐 التحقق المركزي من الصلاحية حسب الدور والإسناد والفرع
  const access = await getCaseAccess(
    Number(user.id),
    user.role === "ADMIN",
    caseItem
  );

  if (access === "NONE") {
    redirect("/unauthorized");
  }

  // canWrite يحدد إظهار أزرار التعديل والإجراءات
  const canWrite = access === "WRITE";
  // هل يستطيع إدارة التكليف؟ (منشئ القضية أو المدير العام أو الأدمن)
  const meRecord = await prisma.user.findUnique({
    where: { id: Number(user.id) },
    select: { isManager: true, branch: { select: { orgId: true } } },
  });
  const ownerOrg = await prisma.user.findUnique({
    where: { id: caseItem.userId },
    select: { branch: { select: { orgId: true } } },
  });
  const canManageTeam =
    user.role === "ADMIN" ||
    caseItem.userId === Number(user.id) ||
    (!!meRecord?.isManager &&
      !!meRecord.branch?.orgId &&
      meRecord.branch.orgId === ownerOrg?.branch?.orgId);

  let aiText: string | null = null;
  if (caseItem.aiAnalysis != null) {
    if (typeof caseItem.aiAnalysis === "string") {
      aiText = caseItem.aiAnalysis;
    } else {
      aiText = JSON.stringify(caseItem.aiAnalysis, null, 2);
    }
  }

  const events = caseItem.events;
  const docs = caseItem.documents;

  // تقسيم الأحداث: قادمة (لم يحن موعدها) وسابقة
  const _now = Date.now();
  const upcomingEvents = events
    .filter((e) => new Date(e.date).getTime() >= _now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastEvents = events
    .filter((e) => new Date(e.date).getTime() < _now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const renderEvent = (ev: (typeof events)[number]) => (
    <div
      key={ev.id}
      className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3 text-xs"
    >
      <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={"inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] " + eventTypeColor(ev.type)}>
            {EVENT_TYPE_LABEL[ev.type] ?? "حدث"}
          </span>
          <span className="font-semibold">{ev.title}</span>
          {ev.notifyAt && !ev.notified && (
            <span className="text-[10px] text-amber-300" title="تذكير مجدول">🔔</span>
          )}
        </div>
        <span className="text-[11px] text-zinc-400">{formatDateTime(ev.date)}</span>
      </div>
      {ev.location && (
        <div className="text-[11px] text-zinc-400 mb-1">📍 {ev.location}</div>
      )}
      {ev.note && (
        <p className="text-[11px] text-zinc-300 whitespace-pre-wrap">{ev.note}</p>
      )}
    </div>
  );

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      {/* رجوع + عنوان */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/cases" className="text-xs text-zinc-400 hover:text-zinc-200 underline">
            ← الرجوع إلى قائمة القضايا
          </Link>
          <h1 className="text-2xl font-bold">
            {caseItem.title || `قضية رقم ${caseItem.id}`}
          </h1>
          <p className="text-sm text-zinc-400">
            رقم القضية في النظام: {caseItem.id}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={
              "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium " +
              statusColor(caseItem.status)
            }
          >
            حالة القضية: {caseItem.status}
          </span>
          <span className="text-[11px] text-zinc-400">
            نوع القضية: <span className="text-zinc-100">{caseItem.type}</span>
          </span>
          {caseItem.user && (
            <span className="text-[11px] text-zinc-400">
              مسؤول القضية:{" "}
              <span className="text-zinc-100">
                {caseItem.user.name || caseItem.user.email}
              </span>
            </span>
          )}
          {!canWrite && (
            <span className="inline-flex items-center rounded-full border border-zinc-400/40 bg-zinc-500/10 px-3 py-1 text-[11px] text-zinc-300">
              اطّلاع فقط
            </span>
          )}
        </div>
      </div>

      {/* معلومات أساسية */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded-2xl border border-white/10 bg-zinc-900/60 p-4 space-y-3">
          <h2 className="text-sm font-semibold mb-1">وصف القضية</h2>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {caseItem.description}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 space-y-2 text-sm">
          <h2 className="text-sm font-semibold mb-1">بيانات إجرائية</h2>
          <div className="space-y-1 text-zinc-300">
            <div className="flex justify-between gap-2">
              <span className="text-zinc-400">المحكمة:</span>
              <span>{caseItem.court || "-"}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-zinc-400">تاريخ تسجيل:</span>
              <span>{formatDate(caseItem.filingDate)}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-zinc-400">تاريخ الإغلاق:</span>
              <span>{formatDate(caseItem.closingDate)}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-zinc-400">أُنشئت في النظام:</span>
              <span>{formatDateTime(caseItem.createdAt)}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-zinc-400">آخر تحديث:</span>
              <span>{formatDateTime(caseItem.updatedAt)}</span>
            </div>
          </div>
          {caseItem.notes && (
            <div className="mt-3 border-t border-white/5 pt-2">
              <h3 className="text-xs font-semibold text-zinc-300 mb-1">
                ملاحظات داخلية
              </h3>
              <p className="text-xs text-zinc-400 whitespace-pre-wrap">
                {caseItem.notes}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* إجراءات على القضية — للمحررين فقط */}
      {canWrite ? (
        <section className="space-y-4">
          <h2 className="font-semibold text-sm">الإجراءات على القضية</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <AddCaseEvent caseId={caseItem.id} />
            <AttachDocument caseId={caseItem.id} />
            <AnalyzeCase caseId={caseItem.id} />
            <GenerateMemoText caseId={caseItem.id} />
          </div>
          {/* فريق القضية */}
      {canWrite && (
        <CaseAssignments caseId={caseItem.id} canManage={canManageTeam} />
      )}
        </section>
      ) : null}

      {/* بوابة متابعة الموكّل — للمحررين */}
      {canWrite && (
        <ClientPortalPanel
          caseId={caseItem.id}
          client={caseItem.client}
          updates={caseItem.updates.map((u) => ({
            id: u.id,
            title: u.title,
            content: u.content,
            createdAt: u.createdAt.toISOString(),
          }))}
        />
      )}

      {!canWrite && (
        <section>
          <p className="text-xs text-zinc-500 rounded-2xl border border-white/10 bg-zinc-900/40 p-3">
            لديك صلاحية الاطّلاع فقط على هذه القضية — لا يمكنك إجراء تعديلات.
          </p>
        </section>
      )}

      {/* التحليل بالذكاء الاصطناعي */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">تحليل الذكاء الاصطناعي</h2>
          {!aiText && (
            <span className="text-[11px] text-zinc-400">
              لم يتم بعد إجراء تحليل؛ استخدم زر "تحليل القضية" أعلاه.
            </span>
          )}
        </div>
        <div className="rounded-2xl border border-dashed border-emerald-500/30 bg-zinc-900/60 p-4 min-h-[120px]">
          {aiText ? (
            <pre className="text-xs whitespace-pre-wrap leading-relaxed text-zinc-100">
              {aiText}
            </pre>
          ) : (
            <p className="text-xs text-zinc-500">
              عند إجراء التحليل ستظهر هنا ملخصات قانونية وملاحظات تساعد في فهم
              موقف القضية واقتراح الاستراتيجية المناسبة.
            </p>
          )}
        </div>
      </section>

      {/* المواعيد القادمة */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          🗓️ المواعيد القادمة (الجلسات والمواعيد النهائية)
        </h2>
        {upcomingEvents.length === 0 ? (
          <p className="text-xs text-zinc-500">
            لا توجد مواعيد قادمة مجدولة. أضف جلسة أو موعداً نهائياً من نموذج «إضافة حدث / موعد» أعلاه ليصلك تذكير في وقته.
          </p>
        ) : (
          <div className="space-y-2">{upcomingEvents.map(renderEvent)}</div>
        )}
      </section>

      {/* سجل الأحداث السابقة */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold">سجل الأحداث السابقة</h2>
        {pastEvents.length === 0 ? (
          <p className="text-xs text-zinc-500">لا توجد أحداث سابقة.</p>
        ) : (
          <div className="space-y-2">{pastEvents.map(renderEvent)}</div>
        )}
      </section>

      {/* المستندات المرتبطة */}
      <section className="space-y-3 mb-6">
        <h2 className="text-sm font-semibold">المستندات المرتبطة بالقضية</h2>
        {docs.length === 0 ? (
          <p className="text-xs text-zinc-500">
            لم يتم ربط أي مستند بهذه القضية بعد.
          </p>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {docs.map((cd) => {
              const d: any = cd.document;
              const label =
                d?.title ||
                d?.originalName ||
                d?.fileName ||
                `مستند رقم ${cd.documentId}`;

              return (
                <div
                  key={`${cd.caseId}-${cd.documentId}`}
                  className="rounded-2xl border border-white/10 bg-zinc-900/60 p-3 text-xs flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{label}</span>
                    {d?.createdAt && (
                      <span className="text-[11px] text-zinc-400">
                        {formatDate(
                          d.createdAt instanceof Date
                            ? d.createdAt
                            : new Date(d.createdAt)
                        )}
                      </span>
                    )}
                  </div>
                  {d?.mimeType && (
                    <span className="text-[11px] text-zinc-500">
                      النوع: {d.mimeType}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}