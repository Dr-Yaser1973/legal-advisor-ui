 // app/api/translation/client/requests/[id]/accept-offer/route.ts
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

    // 1) تأكد أن المستخدم مسجَّل دخول
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    // 2) فقط العميل (أو الشركة) هو من يؤكد العرض
    if (user.role !== "CLIENT" && user.role !== "COMPANY") {
      return NextResponse.json(
        { ok: false, error: "ليست لديك صلاحية تأكيد هذا العرض" },
        { status: 403 }
      );
    }

    const requestId = Number(params.id);
    if (!Number.isFinite(requestId) || requestId <= 0) {
      return NextResponse.json(
        { ok: false, error: "رقم الطلب غير صالح" },
        { status: 400 }
      );
    }

    // 3) نجلب طلب الترجمة
    const request = await prisma.translationRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return NextResponse.json(
        { ok: false, error: "الطلب غير موجود" },
        { status: 404 }
      );
    }

    // تأكد أن هذا الطلب ملك لهذا العميل
    if (request.clientId !== Number(user.id)) {
      return NextResponse.json(
        { ok: false, error: "لا يمكنك التحكم بهذا الطلب" },
        { status: 403 }
      );
    }

    // يجب أن يكون المكتب قد وضع السعر (ACCEPTED عندنا = تم التسعير من المكتب)
    if (request.status !== "ACCEPTED") {
      return NextResponse.json(
        {
          ok: false,
          error: "لا يمكن تأكيد العرض في الحالة الحالية للطلب",
        },
        { status: 400 }
      );
    }

    if (!request.price) {
      return NextResponse.json(
        {
          ok: false,
          error: "لا يوجد عرض سعر مسجَّل يمكن تأكيده",
        },
        { status: 400 }
      );
    }

    // 4) آخر عرض من المكتب (اختياري لكن منطقي)
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

    // 5) تحويل حالة الطلب إلى IN_PROGRESS وتسجيل وقت القبول
    const updatedRequest = await prisma.translationRequest.update({
      where: { id: request.id },
      data: {
        status: "IN_PROGRESS",
        acceptedAt: new Date(),
      },
    });

    // 6) إشعار مكتب الترجمة بأن العميل وافق على العرض
    if (request.officeId) {
      try {
        await prisma.notification.create({
          data: {
            userId: request.officeId,
            title: "موافقة العميل على عرض الترجمة",
            body: `قام العميل بالموافقة على عرض طلب الترجمة رقم ${request.id}، ويمكنك البدء في التنفيذ.`,
          },
        });
      } catch (notifyErr) {
        console.error("notification error (ignored):", notifyErr);
      }
    }

    return NextResponse.json({ ok: true, request: updatedRequest });
  } catch (err) {
    console.error("client accept-offer error:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء تأكيد الموافقة على العرض" },
      { status: 500 }
    );
  }
}
