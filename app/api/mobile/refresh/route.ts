import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken, signUserToken, signRefreshToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
    if (!refreshToken) {
      return NextResponse.json({ error: "refresh token مطلوب" }, { status: 400 });
    }

    const payload = await verifyUserToken(refreshToken);
    const userId = Number(payload.sub);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, isApproved: true, status: true },
    });

    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    if (user.status === "SUSPENDED") {
      return NextResponse.json({ error: "تم تعليق الحساب" }, { status: 403 });
    }

    const newToken = await signUserToken({
      id: user.id,
      role: user.role,
      isApproved: user.isApproved,
    });
    const newRefreshToken = await signRefreshToken(user.id);

    return NextResponse.json({ token: newToken, refreshToken: newRefreshToken });

  } catch {
    return NextResponse.json({ error: "refresh token غير صالح أو منتهي" }, { status: 401 });
  }
}
