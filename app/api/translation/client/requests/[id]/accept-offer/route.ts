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

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    const allowedRoles = ["CLIENT", "COMPANY", "ADMIN"];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { ok: false, error: "ليست لديك صلاحية تأكيد هذا العرض" },
        { status: 403 }
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

    const request = await prisma.translationRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return NextResponse.json(
        { ok: false, error: "الطلب غير موجود" },
        { status: 404 }
      );
    }

    const isOwner = request.clientId === Number(user.id);
    const isAdmin = user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { ok: false, error: "لا يمكنك التحكم بهذا الطلب" },
        { status: 403 }
      );
    }

    if (request.status !== "ACCEPTED") {
      return NextResponse.json(
        {
          ok: false,
          error: "لا يمكن تأكيد العرض في الحالة الحالية للطلب",
        },
        { status: 400 }
      );
    }

    if (request.price == null) {
      return NextResponse.json(
        {
          ok: false,
          error: "لا يوجد عرض سعر مسجَّل يمكن تأكيده",
        },
        { status: 400 }
      );
    }

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

    const updatedRequest = await prisma.translationRequest.update({
      where: { id: request.id },
      data: {
        status: "IN_PROGRESS",
        acceptedAt: new Date(),
      },
    });

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
