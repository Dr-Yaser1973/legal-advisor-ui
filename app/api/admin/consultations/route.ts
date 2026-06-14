 // app/api/admin/consultations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

type Track = "AI" | "HUMAN" | "CONSULT_REQ" | "FIRM" | "ALL";

// تفاصيل عرض واحد (محامٍ أو مكتب)
type OfferDetail = {
  providerName: string;
  fee: number;
  currency: string;
  note: string | null;
  status: string;
  statusLabel: string;
  createdAt: Date;
  respondedAt: Date | null;
};

type UnifiedRow = {
  id: string;
  track: "AI" | "HUMAN" | "CONSULT_REQ" | "FIRM";
  trackLabel: string;
  title: string;
  status: string;
  statusLabel: string;
  clientName: string;
  clientEmail: string;
  handlerName: string | null;
  createdAt: Date;
  // جديد:
  acceptedAt: Date | null;
  completedAt: Date | null;
  responseMs: number | null; // زمن أول استجابة (قبول)
  slaBreached: boolean; // تجاوز حد الاستجابة وما زال معلّقاً
  offers: OfferDetail[];
};

// حدّ SLA: طلب معلّق بلا قبول لأكثر من هذا = أحمر
const SLA_HOURS = 24;
const SLA_MS = SLA_HOURS * 60 * 60 * 1000;

const FIRM_STATUS_AR: Record<string, string> = {
  PENDING: "بانتظار",
  OFFER_SENT: "أُرسل عرض",
  ACCEPTED: "مقبولة",
  IN_PROGRESS: "قيد المعالجة",
  COMPLETED: "مكتملة",
  CANCELED: "ملغاة",
};

const HUMAN_STATUS_AR: Record<string, string> = {
  PENDING: "بانتظار",
  ACCEPTED: "مقبولة",
  IN_PROGRESS: "قيد المعالجة",
  COMPLETED: "مكتملة",
  CANCELED: "ملغاة",
};

const REQ_STATUS_AR: Record<string, string> = {
  PENDING: "بانتظار",
  ACCEPTED: "مقبولة",
  REJECTED: "مرفوضة",
  COMPLETED: "مكتملة",
};

const OFFER_STATUS_AR: Record<string, string> = {
  PENDING: "بانتظار",
  ACCEPTED: "مقبول",
  REJECTED: "مرفوض",
};

// هل الطلب ما زال معلّقاً (لم يُقبل/يكتمل/يُلغَ)؟
function isOpen(status: string): boolean {
  return ["PENDING", "OFFER_SENT"].includes(status);
}

