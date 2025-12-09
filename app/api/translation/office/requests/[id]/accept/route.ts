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
    // 👈 مكتب الترجمة فقط
    const session = (await getServerSession(authOptions as any)) as any;
    const user = session?.user as any;

    if (!user || user.role !== "TRANSLATION_OFFICE") {
      return NextResponse.json(
        { ok: false, error: "غير مصرح لمكتب الترجمة" },
        { status: 401 }
      );
    }

    // 👈 نقرأ id من params بشكل صحيح
    const requestId = Number(params.id);
    if (!Number.isFinite(requestId) || requestId <= 0) {
      return NextResponse.json(
        { ok: false, error: "رقم الطلب غير صالح" },
        { status: 400 }
      );
    }

    // 👈 بيانات العرض (السعر + العملة + الملاحظة)
    const body = await req.json();
    const price = Number(body.price);
    const currency: string = body.currency || "IQD";
    const note: string | null =
      typeof body.note === "string" && body.note.trim()
        ? body.note.trim()
        : null;

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { ok: false, error: "السعر غير صالح" },
        { status: 400 }
      );
    }

    const officeId = Number(user.id);

    // 👈 نحضر الطلب من قاعدة البيانات
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
        { ok: false, error: "لا يمكنك تسعير هذا الطلب" },
        { status: 403 }
      );
    }

    if (request.status !== "PENDING") {
      return NextResponse.json(
        {
          ok: false,
          error: "لا يمكن تسعير الطلب لأنه ليس في حالة بانتظار التسعير",
        },
        { status: 400 }
      );
    }

    // 👈 نسجّل العرض في TranslationOffer (تاريخياً)
    await prisma.translationOffer.create({
      data: {
        requestId: request.id,
        officeId,
        price,
        currency,
        note,
      },
    });

    // 👈 نخزن السعر والملاحظة داخل TranslationRequest ليسهل على العميل
    const updatedRequest = await prisma.translationRequest.update({
      where: { id: request.id },
      data: {
        price,
        currency,
        note,
        status: "ACCEPTED",
      },
    });

    // 👈 إشعار للعميل بوجود عرض جديد (اختياري)
    try {
      await prisma.notification.create({
        data: {
          userId: request.clientId,
          title: "عرض جديد لطلب الترجمة",
          body: `قام مكتب الترجمة بتحديد سعر لطلبك رقم ${request.id}.`,
        },
      });
    } catch (notifyErr) {
      console.error("notification error (ignored):", notifyErr);
    }

    return NextResponse.json({ ok: true, request: updatedRequest });
  } catch (err) {
    console.error("office accept error:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء تسعير الطلب" },
      { status: 500 }
    );
  }
}
