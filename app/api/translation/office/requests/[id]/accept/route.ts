 // app/api/translation/office/requests/[id]/accept/route.ts
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

    if (!user || user.role !== "TRANSLATION_OFFICE") {
      return NextResponse.json(
        { ok: false, error: "غير مصرح" },
        { status: 401 }
      );
    }

    const requestId = Number(params.id);
    if (!requestId || Number.isNaN(requestId) || requestId <= 0) {
      return NextResponse.json(
        { ok: false, error: "رقم الطلب غير صالح" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const price = Number(body.price);
    const currency: string = body.currency || "IQD";
    const note: string | null = body.note || null;

    if (!price || Number.isNaN(price) || price < 0) {
      return NextResponse.json(
        { ok: false, error: "السعر غير صالح" },
        { status: 400 }
      );
    }

    const officeId = Number(user.id);

    // الطلب
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
        { ok: false, error: "لا يمكنك قبول هذا الطلب" },
        { status: 403 }
      );
    }

    // إنشاء عرض جديد في TranslationOffer
    await prisma.translationOffer.create({
      data: {
        requestId: request.id,
        officeId,
        price,
        currency,
        note,
        // status يبقى PENDING لغاية موافقة العميل
      },
    });

    // تخزين السعر والملاحظة داخل TranslationRequest نفسه
    const updatedRequest = await prisma.translationRequest.update({
      where: { id: request.id },
      data: {
        price,
        currency,
        note,
        status: "ACCEPTED",
      },
    });

    // إشعار للعميل بوجود عرض جديد
    try {
      await prisma.notification.create({
        data: {
          userId: request.clientId,
          title: "عرض جديد لطلب الترجمة",
          body: `قام مكتب الترجمة بتحديد سعر لطلبك رقم ${request.id}.`,
        },
      });
    } catch (err) {
      console.error("notification error (ignored):", err);
    }

    return NextResponse.json({ ok: true, request: updatedRequest });
  } catch (err) {
    console.error("translation office accept error:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء قبول الطلب" },
      { status: 500 }
    );
  }
}
