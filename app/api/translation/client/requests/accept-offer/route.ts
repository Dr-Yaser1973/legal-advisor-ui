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

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    const clientId = Number(user.id);
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

    if (request.clientId !== clientId) {
      return NextResponse.json(
        { ok: false, error: "لا يمكنك الموافقة على هذا الطلب" },
        { status: 403 }
      );
    }

    if (request.status !== "ACCEPTED") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "لا يمكن تأكيد الموافقة لأن الطلب ليس في حالة تم تسعيره من مكتب الترجمة",
        },
        { status: 400 }
      );
    }

    if (!request.price) {
      return NextResponse.json(
        {
          ok: false,
          error: "لا يوجد سعر مسجّل لهذا الطلب، لا يمكن تأكيد الموافقة",
        },
        { status: 400 }
      );
    }

    const updated = await prisma.translationRequest.update({
      where: { id: requestId },
      data: {
        status: "IN_PROGRESS",
        acceptedAt: new Date(),
      },
    });

    // إشعار اختياري لمكتب الترجمة ببدء العمل
    if (request.officeId) {
      try {
        await prisma.notification.create({
          data: {
            userId: request.officeId,
            title: "تأكيد موافقة العميل على عرض الترجمة",
            body: `قام العميل بالموافقة على عرض طلب الترجمة رقم ${request.id}، ويمكنك البدء في تنفيذ الترجمة.`,
          },
        });
      } catch (err) {
        console.error("notification error (ignored):", err);
      }
    }

    return NextResponse.json({ ok: true, request: updated });
  } catch (err) {
    console.error("client accept-offer error:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء تأكيد الموافقة على العرض" },
      { status: 500 }
    );
  }
}
