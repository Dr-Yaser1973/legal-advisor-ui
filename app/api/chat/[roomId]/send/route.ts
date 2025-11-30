 // app/api/chat/[roomId]/send/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  context: { params: Promise<{ roomId: string }> }
) {
  const { roomId: rid } = await context.params;
  const roomId = Number(rid);

  if (Number.isNaN(roomId)) {
    return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
  }

  const session: any = await getServerSession(authOptions as any);
  const userId = session?.user?.id ? Number(session.user.id) : null;

  if (!session || !userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { text } = await req.json();
  if (!text || text.trim().length === 0)
    return NextResponse.json({ error: "Empty message" }, { status: 400 });

  // تأكد من أن المستخدم مشارك في الغرفة
  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId },
  });

  if (
    !room ||
    (room.clientId !== userId &&
      room.lawyerId !== userId &&
      session.user.role !== "ADMIN")
  ) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const msg = await prisma.message.create({
    data: {
      roomId,
      senderId: userId,
      text,
    },
  });

  return NextResponse.json({ ok: true, message: msg });
}
