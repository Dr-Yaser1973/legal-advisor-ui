 import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // ===============================
    // 1️⃣ التحقق من الجلسة
    // ===============================
    const session = (await getServerSession(authOptions as any)) as any;
    const user = session?.user as any;

    if (!user || !user.email) {
      return NextResponse.json(
        { ok: false, error: "يجب تسجيل الدخول." },
        { status: 401 }
      );
    }

    // ===============================
    // 2️⃣ قراءة البيانات
    // ===============================
    const body = await req.json();
    const requestId = Number(body?.requestId);

    if (!Number.isFinite(requestId) || requestId <= 0) {
      return NextResponse.json(
        { ok: false, error: "رقم الطلب غير صالح." },
        { status: 400 }
      );
    }

    // ===============================
    // 3️⃣ جلب المستخدم الحقيقي من DB (المفتاح الصحيح)
    // ===============================
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json(
        { ok: false, error: "المستخدم غير موجود." },
        { status: 403 }
      );
    }

    const clientId = dbUser.id;

    // ===============================
    // 4️⃣ جلب الطلب
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

    // ===============================
    // 5️⃣ التحقق أن الطلب يخص هذا العميل
    // ===============================
    if (request.clientId !== clientId) {
      return NextResponse.json(
        { ok: false, error: "لا يمكنك الموافقة على طلب لا يخصك." },
        { status: 403 }
      );
    }

    // ===============================
    // 6️⃣ يجب أن يكون الطلب في حالة ACCEPTED
    // ===============================
    if (request.status !== "ACCEPTED") {
      return NextResponse.json(
        {
          ok: false,
          error: "لا يمكن الموافقة على الطلب في حالته الحالية.",
        },
        { status: 400 }
      );
    }

    // ===============================
    // 7️⃣ تحديث الحالة إلى IN_PROGRESS
    // ===============================
    const updated = await prisma.translationRequest.update({
      where: { id: requestId },
      data: {
        status: "IN_PROGRESS",
        acceptedAt: new Date(),
      },
    });

    return NextResponse.json({
      ok: true,
      request: updated,
      message: "تمت الموافقة على عرض مكتب الترجمة وبدء التنفيذ.",
    });
  } catch (err) {
    console.error("accept-offer error:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ داخلي في الخادم." },
      { status: 500 }
    );
  }
}
