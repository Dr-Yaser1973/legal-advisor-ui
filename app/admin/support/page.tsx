// app/admin/support/page.tsx
// وارد رسائل الدعم — قائمة المحادثات مع المستخدمين.
import AdminSidebar from "@/components/admin/AdminSidebar";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Inbox } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "أدمن",
  LAWYER: "محامٍ",
  CLIENT: "عميل",
  COMPANY: "شركة",
  LAW_FIRM: "مكتب محاماة",
  TRANSLATION_OFFICE: "مكتب ترجمة",
};

function fmtDate(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("ar-IQ", { dateStyle: "medium", timeStyle: "short" }).format(d);
}

export default async function AdminSupportPage() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/unauthorized");

  const grouped = await prisma.supportMessage.groupBy({
    by: ["threadUserId"],
    _max: { createdAt: true },
  });

  const userIds = grouped.map((g) => g.threadUserId);
  const [users, unread, lasts] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true, role: true },
    }),
    prisma.supportMessage.groupBy({
      by: ["threadUserId"],
      where: { fromAdmin: false, readByAdmin: false },
      _count: { _all: true },
    }),
    prisma.supportMessage.findMany({
      where: { threadUserId: { in: userIds } },
      orderBy: { createdAt: "desc" },
      distinct: ["threadUserId"],
      select: { threadUserId: true, body: true, fromAdmin: true },
    }),
  ]);

  const userMap = new Map(users.map((u) => [u.id, u]));
  const unreadMap = new Map(unread.map((c) => [c.threadUserId, c._count._all]));
  const lastMap = new Map(lasts.map((m) => [m.threadUserId, m]));

  const threads = grouped
    .map((g) => ({
      userId: g.threadUserId,
      u: userMap.get(g.threadUserId),
      unread: unreadMap.get(g.threadUserId) ?? 0,
      last: lastMap.get(g.threadUserId),
      lastAt: g._max.createdAt,
    }))
    .sort((a, b) => (b.lastAt?.getTime() ?? 0) - (a.lastAt?.getTime() ?? 0));

  return (
    <div className="flex gap-0" dir="rtl">
      <AdminSidebar />
      <div className="flex-1 px-6 py-2">
        <div className="flex items-center gap-2 mb-6">
          <Inbox className="w-5 h-5 text-emerald-400" />
          <h1 className="text-2xl font-bold">رسائل الدعم</h1>
        </div>

        {threads.length === 0 ? (
          <p className="text-sm text-zinc-400">لا توجد رسائل دعم بعد.</p>
        ) : (
          <div className="space-y-2">
            {threads.map((t) => (
              <Link
                key={t.userId}
                href={`/admin/support/${t.userId}`}
                className="block rounded-xl border border-white/10 bg-zinc-900/60 hover:bg-zinc-900 p-4 transition"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white truncate">
                        {t.u?.name || t.u?.email || `مستخدم #${t.userId}`}
                      </span>
                      <span className="text-[11px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                        {ROLE_LABEL[t.u?.role || ""] || t.u?.role || "—"}
                      </span>
                      {t.unread > 0 && (
                        <span className="text-[11px] text-white bg-red-500 px-2 py-0.5 rounded-full">
                          {t.unread} جديدة
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-400 mt-1 truncate">
                      {t.last?.fromAdmin ? "أنت: " : ""}
                      {t.last?.body || ""}
                    </div>
                  </div>
                  <div className="text-[11px] text-zinc-500 shrink-0">{fmtDate(t.lastAt)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