export async function GET(req: NextRequest) {
  const session: any = await getServerSession(authOptions as any);
  const role = session?.user?.role;

  if (!session || role !== "ADMIN") {
    return NextResponse.json(
      { error: "غير مصرّح. هذه الواجهة لمدير النظام فقط." },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const track = (searchParams.get("track") || "ALL") as Track;
  const status = searchParams.get("status") || "";
  const days = parseInt(searchParams.get("days") || "0", 10);
  const q = (searchParams.get("q") || "").trim();
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 200);

  const since =
    days > 0 ? new Date(Date.now() - days * 24 * 60 * 60 * 1000) : undefined;

  const now = Date.now();
  const rows: UnifiedRow[] = [];

  // مساعد لحساب زمن الاستجابة وكسر SLA
  function timing(
    createdAt: Date,
    acceptedAt: Date | null,
    status: string
  ): { responseMs: number | null; slaBreached: boolean } {
    const responseMs = acceptedAt
      ? acceptedAt.getTime() - createdAt.getTime()
      : null;
    const slaBreached =
      !acceptedAt &&
      isOpen(status) &&
      now - createdAt.getTime() > SLA_MS;
    return { responseMs, slaBreached };
  }

  // ── 1) الاستشارات الذكية (AI) ─────────────────────────
  if (track === "ALL" || track === "AI") {
    const consultations = await prisma.consultation.findMany({
      where: {
        ...(since ? { createdAt: { gte: since } } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: { select: { name: true, email: true } },
        humanRequests: { select: { id: true } },
      },
    });

    for (const c of consultations) {
      const answered = !!c.answer && c.answer.trim().length > 0;
      const escalated = c.humanRequests.length > 0;
      rows.push({
        id: `AI-${c.id}`,
        track: "AI",
        trackLabel: "استشارة ذكية",
        title: c.title,
        status: answered ? "ANSWERED" : "PENDING",
        statusLabel:
          (answered ? "مُجابة" : "بانتظار الرد") +
          (escalated ? " · مُصعّدة لمحامٍ" : ""),
        clientName: c.user?.name || "بدون اسم",
        clientEmail: c.user?.email || "—",
        handlerName: null,
        createdAt: c.createdAt,
        acceptedAt: null,
        completedAt: null,
        responseMs: null, // لا طابع زمني موثوق للرد الذكي
        slaBreached: false,
        offers: [],
      });
    }
  }

  // ── 2) استشارات المحامي المعتمد + عروضها ───────────────
  if (track === "ALL" || track === "HUMAN") {
    const humans = await prisma.humanConsultRequest.findMany({
      where: {
        ...(since ? { createdAt: { gte: since } } : {}),
        ...(status && HUMAN_STATUS_AR[status] ? { status: status as any } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        client: { select: { name: true, email: true } },
        lawyer: { select: { name: true } },
        consultation: { select: { title: true } },
        offers: {
          orderBy: { fee: "asc" },
          include: { lawyer: { select: { name: true } } },
        },
      },
    });

    for (const h of humans) {
      const t = timing(h.createdAt, h.acceptedAt, h.status);
      rows.push({
        id: `HUMAN-${h.id}`,
        track: "HUMAN",
        trackLabel: "محامٍ معتمد",
        title: h.consultation?.title || `طلب استشارة #${h.id}`,
        status: h.status,
        statusLabel: HUMAN_STATUS_AR[h.status] || h.status,
        clientName: h.client?.name || "بدون اسم",
        clientEmail: h.client?.email || "—",
        handlerName: h.lawyer?.name || "لم يُسنَد بعد",
        createdAt: h.createdAt,
        acceptedAt: h.acceptedAt,
        completedAt: h.completedAt,
        responseMs: t.responseMs,
        slaBreached: t.slaBreached,
        offers: h.offers.map((o) => ({
          providerName: o.lawyer?.name || `محامٍ #${o.lawyerId}`,
          fee: o.fee,
          currency: o.currency,
          note: o.note,
          status: o.status,
          statusLabel: OFFER_STATUS_AR[o.status] || o.status,
          createdAt: o.createdAt,
          respondedAt: null,
        })),
      });
    }
  }

  // ── 3) طلبات الاستشارة المباشرة ───────────────────────
  if (track === "ALL" || track === "CONSULT_REQ") {
    const reqs = await prisma.consultationRequest.findMany({
      where: {
        ...(since ? { createdAt: { gte: since } } : {}),
        ...(status ? { status } : {}),
        ...(q ? { message: { contains: q, mode: "insensitive" } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: { select: { name: true, email: true } },
        lawyer: { select: { name: true } },
      },
    });

    for (const r of reqs) {
      const breached =
        r.status === "PENDING" &&
        now - r.createdAt.getTime() > SLA_MS;
      rows.push({
        id: `CONSULT_REQ-${r.id}`,
        track: "CONSULT_REQ",
        trackLabel: "طلب مباشر",
        title:
          r.message.length > 60 ? r.message.slice(0, 60) + "…" : r.message,
        status: r.status,
        statusLabel: REQ_STATUS_AR[r.status] || r.status,
        clientName: r.user?.name || "بدون اسم",
        clientEmail: r.user?.email || "—",
        handlerName: r.lawyer?.name || "لم يُسنَد بعد",
        createdAt: r.createdAt,
        acceptedAt: null,
        completedAt: null,
        responseMs: null,
        slaBreached: breached,
        offers: [],
      });
    }
  }

  // ── 4) استشارات المكاتب/الشركات + العرض ────────────────
  if (track === "ALL" || track === "FIRM") {
    const firms = await prisma.firmConsultRequest.findMany({
      where: {
        ...(since ? { createdAt: { gte: since } } : {}),
        ...(status && FIRM_STATUS_AR[status] ? { status: status as any } : {}),
        ...(q
          ? {
              OR: [
                { subject: { contains: q, mode: "insensitive" } },
                { details: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        client: { select: { name: true, email: true } },
        assignee: { select: { name: true } },
        org: { select: { name: true } },
        offer: true, // علاقة واحد-لواحد
      },
    });

    for (const f of firms) {
      const t = timing(f.createdAt, f.acceptedAt, f.status);
      const offers: OfferDetail[] = f.offer
        ? [
            {
              providerName: f.org?.name || "المكتب",
              fee: f.offer.fee,
              currency: f.offer.currency,
              note: f.offer.note,
              status: f.offer.status,
              statusLabel:
                OFFER_STATUS_AR[f.offer.status] || f.offer.status,
              createdAt: f.offer.createdAt,
              respondedAt: f.offer.respondedAt,
            },
          ]
        : [];
      rows.push({
        id: `FIRM-${f.id}`,
        track: "FIRM",
        trackLabel: "مكتب/شركة",
        title: f.subject,
        status: f.status,
        statusLabel: FIRM_STATUS_AR[f.status] || f.status,
        clientName: f.client?.name || "بدون اسم",
        clientEmail: f.client?.email || "—",
        handlerName:
          f.assignee?.name ||
          (f.org?.name ? `${f.org.name} (غير مُسنَد)` : "لم يُسنَد"),
        createdAt: f.createdAt,
        acceptedAt: f.acceptedAt,
        completedAt: f.completedAt,
        responseMs: t.responseMs,
        slaBreached: t.slaBreached,
        offers,
      });
    }
  }

  rows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const sliced = rows.slice(0, limit);

  // ── الإحصائيات + متوسط زمن الاستجابة ──────────────────
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const [
    aiTotal,
    humanPending,
    humanActive,
    firmPending,
    firmActive,
    ai7d,
    human7d,
    firm7d,
    humanAccepted,
    firmAccepted,
  ] = await Promise.all([
    prisma.consultation.count(),
    prisma.humanConsultRequest.count({ where: { status: "PENDING" } }),
    prisma.humanConsultRequest.count({
      where: { status: { in: ["ACCEPTED", "IN_PROGRESS"] } },
    }),
    prisma.firmConsultRequest.count({ where: { status: "PENDING" } }),
    prisma.firmConsultRequest.count({
      where: { status: { in: ["OFFER_SENT", "ACCEPTED", "IN_PROGRESS"] } },
    }),
    prisma.consultation.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.humanConsultRequest.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    }),
    prisma.firmConsultRequest.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    }),
    // عيّنة لحساب متوسط زمن القبول (آخر 200 طلب مقبول)
    prisma.humanConsultRequest.findMany({
      where: { acceptedAt: { not: null } },
      select: { createdAt: true, acceptedAt: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.firmConsultRequest.findMany({
      where: { acceptedAt: { not: null } },
      select: { createdAt: true, acceptedAt: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
  ]);

  function avgMs(
    arr: { createdAt: Date; acceptedAt: Date | null }[]
  ): number | null {
    const diffs = arr
      .filter((x) => x.acceptedAt)
      .map((x) => x.acceptedAt!.getTime() - x.createdAt.getTime());
    if (diffs.length === 0) return null;
    return diffs.reduce((a, b) => a + b, 0) / diffs.length;
  }

  return NextResponse.json({
    rows: sliced,
    totalReturned: sliced.length,
    stats: {
      aiTotal,
      humanPending,
      humanActive,
      firmPending,
      firmActive,
      last7Days: ai7d + human7d + firm7d,
      avgHumanResponseMs: avgMs(humanAccepted),
      avgFirmResponseMs: avgMs(firmAccepted),
    },
  });
}