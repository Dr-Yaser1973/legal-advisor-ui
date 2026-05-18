 // app/api/firm-chat/[roomId]/messages/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export const runtime = "nodejs";

// GET: جلب رسائل غرفة الجات
export async function GET(_req: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const { roomId: roomIdStr } = await params;
    const roomId = Number(roomIdStr);
    if (isNaN(roomId)) return NextResponse.json({ error: "معرف غير صالح." }, { status: 400 });

    const room = await prisma.firmChatRoom.findUnique({
      where: { id: roomId },
      include: { request: { select: { clientId: true, branchId: true } } },
    });

    if (!room) return NextResponse.json({ error: "الغرفة غير موجودة." }, { status: 404 });

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
      include: { request: { select: { clientId: true } } },
    });
    if (!room) return NextResponse.json({ error: "الغرفة غير موجودة." }, { status: 404 });

    const message = await prisma.firmMessage.create({
      data: { roomId, senderId: userId, text: text.trim() },
    });

    // إشعار للطرف الآخر
    const otherId = room.request.clientId === userId ? null : room.request.clientId;
    if (otherId) {
      await prisma.notification.create({
        data: { userId: otherId, title: "رسالة جديدة", body: text.slice(0, 80) },
      });
    }

    return NextResponse.json({ ok: true, message });
  } catch (e: any) {
    console.error("POST /api/firm-chat/[roomId]/messages error:", e);
    return NextResponse.json({ error: e.message || "حدث خطأ." }, { status: 500 });
  }
}