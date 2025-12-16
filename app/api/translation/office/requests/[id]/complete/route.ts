 // app/api/translation/office/requests/[id]/complete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteParams = Promise<{ id: string }>;

export async function POST(
  req: NextRequest,
  context: { params: RouteParams }
) {
  try {
    // نفك الـ Promise الخاص بالـ params
    const { id } = await context.params;
    const requestId = Number(id);

    const session = (await getServerSession(authOptions as any)) as any;
    const user = session?.user as any;

    // فقط مكتب الترجمة
    if (!user || user.role !== "TRANSLATION_OFFICE") {
      return NextResponse.json(
        { ok: false, error: "ليست لديك صلاحية إكمال هذا الطلب." },
        { status: 401 }
      );
    }

    if (!Number.isFinite(requestId) || requestId <= 0) {
      return NextResponse.json(
        { ok: false, error: "رقم الطلب غير صالح." },
        { status: 400 }
      );
    }

    const request = await prisma.translationRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return NextResponse.json(
        { ok: false, error: "الطلب غير موجود." },
        { status: 404 }
      );
    }

    if (request.officeId !== Number(user.id)) {
      return NextResponse.json(
        { ok: false, error: "لا يمكنك إكمال طلب لا يخص مكتبك." },
        { status: 403 }
      );
    }

    // يجب أن يكون قيد التنفيذ بعد موافقة العميل على العرض
    if (request.status !== "IN_PROGRESS") {
      return NextResponse.json(
        {
          ok: false,
          error: "لا يمكن وضع الطلب كمكتمل لأنه ليس في حالة قيد الترجمة.",
        },
        { status: 400 }
      );
    }

    // نقرأ ملاحظات التسليم من الـ body (اختياري)
    let deliveryNote: string | null = null;
    try {
      const body = await req.json();
      if (typeof body?.deliveryNote === "string") {
        deliveryNote = body.deliveryNote.trim() || null;
      }
    } catch {
      // لو ماكو body أو ليس JSON نتجاهله
      deliveryNote = null;
    }

    const updated = await prisma.translationRequest.update({
      where: { id: request.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        // نخزن ملاحظات التسليم في note مع الحفاظ على الملاحظة القديمة إن وجدت
        note:
          deliveryNote != null
            ? `${request.note ?? ""}\n\n[تسليم]: ${deliveryNote}`.trim()
            : request.note ?? undefined,
      },
    });

    // إشعار العميل أن الطلب اكتمل
    try {
      await prisma.notification.create({
        data: {
          userId: request.clientId,
          title: "اكتمال طلب الترجمة",
          body: `تم إكمال ترجمة طلبك رقم ${request.id}.`,
        },
      });
    } catch (notifyErr) {
      console.error("notification error (ignored):", notifyErr);
    }

    return NextResponse.json({
      ok: true,
      request: updated,
      message: "تم إنهاء الطلب بنجاح.",
    });
  } catch (err) {
    console.error("office complete error:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء تحديد الطلب كمكتمل." },
      { status: 500 }
    );
  }
}
