 // app/api/translation/requests/accept-offer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    const user = session?.user as any;

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "يجب تسجيل الدخول." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const requestId = Number(body?.requestId);

    if (!Number.isFinite(requestId) || requestId <= 0) {
      return NextResponse.json(
        { ok: false, error: "رقم الطلب غير صالح." },
        { status: 400 }
      );
    }

    const request = await prisma.translationRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return NextResponse.json(
        { ok: false, error: "الطلب غير موجود." },
        { status: 404 }
      );
    }

    if (request.clientId !== Number(user.id)) {
      return NextResponse.json(
        { ok: false, error: "لا يمكنك الموافقة على طلب لا يخصك." },
        { status: 403 }
      );
    }

    // تغيير الحالة إلى IN_PROGRESS
    const updated = await prisma.translationRequest.update({
      where: { id: requestId },
      data: {
        status: "IN_PROGRESS",
        acceptedAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true, request: updated });
  } catch (err) {
    console.error("accept offer error:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ داخلي." },
      { status: 500 }
    );
  }
}
