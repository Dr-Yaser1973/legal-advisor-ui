import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/jwt";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
    }
    const payload: any = await verifyUserToken(authHeader.split(" ")[1]);
    const userId = Number(payload.sub);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ ok: false, error: "المستخدم غير موجود" }, { status: 404 });
    }

    // حذف الحساب
    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ ok: true, message: "تم حذف الحساب نهائياً" });
  } catch (err) {
    console.error("mobile account delete error:", err);
    return NextResponse.json({ ok: false, error: "تعذّر حذف الحساب" }, { status: 500 });
  }
}
