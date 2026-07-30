// app/api/support/messages/route.ts
// محادثة المستخدم مع الإدارة (أي دور مسجّل). المحادثة مملوكة للمستخدم نفسه.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/guards";
import { notifyUser } from "@/lib/notify";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";

const MAX_TEXT_LEN = 4000;

// GET: رسائل محادثة المستخدم الحالي + تعليم رسائل الإدارة كمقروءة
export async function GET() {
  const auth = await requireUser();
  if (!auth.ok) return auth.res;
  const meId = auth.user.id;

  const messages = await prisma.supportMessage.findMany({
    where: { threadUserId: meId },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { id: true, name: true, role: true } } },
  });

  // تعليم رسائل الإدارة الواردة كمقروءة من المستخدم
  await prisma.supportMessage.updateMany({
    where: { threadUserId: meId, fromAdmin: true, readByUser: false },
    data: { readByUser: true },
  });

  return NextResponse.json({ ok: true, messages });
}

// POST: إرسال رسالة من المستخدم إلى الإدارة
export async function POST(req: Request) {
  const auth = await requireUser();
  if (!auth.ok) return auth.res;
  const meId = auth.user.id;

  const body = (await req.json().catch(() => ({}))) as { text?: string };
  const text = (body.text || "").trim();
  if (!text) {
    return NextResponse.json({ ok: false, error: "نص الرسالة مطلوب." }, { status: 400 });
  }
  if (text.length > MAX_TEXT_LEN) {
    return NextResponse.json({ ok: false, error: `الرسالة طويلة جداً (الحد ${MAX_TEXT_LEN} حرف).` }, { status: 400 });
  }

  const message = await prisma.supportMessage.create({
    data: {
      threadUserId: meId,
      senderId: meId,
      fromAdmin: false,
      body: text,
      readByUser: true, // المرسِل قرأها
    },
    include: { sender: { select: { id: true, name: true, role: true } } },
  });

  // إشعار جميع مدراء المنصة برسالة الدعم الجديدة
  try {
    const admins = await prisma.user.findMany({
      where: { role: UserRole.ADMIN },
      select: { id: true },
    });
    await Promise.all(
      admins.map((a) =>
        notifyUser({
          userId: a.id,
          title: "رسالة دعم جديدة",
          body: `وصلتك رسالة جديدة من ${auth.user.email} عبر «تواصل مع الإدارة».`,
          pushData: { type: "support_message", threadUserId: meId },
        })
      )
    );
  } catch (err) {
    console.error("notify admins (support) error (ignored):", err);
  }

  return NextResponse.json({ ok: true, message });
}
