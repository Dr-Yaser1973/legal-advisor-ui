// app/api/chat/[id]/messages/send/route.ts
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session: any = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const userId = Number(session.user.id);
  const roomId = Number(params.id);

  const { text } = await req.json();

  if (!text || text.trim() === "") {
    return NextResponse.json({ error: "النص مطلوب" }, { status: 400 });
  }

  const msg = await prisma.message.create({
    data: {
      text,
      senderId: userId,
      roomId,
    },
  });

  return NextResponse.json(msg);
}

