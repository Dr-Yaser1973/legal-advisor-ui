import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyUserToken(token);
    const userId = Number(payload.sub);

    const consultations = await prisma.consultation.findMany({
      where: { userId, answer: { not: null } },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        title: true,
        description: true,
        answer: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ consultations });

  } catch (error) {
    console.error("History error:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
