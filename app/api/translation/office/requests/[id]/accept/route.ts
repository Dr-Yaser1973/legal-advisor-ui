 import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requestId = Number(id);

    if (!requestId || Number.isNaN(requestId)) {
      return NextResponse.json(
        { ok: false, error: "معرّف الطلب غير صالح" },
        { status: 400 }
      );
    }

    const session = (await getServerSession(authOptions as any)) as any;
    const user = session?.user as any;

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    if (user.role !== "TRANSLATION_OFFICE" || !user.status) {
      return NextResponse.json(
        { ok: false, error: "ليست لديك صلاحية قبول طلبات الترجمة الرسمية" },
        { status: 403 }
      );
    }

    const officeId = Number(user.id);
    if (!officeId || Number.isNaN(officeId)) {
      return NextResponse.json(
        { ok: false, error: "هوية مكتب الترجمة غير صالحة" },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({} as any));
    const price = Number(body.price);
    const currency = (body.currency as string) || "IQD";
    const note = (body.note as string) || "";

    if (!price || Number.isNaN(price) || price <= 0) {
      return NextResponse.json(
        { ok: false, error: "يرجى إدخال سعر صحيح" },
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

    if (request.officeId !== officeId || request.status !== "PENDING") {
      return NextResponse.json(
        { ok: false, error: "لا يمكن قبول هذا الطلب" },
        { status: 400 }
      );
    }

    const updated = await prisma.translationRequest.update({
      where: { id: requestId },
      data: {
        status: "ACCEPTED",
      },
    });

    // TranslationOffer حسب سكيمتك
    await prisma.translationOffer.create({
      data: {
        requestId: requestId,
        officeId: officeId,
        price,
        currency,
        note,
      },
    });

    // Notification حسب سكيمتك
    await prisma.notification.create({
      data: {
        userId: request.clientId,
        title: "تم قبول طلب الترجمة الرسمية",
        body: `تم قبول طلب ترجمة المستند رقم ${request.sourceDocId} من مكتب الترجمة، بسعر ${price} ${currency}.`,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "تم قبول الطلب، ولن يظهر بعد الآن في قائمة الطلبات المتاحة.",
      request: updated,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ داخلي أثناء قبول الطلب" },
      { status: 500 }
    );
  }
}
