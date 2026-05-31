//app/api/mobile/chat/[roomId]/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
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
      return NextResponse.json({ ok: true, messages: [] });
    }

    const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
    if (!room || (room.clientId !== userId && room.lawyerId !== userId && role !== "ADMIN")) {
      return NextResponse.json({ error: "غير مسموح" }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
      include: { sender: { select: { id: true, name: true, role: true } } },
    });

    return NextResponse.json({ ok: true, messages, myId: userId });
  } catch (error) {
    console.error("mobile chat messages error:", error);
    return NextResponse.json({ error: "تعذر جلب الرسائل." }, { status: 500 });
  }
}
