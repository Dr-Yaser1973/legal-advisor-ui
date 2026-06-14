 // app/api/consultations/human-request/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { HumanConsultStatus } from "@prisma/client";
 import { notifyUser } from "@/lib/notify";

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

    // 3️⃣ إشعار المحامين المعتمدين بوجود طلب جديد (best-effort)
    // لا نُسقط نجاح الطلب إن فشل الإشعار
    try {
      const lawyers = await prisma.user.findMany({
        where: {
          role: "LAWYER",
          isApproved: true,
          status: "ACTIVE",
          email: { not: null },
        },
        select: { id: true },
      });

      await Promise.allSettled(
        lawyers.map((l) =>
          notifyUser({
            userId: l.id,
            title: "طلب استشارة جديد",
            body: `وصل طلب جديد يمكنك تقديم عرض عليه: ${topic}`,
            emailKind: "new_request",
            emailData: {
              subject: topic,
              consultUrl: "/dashboard/requests",
            },
          })
        )
      );
    } catch (notifyError) {
      console.error("فشل إشعار المحامين بالطلب الجديد:", notifyError);
    }

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