 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 🔥 لازم await بسبب Next.js 16
    const { id } = await context.params;

    const requestId = Number(id);
    if (!Number.isFinite(requestId) || requestId <= 0) {
      return NextResponse.json(
        { error: "معرّف الطلب غير صالح." },
        { status: 400 }
      );
    }

    const session: any = await getServerSession(authOptions as any);
    const userId = session?.user?.id ? Number(session.user.id) : null;

    if (!session || !userId) {
      return NextResponse.json(
        { error: "غير مصرح. يرجى تسجيل الدخول." },
        { status: 401 }
      );
    }

    // تأكد أن المستخدم محامٍ أو أدمِن
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user || (user.role !== UserRole.LAWYER && user.role !== UserRole.ADMIN)) {
      return NextResponse.json(
        { error: "لا تملك صلاحية لتقديم عرض على هذا الطلب." },
        { status: 403 }
      );
    }

    const requestObj = await prisma.humanConsultRequest.findUnique({
      where: { id: requestId },
    });

    if (!requestObj) {
      return NextResponse.json(
        { error: "لم يتم العثور على طلب الاستشارة." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const fee = Number(body?.fee ?? 0);
    const currency = (body?.currency || "IQD").toString();
    const note = body?.note ? String(body.note) : null;

    if (!Number.isFinite(fee) || fee <= 0) {
      return NextResponse.json(
        { error: "أجر الاستشارة (fee) مطلوب ويجب أن يكون رقمًا موجبًا." },
        { status: 400 }
      );
    }

    // لو المحامي سبق أن قدّم عرضًا
    const existing = await prisma.humanConsultOffer.findFirst({
      where: { requestId, lawyerId: userId },
    });

    let offer;

    if (existing) {
      offer = await prisma.humanConsultOffer.update({
        where: { id: existing.id },
        data: { fee, currency, note },
      });
    } else {
      offer = await prisma.humanConsultOffer.create({
        data: { requestId, lawyerId: userId, fee, currency, note },
      });
    }

    return NextResponse.json({ ok: true, offer }, { status: 200 });
  } catch (err) {
    console.error("Offer API Error:", err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إرسال عرض الاستشارة." },
      { status: 500 }
    );
  }
}
