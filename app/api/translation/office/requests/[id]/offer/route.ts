 // app/api/translation/office/requests/[id]/offer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// مهم: params هنا Promise وليس كائن عادي
type RouteParams = Promise<{ id: string }>;

export async function POST(
  req: NextRequest,
  context: { params: RouteParams }
) {
  try {
    const session: any = await getServerSession(authOptions as any);
    const user = session?.user as any;

    // فقط مكتب الترجمة أو الأدمن يمكنه تسعير الطلب
    if (!user || (user.role !== "TRANSLATION_OFFICE" && user.role !== "ADMIN")) {
      return NextResponse.json(
        { ok: false, error: "غير مصرح لك بتسعير هذا الطلب." },
        { status: 401 }
      );
    }

    // ✅ نفك الـ Promise ونأخذ id الحقيقي
    const { id } = await context.params;
    const requestId = Number(id);

    if (!Number.isFinite(requestId) || requestId <= 0) {
      return NextResponse.json(
        { ok: false, error: "رقم الطلب غير صالح." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const price = Number(body.price);
    const currency: string = body.currency || "IQD";
    const note: string | null =
      typeof body.note === "string" && body.note.trim()
        ? body.note.trim()
        : null;

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { ok: false, error: "السعر غير صالح." },
        { status: 400 }
      );
    }

    const officeId = Number(user.id);

    const request = await prisma.translationRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return NextResponse.json(
        { ok: false, error: "الطلب غير موجود." },
        { status: 404 }
      );
    }

    // تأكيد أن هذا الطلب يخص هذا المكتب
    if (request.officeId !== officeId) {
      return NextResponse.json(
        { ok: false, error: "لا يمكنك تسعير طلب لا يخص مكتبك." },
        { status: 403 }
      );
    }

    // يجب أن يكون الطلب في حالة PENDING
    if (request.status !== "PENDING") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "لا يمكن تسعير الطلب لأنه ليس في حالة بانتظار القبول (PENDING).",
        },
        { status: 400 }
      );
    }

    // تسجيل العرض في TranslationOffer (سجل تاريخي)
    await prisma.translationOffer.create({
      data: {
        requestId: request.id,
        officeId,
        price,
        currency,
        note,
      },
    });

    // تحديث الطلب نفسه بالسعر والملاحظة والحالة ACCEPTED
    const updatedRequest = await prisma.translationRequest.update({
      where: { id: request.id },
      data: {
        price,
        currency,
        note,
        status: "ACCEPTED", // المكتب حدّد السعر، بانتظار موافقة العميل
      },
    });

    // إشعار للعميل بوجود عرض من المكتب
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
    console.error("office offer error:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء إرسال عرض الترجمة." },
      { status: 500 }
    );
  }
}
