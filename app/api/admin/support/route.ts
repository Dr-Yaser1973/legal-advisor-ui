// app/api/admin/support/route.ts
// قائمة محادثات الدعم للأدمن (مجمّعة حسب صاحب المحادثة) مع عدّاد غير المقروء.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth.ok) return auth.res;

  // كل محادثة تُعرّف بـ threadUserId
  const grouped = await prisma.supportMessage.groupBy({
    by: ["threadUserId"],
    _max: { createdAt: true },
    _count: { _all: true },
  });

  const userIds = grouped.map((g) => g.threadUserId);
  if (userIds.length === 0) {
    return NextResponse.json({ ok: true, threads: [] });
  }

  const [users, unreadCounts, lastMessages] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true, role: true },
    }),
    // غير المقروء = رسائل من المستخدم لم يقرأها الأدمن بعد
    prisma.supportMessage.groupBy({
      by: ["threadUserId"],
      where: { fromAdmin: false, readByAdmin: false },
      _count: { _all: true },
    }),
    prisma.supportMessage.findMany({
      where: { threadUserId: { in: userIds } },
      orderBy: { createdAt: "desc" },
      distinct: ["threadUserId"],
      select: { threadUserId: true, body: true, fromAdmin: true, createdAt: true },
    }),
  ]);

  const userMap = new Map(users.map((u) => [u.id, u]));
  const unreadMap = new Map(unreadCounts.map((c) => [c.threadUserId, c._count._all]));
  const lastMap = new Map(lastMessages.map((m) => [m.threadUserId, m]));

  const threads = grouped
    .map((g) => {
      const u = userMap.get(g.threadUserId);
      const last = lastMap.get(g.threadUserId);
      return {
        userId: g.threadUserId,
        name: u?.name ?? null,
        email: u?.email ?? null,
        role: u?.role ?? null,
        total: g._count._all,
        unread: unreadMap.get(g.threadUserId) ?? 0,
        lastBody: last?.body ?? "",
        lastFromAdmin: last?.fromAdmin ?? false,
        lastAt: g._max.createdAt,
      };
    })
    .sort((a, b) => (b.lastAt?.getTime() ?? 0) - (a.lastAt?.getTime() ?? 0));

  return NextResponse.json({ ok: true, threads });
}
