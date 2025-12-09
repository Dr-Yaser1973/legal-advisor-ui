// app/api/translation/office/requests/[id]/complete/route.ts
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

    const body = (await req.json().catch(() => ({}))) as {
      deliveryNote?: string;
    };

    const deliveryNote = body.deliveryNote?.trim();

    const request = await prisma.translationRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return NextResponse.json(
        { ok: false, error: "الطلب غير موجود" },
        { status: 404 }
      );
    }

    if (request.officeId !== Number(user.id)) {
      return NextResponse.json(
        { ok: false, error: "لا يمكنك إنهاء هذا الطلب" },
        { status: 403 }
      );
    }

    if (request.status !== "IN_PROGRESS") {
      return NextResponse.json(
        {
          ok: false,
          error: "لا يمكن إنهاء الطلب لأنه ليس في حالة قيد التنفيذ",
        },
        { status: 400 }
      );
    }

    // نضيف ملاحظات التسليم (إن وجدت) إلى الملاحظة السابقة
    const mergedNote = deliveryNote
      ? request.note
        ? `${request.note}\n\n[ملاحظات التسليم]: ${deliveryNote}`
        : deliveryNote
      : request.note ?? null;

    const updatedRequest = await prisma.translationRequest.update({
      where: { id: request.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        note: mergedNote,
      },
    });

    // إشعار للعميل بأن الترجمة اكتملت
    try {
      await prisma.notification.create({
        data: {
          userId: request.clientId,
          title: "اكتمل طلب الترجمة",
          body: `تم إنجاز ترجمة طلبك رقم ${request.id} من مكتب الترجمة.`,
        },
      });
    } catch (err) {
      console.error("notification error (ignored):", err);
    }

    return NextResponse.json({ ok: true, request: updatedRequest });
  } catch (err) {
    console.error("translation complete error:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء إنهاء الطلب" },
      { status: 500 }
    );
  }
}

