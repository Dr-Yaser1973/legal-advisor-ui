 // app/api/mobile/translation/offices/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
    }
    await verifyUserToken(authHeader.split(" ")[1]);

    const offices = await prisma.user.findMany({
      where: { role: "TRANSLATION_OFFICE", isApproved: true },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        location: true,
        image: true,
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ ok: true, offices });
  } catch (err) {
    console.error("mobile offices GET error:", err);
    return NextResponse.json({ ok: false, error: "حدث خطأ أثناء جلب المكاتب." }, { status: 500 });
  }
}