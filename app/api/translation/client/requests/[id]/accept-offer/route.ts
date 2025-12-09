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
        { ok: false, error: "غير مصرح" },
        { status: 401 }
      );
    }

    const requestId = Number(params.id);
    if (!requestId || Number.isNaN(requestId)) {
      return NextResponse.json(
        { ok: false, error: "رقم الطلب غير صالح" },
        { status: 400 }
      );
    }

    // الطلب الخاص بالعميل
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
        { ok: false, error: "لا يمكنك التحكم بهذا الطلب" },
        { status: 403 }
      );
    }

    if (request.status !== "ACCEPTED") {
      return NextResponse.json(
        { ok: false, error: "لا يمكن قبول العرض في هذه الحالة الحالية للطلب" },
        { status: 400 }
      );
    }

    if (!request.price) {
      return NextResponse.json(
        { ok: false, error: "لا يوجد عرض سعر مسجّل يمكن قبوله" },
        { status: 400 }
      );
    }

    // إيجاد آخر عرض (اختياري لكن منطقي)
    const latestOffer = await prisma.translationOffer.findFirst({
      where: { requestId },
      orderBy: { createdAt: "desc" },
    });

    if (latestOffer) {
      await prisma.translationOffer.update({
        where: { id: latestOffer.id },
        data: { status: "ACCEPTED_BY_CLIENT" },
      });
    }

    // تحويل حالة الطلب إلى IN_PROGRESS وتسجيل وقت القبول
    const updatedRequest = await prisma.translationRequest.update({
      where: { id: request.id },
      data: {
        status: "IN_PROGRESS",
        acceptedAt: new Date(),
      },
    });

    // إشعار لمكتب الترجمة
    if (request.officeId) {
      try {
        await prisma.notification.create({
          data: {
            userId: request.officeId,
            title: "موافقة العميل على عرض الترجمة",
            body: `قام العميل بالموافقة على عرض طلب الترجمة رقم ${request.id}، ويمكنك البدء في تنفيذ الترجمة.`,
          },
        });
      } catch (notifyErr) {
        console.error("notification error (ignored):", notifyErr);
      }
    }

    return NextResponse.json({ ok: true, request: updatedRequest });
  } catch (err) {
    console.error("client accept offer error:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء تأكيد قبول العرض" },
      { status: 500 }
    );
  }
}

