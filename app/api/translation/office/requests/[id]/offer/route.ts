 // app/api/translation/office/requests/[id]/offer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// params هنا Promise
type RouteParams = Promise<{ id: string }>;

export async function POST(
  req: NextRequest,
  context: { params: RouteParams }
) {
  try {
    // ===============================
    // 1️⃣ الجلسة
    // ===============================
    const session: any = await getServerSession(authOptions as any);
    const user = session?.user as any;

    if (!user || !user.email) {
      return NextResponse.json(
        { ok: false, error: "غير مصرح." },
        { status: 401 }
      );
    }

    if (user.role !== "TRANSLATION_OFFICE" && user.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "غير مصرح لك بتسعير هذا الطلب." },
        { status: 403 }
      );
    }

    // ===============================
    // 2️⃣ جلب officeId الحقيقي من DB
    // ===============================
    const dbOffice = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true },
    });

    if (!dbOffice) {
      return NextResponse.json(
        { ok: false, error: "مكتب الترجمة غير موجود." },
        { status: 401 }
      );
    }

    const officeId = dbOffice.id; // ✅ الصحيح

    // ===============================
    // 3️⃣ requestId
    // ===============================
    const { id } = await context.params;
    const requestId = Number(id);

    if (!Number.isFinite(requestId) || requestId <= 0) {
      return NextResponse.json(
        { ok: false, error: "رقم الطلب غير صالح." },
        { status: 400 }
      );
    }

    // ===============================
    // 4️⃣ body
    // ===============================
    const body = await req.json();
    const price = Number(body.price);
    const currency = body.currency || "IQD";
    const note =
      typeof body.note === "string" && body.note.trim()
        ? body.note.trim()
        : null;

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { ok: false, error: "السعر غير صالح." },
        { status: 400 }
      );
    }

    // ===============================
    // 5️⃣ الطلب
    // ===============================
    const request = await prisma.translationRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return NextResponse.json(
        { ok: false, error: "الطلب غير موجود." },
        { status: 404 }
      );
    }

    // 🔴 هذا كان سبب 403
    if (request.officeId !== officeId) {
      return NextResponse.json(
        { ok: false, error: "لا يمكنك تسعير طلب لا يخص مكتبك." },
        { status: 403 }
      );
    }

    if (request.status !== "PENDING") {
      return NextResponse.json(
        { ok: false, error: "الطلب ليس بانتظار التسعير." },
        { status: 400 }
      );
    }

    // ===============================
    // 6️⃣ تسجيل العرض
    // ===============================
    await prisma.translationOffer.create({
      data: {
        requestId: request.id,
        officeId,
        price,
        currency,
        note,
      },
    });

    const updatedRequest = await prisma.translationRequest.update({
      where: { id: request.id },
      data: {
        price,
        currency,
        note,
        status: "ACCEPTED",
      },
    });

    // ===============================
    // 7️⃣ إشعار العميل
    // ===============================
    try {
      await prisma.notification.create({
        data: {
          userId: request.clientId,
          title: "عرض جديد لطلب الترجمة",
          body: `قام مكتب الترجمة بتحديد سعر لطلبك رقم ${request.id}.`,
        },
      });
    } catch {}

    return NextResponse.json({ ok: true, request: updatedRequest });
  } catch (err) {
    console.error("office offer error:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء إرسال عرض الترجمة." },
      { status: 500 }
    );
  }
}
