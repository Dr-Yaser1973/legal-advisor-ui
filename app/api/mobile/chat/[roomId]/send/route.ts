//app/api/mobile/chat/[roomId]/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/jwt";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ roomId: string }> }
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    const payload: any = await verifyUserToken(authHeader.split(" ")[1]);
    const userId = Number(payload.sub);
    const role = payload.role;

    const { roomId: rid } = await context.params;
    const roomId = Number(rid);
    if (Number.isNaN(roomId)) {
      return NextResponse.json({ error: "معرّف غير صالح" }, { status: 400 });
    }

    const { text } = await req.json();
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "رسالة فارغة" }, { status: 400 });
    }

    const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
    if (!room || (room.clientId !== userId && room.lawyerId !== userId && role !== "ADMIN")) {
      return NextResponse.json({ error: "غير مسموح" }, { status: 403 });
    }

    const msg = await prisma.message.create({
      data: { roomId, senderId: userId, text },
    });

    return NextResponse.json({ ok: true, message: msg });
  } catch (error) {
    console.error("mobile chat send error:", error);
    return NextResponse.json({ error: "تعذر إرسال الرسالة." }, { status: 500 });
  }
}
