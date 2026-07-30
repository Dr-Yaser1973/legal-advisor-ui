// app/api/translation/requests/[id]/messages/route.ts
// مراسلة بين العميل ومكتب الترجمة على طلب ترجمة معيّن — للاتفاق على طريقة الدفع.
// تُفتح فقط بعد أن يسعّر المكتب الطلب (الحالة ACCEPTED فما بعدها).
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { notifyUser } from "@/lib/notify";

export const runtime = "nodejs";

// الحالات التي تكون فيها المراسلة مسموحة (المكتب سعّر/وافق فما بعد)
const CHAT_OPEN_STATUSES = ["ACCEPTED", "IN_PROGRESS", "COMPLETED"];
const MAX_TEXT_LEN = 4000;

type Access =
  | { ok: true; userId: number; role: string; requestId: number; request: { clientId: number; officeId: number | null; status: string } }
  | { ok: false; res: NextResponse };

async function resolveAccess(idRaw: string): Promise<Access> {
  const session = (await getServerSession(authOptions as any)) as any;
  const userId = session?.user?.id ? Number(session.user.id) : null;
  const role = session?.user?.role as string | undefined;

  if (!session || !userId) {
    return { ok: false, res: NextResponse.json({ ok: false, error: "يجب تسجيل الدخول." }, { status: 401 }) };
  }

  const requestId = Number(idRaw);
  if (!Number.isFinite(requestId) || requestId <= 0) {
    return { ok: false, res: NextResponse.json({ ok: false, error: "رقم الطلب غير صالح." }, { status: 400 }) };
  }

  const request = await prisma.translationRequest.findUnique({
    where: { id: requestId },
    select: { clientId: true, officeId: true, status: true },
  });

  if (!request) {
    return { ok: false, res: NextResponse.json({ ok: false, error: "الطلب غير موجود." }, { status: 404 }) };
  }

  const isClient = request.clientId === userId;
  const isOffice = request.officeId != null && request.officeId === userId;
  const isAdmin = role === "ADMIN";

  if (!isClient && !isOffice && !isAdmin) {
    return { ok: false, res: NextResponse.json({ ok: false, error: "لا تملك صلاحية الوصول لهذه المحادثة." }, { status: 403 }) };
  }

  return { ok: true, userId, role: role || "", requestId, request };
}

// GET: جلب رسائل المحادثة
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const access = await resolveAccess(id);
  if (!access.ok) return access.res;

  const { request, requestId } = access;

  // قبل أن يسعّر المكتب لا يوجد طرف مقابل للتحادث معه
  const open = request.officeId != null && CHAT_OPEN_STATUSES.includes(request.status);

  const messages = open
    ? await prisma.translationMessage.findMany({
        where: { requestId },
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true, role: true } } },
      })
    : [];

  return NextResponse.json({ ok: true, open, status: request.status, messages });
}

// POST: إرسال رسالة
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const access = await resolveAccess(id);
  if (!access.ok) return access.res;

  const { userId, request, requestId } = access;

  if (request.officeId == null || !CHAT_OPEN_STATUSES.includes(request.status)) {
    return NextResponse.json(
      { ok: false, error: "المراسلة تُفتح بعد قبول المكتب للطلب وتسعيره." },
      { status: 400 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as { text?: string };
  const text = (body.text || "").trim();
  if (!text) {
    return NextResponse.json({ ok: false, error: "نص الرسالة مطلوب." }, { status: 400 });
  }
  if (text.length > MAX_TEXT_LEN) {
    return NextResponse.json({ ok: false, error: `الرسالة طويلة جداً (الحد ${MAX_TEXT_LEN} حرف).` }, { status: 400 });
  }

  const message = await prisma.translationMessage.create({
    data: { requestId, senderId: userId, text },
    include: { sender: { select: { id: true, name: true, role: true } } },
  });

  // إشعار الطرف المقابل (العميل ↔ المكتب)
  const recipientId = userId === request.clientId ? request.officeId : request.clientId;
  if (recipientId && recipientId !== userId) {
    try {
      await notifyUser({
        userId: recipientId,
        title: "رسالة جديدة بخصوص طلب الترجمة",
        body: `لديك رسالة جديدة على طلب الترجمة رقم ${requestId}.`,
        pushData: { type: "translation_message", requestId },
      });
    } catch (err) {
      console.error("notify translation message error (ignored):", err);
    }
  }

  return NextResponse.json({ ok: true, message });
}
