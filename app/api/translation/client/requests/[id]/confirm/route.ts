import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    const user = session?.user as any;

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    const requestId = Number(params.id);
    if (!Number.isFinite(requestId) || requestId <= 0) {
      return NextResponse.json(
        { ok: false, error: "رقم الطلب غير صالح" },
        { status: 400 }
      );
    }

    const request = await prisma.translationRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return NextResponse.json(
        { ok: false, error: "الطلب غير موجود" },
        { status: 404 }
      );
    }

    if (request.clientId !== Number(user.id)) {
      return NextResponse.json(
        { ok: false, error: "لا يمكنك الموافقة على هذا الطلب" },
        { status: 403 }
      );
    }

    if (request.status !== "ACCEPTED") {
      return NextResponse.json(
        { ok: false, error: "يجب أن يكون الطلب في حالة تم التسعير" },
        { status: 400 }
      );
    }

    const updated = await prisma.translationRequest.update({
      where: { id: requestId },
      data: {
        status: "IN_PROGRESS",
      },
    });

    return NextResponse.json({ ok: true, request: updated });
  } catch (err) {
    console.error("Confirm error:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء تأكيد الموافقة" },
      { status: 500 }
    );
  }
}

