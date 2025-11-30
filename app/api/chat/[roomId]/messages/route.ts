 // app/api/chat/[roomId]/messages/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

// GET: جلب الرسائل في غرفة محادثة
export async function GET(
  req: Request,
  context: { params: Promise<{ roomId: string }> }
) {
  const { roomId: rid } = await context.params;
  const roomId = Number(rid);
  if (Number.isNaN(roomId)) return NextResponse.json([], { status: 200 });

  const session: any = await getServerSession(authOptions as any);
  const userId = session?.user?.id ? Number(session.user.id) : null;

  if (!session || !userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // التحقق من المشاركة في المحادثة
  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId },
    include: {
      request: true,
    },
  });

  if (
    !room ||
    (room.clientId !== userId &&
      room.lawyerId !== userId &&
      session.user.role !== "ADMIN")
  ) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { roomId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: {
        select: { id: true, name: true, role: true },
      },
    },
  });

  return NextResponse.json(messages);
}
