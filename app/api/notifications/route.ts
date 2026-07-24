// app/api/notifications/route.ts
// إشعارات المستخدم الحالي: جلب القائمة + عدّاد غير المقروء، وتعليمها كمقروءة.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET → آخر الإشعارات + عدد غير المقروء
export async function GET() {
  const auth = await requireUser();
  if (!auth.ok) return auth.res;
  const userId = auth.user.id;

  const [items, unread] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { id: true, title: true, body: true, readAt: true, createdAt: true },
    }),
    prisma.notification.count({ where: { userId, readAt: null } }),
  ]);

  return NextResponse.json({ ok: true, items, unread });
}

// PATCH → تعليم كمقروء
//  body { id }      → إشعار واحد
//  body {} أو {all} → كل غير المقروء
export async function PATCH(req: Request) {
  const auth = await requireUser();
  if (!auth.ok) return auth.res;
  const userId = auth.user.id;

  const body = await req.json().catch(() => ({}));
  const id = Number(body?.id);

  if (Number.isFinite(id) && id > 0) {
    // إشعار محدّد — مقيّد بملكية المستخدم
    await prisma.notification.updateMany({
      where: { id, userId, readAt: null },
      data: { readAt: new Date() },
    });
  } else {
    // كل غير المقروء لهذا المستخدم
    await prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  return NextResponse.json({ ok: true });
}
