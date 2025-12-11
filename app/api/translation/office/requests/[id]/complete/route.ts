 import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    const user = session?.user as any;

    if (!user || user.role !== "TRANSLATION_OFFICE") {
      return NextResponse.json(
        { ok: false, error: "غير مصرح لمكتب الترجمة" },
        { status: 401 }
      );
    }

    const rawId = params?.id;
    const requestId = Number(rawId);

    if (!rawId || !Number.isFinite(requestId) || requestId <= 0) {
      return NextResponse.json(
        { ok: false, error: "رقم الطلب غير صالح" },
        { status: 400 }
      );
    }

    const officeId = Number(user.id);

    const request = await prisma.translationRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return NextResponse.json(
        { ok: false, error: "الطلب غير موجود" },
        { status: 404 }
      );
    }

    if (request.officeId !== officeId) {
      return NextResponse.json(
        { ok: false, error: "لا يمكنك تعديل هذا الطلب" },
        { status: 403 }
      );
    }

    if (request.status !== "IN_PROGRESS") {
      return NextResponse.json(
        {
          ok: false,
          error: "يمكن تعليم الطلب كمكتمل فقط إذا كان في حالة قيد الترجمة",
        },
        { status: 400 }
      );
    }

    const updatedRequest = await prisma.translationRequest.update({
      where: { id: request.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    try {
      await prisma.notification.create({
        data: {
          userId: request.clientId,
          title: "اكتمال ترجمة المستند",
          body: `تم اكتمال ترجمة طلبك رقم ${request.id} من قبل مكتب الترجمة.`,
        },
      });
    } catch (notifyErr) {
      console.error("notification error (ignored):", notifyErr);
    }

    return NextResponse.json({ ok: true, request: updatedRequest });
  } catch (err) {
    console.error("office complete error:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء تعليم الطلب كمكتمل" },
      { status: 500 }
    );
  }
}
