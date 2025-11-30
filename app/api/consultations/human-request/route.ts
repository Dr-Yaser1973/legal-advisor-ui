 // app/api/consultations/human-request/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { HumanConsultStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول لإرسال طلب استشارة." },
        { status: 401 }
      );
    }

    const userId = Number(session.user.id);
    const body = await req.json();

    const topic = (body?.topic || "").trim();
    const details = (body?.details || "").trim();

    if (!topic || !details) {
      return NextResponse.json(
        { error: "يرجى إدخال موضوع الاستشارة وتفاصيلها." },
        { status: 400 }
      );
    }

    // 1️⃣ إنشاء Consultation مرتبطة بالمستخدم
    const consultation = await prisma.consultation.create({
      data: {
        userId,
        title: topic,
        description: details,
      },
    });

    // 2️⃣ إنشاء HumanConsultRequest يربط بهذه الاستشارة
    const created = await prisma.humanConsultRequest.create({
      data: {
        consultationId: consultation.id,
        clientId: userId,
        status: HumanConsultStatus.PENDING,
      },
    });

    return NextResponse.json({
      id: created.id,
      message:
        "تم تسجيل طلب الاستشارة بنجاح، وسيتم إشعارك عند قبول أحد المحامين.",
    });
  } catch (error) {
    console.error("Error in /api/consultations/human-request:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إرسال طلب الاستشارة." },
      { status: 500 }
    );
  }
}
