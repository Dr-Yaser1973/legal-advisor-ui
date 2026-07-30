// app/api/admin/support/[userId]/messages/route.ts
// عرض محادثة مستخدم معيّن للأدمن + الردّ عليها.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { notifyUser } from "@/lib/notify";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";

const MAX_TEXT_LEN = 4000;

// GET: رسائل محادثة المستخدم + تعليم رسائل المستخدم كمقروءة من الأدمن
export async function GET(_req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth.ok) return auth.res;

  const { userId } = await params;
  const threadUserId = Number(userId);
  if (!Number.isFinite(threadUserId) || threadUserId <= 0) {
    return NextResponse.json({ ok: false, error: "معرّف المستخدم غير صالح." }, { status: 400 });
  }

  const threadUser = await prisma.user.findUnique({
    where: { id: threadUserId },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!threadUser) {
    return NextResponse.json({ ok: false, error: "المستخدم غير موجود." }, { status: 404 });
  }

  const messages = await prisma.supportMessage.findMany({
    where: { threadUserId },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { id: true, name: true, role: true } } },
  });

  await prisma.supportMessage.updateMany({
    where: { threadUserId, fromAdmin: false, readByAdmin: false },
    data: { readByAdmin: true },
  });

  return NextResponse.json({ ok: true, user: threadUser, messages });
}

// POST: ردّ الأدمن على محادثة المستخدم
export async function POST(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth.ok) return auth.res;

  const { userId } = await params;
  const threadUserId = Number(userId);
  if (!Number.isFinite(threadUserId) || threadUserId <= 0) {
    return NextResponse.json({ ok: false, error: "معرّف المستخدم غير صالح." }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { id: threadUserId }, select: { id: true } });
  if (!exists) {
    return NextResponse.json({ ok: false, error: "المستخدم غير موجود." }, { status: 404 });
  }

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
      threadUserId,
      senderId: auth.user.id,
      fromAdmin: true,
      body: text,
      readByAdmin: true, // المرسِل (الأدمن) قرأها
    },
    include: { sender: { select: { id: true, name: true, role: true } } },
  });

  // إشعار المستخدم بردّ الإدارة
  try {
    await notifyUser({
      userId: threadUserId,
      title: "ردّ من إدارة المنصة",
      body: "وصلك ردّ جديد من الإدارة على رسالتك.",
      pushData: { type: "support_reply" },
    });
  } catch (err) {
    console.error("notify user (support reply) error (ignored):", err);
  }

  return NextResponse.json({ ok: true, message });
}
