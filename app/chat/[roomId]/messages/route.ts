// app/api/chat/[id]/messages/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const roomId = Number(params.id);

  const messages = await prisma.message.findMany({
    where: { roomId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: true,
    },
  });

  return NextResponse.json(messages);
}

