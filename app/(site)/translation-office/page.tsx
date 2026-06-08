 // app/(site)/translation-office/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import OfficeInProgressCard, {
  OfficeInProgressItem,
} from "./OfficeInProgressCard";

export const dynamic = "force-dynamic";

function statusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "بانتظار قبول مكتب الترجمة";
    case "ACCEPTED":
      return "تم القبول – بانتظار البدء";
    case "IN_PROGRESS":
      return "قيد الترجمة";
    case "COMPLETED":
      return "منجزة";
    case "CANCELED":
      return "ملغاة";
    default:
      return status;
  }
}

/* أيقونات SVG صغيرة */
function IconFile() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}
function IconFileCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default async function TranslationOfficeDashboardPage() {
  // ===============================
  // 1️⃣ الجلسة
  // ===============================
  const session = (await getServerSession(authOptions as any)) as any;
  const user = session?.user as any;

  if (!user || !user.email) redirect("/login");

  if (user.role !== "TRANSLATION_OFFICE" || !user.isApproved) {
    redirect("/dashboard");
  }

  // ===============================
  // 2️⃣ officeId الحقيقي من DB
  // ===============================
  const dbOffice = await prisma.user.findUnique({
    where: { email: user.email },
    select: { id: true },
  });

  if (!dbOffice) redirect("/login");

  const officeId = dbOffice.id;

  // ===============================
  // 3️⃣ الطلبات المقبولة + الجارية
  // ===============================
  const active = await prisma.translationRequest.findMany({
    where: {
      officeId,
      status: { in: ["ACCEPTED", "IN_PROGRESS"] },
    },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { id: true, name: true, email: true } },
      sourceDoc: { select: { id: true, title: true, filename: true } },
    },
  });

  // ===============================
  // 4️⃣ الطلبات المكتملة
  // ===============================
  const completed = await prisma.translationRequest.findMany({
    where: {
      officeId,
      status: "COMPLETED",
    },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { id: true, name: true, email: true } },
      sourceDoc: { select: { id: true, title: true, filename: true } },
    },
  });

  // ===============================
  // 5️⃣ عدّ الطلبات الجديدة (PENDING)
  // ===============================
  const pendingCount = await prisma.translationRequest.count({
    where: { officeId, status: "PENDING" },
  });

  // ===============================
  // 6️⃣ تقسيم الحالات
  // ===============================
  const acceptedOnly = active.filter((r) => r.status === "ACCEPTED");

  const inProgressItems: OfficeInProgressItem[] = active
    .filter((r) => r.status === "IN_PROGRESS")
    .map((r) => ({
      id: r.id,
      targetLang: r.targetLang as "AR" | "EN",
      sourceDoc: {
        id: r.sourceDoc!.id,
        title: r.sourceDoc!.title,
        filename: r.sourceDoc!.filename,
      },
      client: {
        id: r.client!.id,
        name: r.client!.name,
        email: r.client!.email,
      },
      price: r.price,
      currency: r.currency ?? undefined,
      note: r.note ?? undefined,
    }));

  // ===============================
  // 7️⃣ أرقام الإحصائيات
  // ===============================
  const stats = [
    { label: "طلبات جديدة", value: pendingCount, color: "text-amber-300" },
    { label: "بانتظار البدء", value: acceptedOnly.length, color: "text-amber-300" },
    { label: "قيد الترجمة", value: inProgressItems.length, color: "text-purple-300" },
    { label: "منجزة", value: completed.length, color: "text-emerald-300" },
  ];

  // ===============================
  // 8️⃣ العرض
  // ===============================
  return (
    <main className="min-h-screen bg-[#0a0a12] text-white">
      <div className="max-w-5xl mx-auto px-4 py-10 text-right space-y-8">
        {/* الترويسة */}
        <div className="relative overflow-hidden rounded-3xl border border-purple-500/25 bg-gradient-to-bl from-[#1e1133] via-[#15101f] to-[#120e1a] p-8">
          <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute -right-8 -bottom-12 h-36 w-36 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-l from-white to-purple-200 bg-clip-text text-transparent">
                لوحة مكتب الترجمة
              </h1>
              <p className="text-sm text-purple-200/90 mt-2">
                متابعة طلبات الترجمة الرسمية المقبولة والجارية.
              </p>
            </div>
            
              href="/translation-office/requests"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-sm font-medium transition"
            ;
              عرض الطلبات الجديدة
              <span>←</span>
          

          </div>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-purple-500/20 bg-[#1e1133]/40 p-4"
            >
              <div className="text-xs text-purple-300 mb-1.5">{s.label}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* المقبولة */}
        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <span className="inline-block h-5 w-1 rounded bg-amber-400" />
            الطلبات المقبولة – بانتظار البدء
          </h2>

          {acceptedOnly.length === 0 ? (
            <p className="text-sm text-purple-200/60">لا توجد طلبات مقبولة حاليًا.</p>
          ) : (
            <div className="space-y-3">
              {acceptedOnly.map((r) => (
                <div
                  key={r.id}
                  className="border border-purple-500/20 rounded-xl bg-[#1e1133]/35 p-4 transition hover:border-amber-400/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm text-white flex items-center gap-2">
                        <span className="text-purple-300">
                          <IconFile />
                        </span>
                        {r.sourceDoc?.title || r.sourceDoc?.filename}
                      </div>
                      <div className="text-xs text-purple-200/80 mt-2 flex items-center gap-1.5">
                        <IconUser />
                        {r.client?.name || r.client?.email}
                      </div>
                    </div>
                    <span className="whitespace-nowrap text-[11px] text-amber-300 bg-amber-400/12 px-2.5 py-1 rounded-full">
                      {statusLabel(r.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* الجارية */}
        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <span className="inline-block h-5 w-1 rounded bg-purple-400" />
            الطلبات الجارية
          </h2>

          {inProgressItems.length === 0 ? (
            <p className="text-sm text-purple-200/60">لا توجد طلبات قيد الترجمة حاليًا.</p>
          ) : (
            <div className="space-y-3">
              {inProgressItems.map((item) => (
                <OfficeInProgressCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* المكتملة */}
        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <span className="inline-block h-5 w-1 rounded bg-emerald-400" />
            الطلبات المكتملة
          </h2>

          {completed.length === 0 ? (
            <p className="text-sm text-purple-200/60">لا توجد طلبات مكتملة بعد.</p>
          ) : (
            <div className="space-y-3">
              {completed.map((r) => (
                <div
                  key={r.id}
                  className="border border-white/8 rounded-xl bg-[#1e1133]/25 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm text-zinc-200 flex items-center gap-2">
                        <span className="text-emerald-400">
                          <IconFileCheck />
                        </span>
                        {r.sourceDoc?.title || r.sourceDoc?.filename}
                      </div>
                      <div className="text-xs text-zinc-400 mt-2 flex items-center gap-1.5">
                        <IconUser />
                        {r.client?.name || r.client?.email}
                      </div>
                    </div>
                    <span className="whitespace-nowrap text-[11px] text-emerald-300 bg-emerald-500/12 px-2.5 py-1 rounded-full">
                      {statusLabel(r.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}