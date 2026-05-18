 // app/(site)/lawyers/my-consults/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { HumanConsultStatus } from "@prisma/client";
import Link from "next/link";

export const dynamic = "force-dynamic";

function statusLabel(status: HumanConsultStatus) {
  switch (status) {
    case "PENDING":     return "بانتظار اختيار المستفيد";
    case "ACCEPTED":    return "تم القبول";
    case "IN_PROGRESS": return "قيد التنفيذ";
    case "COMPLETED":   return "منجزة";
    case "CANCELED":    return "ملغاة";
    default:            return status;
  }
}

function statusColor(status: HumanConsultStatus) {
  switch (status) {
    case "PENDING":     return "bg-amber-500/10 text-amber-300 border-amber-500/40";
    case "ACCEPTED":
    case "IN_PROGRESS": return "bg-emerald-500/10 text-emerald-300 border-emerald-500/40";
    case "COMPLETED":   return "bg-blue-500/10 text-blue-300 border-blue-500/40";
    case "CANCELED":    return "bg-red-500/10 text-red-300 border-red-500/40";
    default:            return "bg-zinc-700/20 text-zinc-200 border-zinc-600/40";
  }
}

export default async function LawyerDashboardPage() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  if (!user) redirect("/login");
  if (user.role !== "LAWYER" && user.role !== "ADMIN") redirect("/");

  const lawyerId = Number(user.id);

  // ── جلب بيانات المحامي ──────────────────────────────────────
  const lawyerData = await prisma.user.findUnique({
    where: { id: lawyerId },
    select: {
      name: true,
      email: true,
      plan: true,
      points: true,
      lawyerProfile: {
        select: {
          specialties: true,
          city: true,
          rating: true,
          consultFee: true,
          consultCurrency: true,
        },
      },
    },
  });

  // ── جلب الاستشارات ──────────────────────────────────────────
  const requests = await prisma.humanConsultRequest.findMany({
    where: {
      OR: [
        { lawyerId },
        { offers: { some: { lawyerId } } },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      consultation: { select: { id: true, title: true, description: true } },
      client: { select: { id: true, name: true, email: true } },
      offers: { where: { lawyerId } },
      chatRoom: true,
    },
  });

  // ── إحصاءات ─────────────────────────────────────────────────
  const stats = {
    total:      requests.length,
    pending:    requests.filter(r => r.status === "PENDING").length,
    active:     requests.filter(r => ["ACCEPTED","IN_PROGRESS"].includes(r.status)).length,
    completed:  requests.filter(r => r.status === "COMPLETED").length,
    earnings:   requests
      .filter(r => r.status === "COMPLETED")
      .reduce((sum, r) => sum + (r.offers[0]?.fee ?? 0), 0),
  };

  // ── تقسيم الطلبات ────────────────────────────────────────────
  const activeRequests    = requests.filter(r => ["ACCEPTED","IN_PROGRESS"].includes(r.status));
  const pendingRequests   = requests.filter(r => r.status === "PENDING");
  const completedRequests = requests.filter(r => r.status === "COMPLETED");

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* الهيدر */}
        <header className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">
              مرحباً، {lawyerData?.name || user.email} 👋
            </h1>
            <p className="text-sm text-zinc-400">لوحة تحكم المحامي</p>
            {lawyerData?.lawyerProfile && (
              <div className="flex flex-wrap gap-2 mt-2">
                {lawyerData.lawyerProfile.specialties && (
                  <span className="text-xs bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full text-zinc-300">
                    ⚖️ {lawyerData.lawyerProfile.specialties}
                  </span>
                )}
                {lawyerData.lawyerProfile.city && (
                  <span className="text-xs bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full text-zinc-300">
                    📍 {lawyerData.lawyerProfile.city}
                  </span>
                )}
                {lawyerData.lawyerProfile.rating && (
                  <span className="text-xs bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full text-amber-300">
                    ★ {lawyerData.lawyerProfile.rating.toFixed(1)}
                  </span>
                )}
              </div>
            )}
          </div>
          <Link
            href="/lawyers"
            className="px-4 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-sm transition"
          >
            قائمة المحامين ↗
          </Link>
        </header>

        {/* الإحصاءات */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center">
            <div className="text-xl font-bold text-zinc-100">{stats.total}</div>
            <div className="text-xs text-zinc-400 mt-1">إجمالي الطلبات</div>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-center">
            <div className="text-xl font-bold text-amber-300">{stats.pending}</div>
            <div className="text-xs text-zinc-400 mt-1">بانتظار الاختيار</div>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
            <div className="text-xl font-bold text-emerald-300">{stats.active}</div>
            <div className="text-xs text-zinc-400 mt-1">نشطة</div>
          </div>
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-center">
            <div className="text-xl font-bold text-blue-300">{stats.completed}</div>
            <div className="text-xs text-zinc-400 mt-1">منجزة</div>
          </div>
        </div>

        {/* الأرباح */}
        {stats.earnings > 0 && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-zinc-400">إجمالي الأرباح</div>
              <div className="text-2xl font-bold text-emerald-300 mt-0.5">
                {stats.earnings.toLocaleString()} IQD
              </div>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        )}

        {/* الروابط السريعة */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Link href="/lawyers" className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center hover:border-emerald-500/50 transition">
            <div className="text-xl mb-1">👥</div>
            <div className="text-xs text-zinc-300">قائمة المحامين</div>
          </Link>
          <Link href="/consultations" className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center hover:border-emerald-500/50 transition">
            <div className="text-xl mb-1">⚖️</div>
            <div className="text-xs text-zinc-300">الطلبات المفتوحة</div>
          </Link>
          <Link href="/contracts" className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center hover:border-emerald-500/50 transition">
            <div className="text-xl mb-1">📄</div>
            <div className="text-xs text-zinc-300">العقود الذكية</div>
          </Link>
          <Link href="/cases" className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center hover:border-emerald-500/50 transition">
            <div className="text-xl mb-1">📁</div>
            <div className="text-xs text-zinc-300">إدارة القضايا</div>
          </Link>
          <Link href="/library" className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center hover:border-emerald-500/50 transition">
            <div className="text-xl mb-1">📚</div>
            <div className="text-xs text-zinc-300">المكتبة القانونية</div>
          </Link>
          <Link href="/translate" className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center hover:border-emerald-500/50 transition">
            <div className="text-xl mb-1">🌐</div>
            <div className="text-xs text-zinc-300">الترجمة القانونية</div>
          </Link>
        </div>

        {/* الاستشارات النشطة */}
        {activeRequests.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-emerald-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              الاستشارات النشطة ({activeRequests.length})
            </h2>
            {activeRequests.map((req) => (
              <ConsultCard key={req.id} req={req} lawyerId={lawyerId} />
            ))}
          </section>
        )}

        {/* الطلبات المعلقة */}
        {pendingRequests.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-amber-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              بانتظار رد المستفيد ({pendingRequests.length})
            </h2>
            {pendingRequests.map((req) => (
              <ConsultCard key={req.id} req={req} lawyerId={lawyerId} />
            ))}
          </section>
        )}

        {/* المنجزة */}
        {completedRequests.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-blue-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
              الاستشارات المنجزة ({completedRequests.length})
            </h2>
            {completedRequests.map((req) => (
              <ConsultCard key={req.id} req={req} lawyerId={lawyerId} />
            ))}
          </section>
        )}

        {requests.length === 0 && (
          <div className="text-center py-12 space-y-3">
            <div className="text-4xl">⚖️</div>
            <p className="text-zinc-400 text-sm">لا توجد استشارات مرتبطة بحسابك بعد.</p>
            <Link href="/lawyers" className="inline-block px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm transition">
              تصفح الطلبات المفتوحة ↗
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}

// ── مكوّن بطاقة الاستشارة ────────────────────────────────────
function ConsultCard({ req, lawyerId }: { req: any; lawyerId: number }) {
  const myOffer    = req.offers[0] || null;
  const chatRoomId = req.chatRoom?.id ?? null;

  return (
    <article className="border border-zinc-800 rounded-2xl bg-zinc-900/70 p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1 flex-1">
          <div className="text-xs text-zinc-500">رقم الطلب: #{req.id}</div>
          <h3 className="text-sm font-semibold text-zinc-50">
            {req.consultation?.title || "استشارة بدون عنوان"}
          </h3>
          <p className="text-xs text-zinc-400 line-clamp-2">
            {req.consultation?.description}
          </p>
          <div className="text-xs text-zinc-500">
            المستفيد: {req.client?.name || req.client?.email || "مستخدم مسجل"}
          </div>
          <div className="text-[11px] text-zinc-600">
            {new Date(req.createdAt).toLocaleString("ar-IQ")}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={`text-[11px] px-2 py-0.5 rounded-full border ${statusColor(req.status)}`}>
            {statusLabel(req.status)}
          </span>

          {myOffer && (
            <div className="text-[11px] bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-2 py-1.5 text-right">
              <div className="text-emerald-300 font-semibold">عرضك:</div>
              <div className="text-zinc-300">{myOffer.fee} {myOffer.currency}</div>
              <div className="text-zinc-500">حالة: {myOffer.status}</div>
            </div>
          )}

          {chatRoomId ? (
            <Link
              href={`/chat/${chatRoomId}`}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition"
            >
              فتح المحادثة ←
            </Link>
          ) : (
            <span className="text-[11px] text-zinc-600">لا توجد غرفة محادثة بعد</span>
          )}
        </div>
      </div>
    </article>
  );
}
