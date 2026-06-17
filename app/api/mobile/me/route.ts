import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyUserToken(token);
    const userId = Number(payload.sub);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true,
        role: true, phone: true, isApproved: true,
        status: true, image: true,
         plan: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ user });

  } catch {
    return NextResponse.json({ error: "token غير صالح" }, { status: 401 });
  }
}
