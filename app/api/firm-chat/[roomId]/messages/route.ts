// app/api/firm-chat/[roomId]/messages/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { notifyUser } from "@/lib/notify";

export const runtime = "nodejs";

// يتحقّق أن المستخدم طرفٌ في الغرفة: العميل صاحب الطلب، أو عضو مكتب المؤسسة، أو أدمن.
async function resolveParticipant(
  userId: number,
  req: { clientId: number; orgId: number }
): Promise<{ ok: boolean; isClient: boolean }> {
  if (req.clientId === userId) return { ok: true, isClient: true };
  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, branch: { select: { orgId: true } } },
  });
  const isFirmSide = !!me?.branch?.orgId && me.branch.orgId === req.orgId;
  const isAdmin = me?.role === "ADMIN";
  return { ok: isFirmSide || isAdmin, isClient: false };
}

// GET: جلب رسائل غرفة الجات
export async function GET(_req: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const userId = Number((session.user as any).id);
    const { roomId: roomIdStr } = await params;
    const roomId = Number(roomIdStr);
    if (isNaN(roomId)) return NextResponse.json({ error: "معرف غير صالح." }, { status: 400 });

    const room = await prisma.firmChatRoom.findUnique({
      where: { id: roomId },
      include: { request: { select: { clientId: true, orgId: true, branchId: true } } },
    });
    if (!room) return NextResponse.json({ error: "الغرفة غير موجودة." }, { status: 404 });

    const part = await resolveParticipant(userId, room.request);
    if (!part.ok) return NextResponse.json({ error: "لا تملك صلاحية الوصول لهذه المحادثة." }, { status: 403 });

    const messages = await prisma.firmMessage.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ messages, room });
  } catch (e: any) {
    console.error("GET /api/firm-chat/[roomId]/messages error:", e);
    return NextResponse.json({ error: "حدث خطأ." }, { status: 500 });
  }
}

// POST: إرسال رسالة
export async function POST(req: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const userId = Number((session.user as any).id);
    const { roomId: roomIdStr } = await params;
    const roomId = Number(roomIdStr);
    if (isNaN(roomId)) return NextResponse.json({ error: "معرف غير صالح." }, { status: 400 });

    const body = await req.json();
    const { text } = body || {};
    if (!text?.trim()) return NextResponse.json({ error: "الرسالة فارغة." }, { status: 400 });

    const room = await prisma.firmChatRoom.findUnique({
      where: { id: roomId },
      include: { request: { select: { clientId: true, orgId: true, branchId: true, assignedTo: true, subject: true } } },
    });
    if (!room) return NextResponse.json({ error: "الغرفة غير موجودة." }, { status: 404 });

    const part = await resolveParticipant(userId, room.request);
    if (!part.ok) return NextResponse.json({ error: "لا تملك صلاحية المشاركة في هذه المحادثة." }, { status: 403 });

    const message = await prisma.firmMessage.create({
      data: { roomId, senderId: userId, text: text.trim() },
    });

    // إشعار الطرف الآخر بالاتجاه الصحيح:
    // - العميل يرسل → يُشعَر الموظف المكلّف (إن وُجد)
    // - المكتب يرسل → يُشعَر العميل
    const recipientId = part.isClient ? room.request.assignedTo : room.request.clientId;
    if (recipientId && recipientId !== userId) {
      await notifyUser({
        userId: recipientId,
        title: "رسالة جديدة في استشارة المكتب",
        body: text.trim().slice(0, 80),
        pushData: { type: "firm_chat", roomId, requestId: room.requestId },
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true, message });
  } catch (e: any) {
    console.error("POST /api/firm-chat/[roomId]/messages error:", e);
    return NextResponse.json({ error: e.message || "حدث خطأ." }, { status: 500 });
  }
}
