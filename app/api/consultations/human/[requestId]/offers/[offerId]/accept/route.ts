 // app/api/consultations/human/[requestId]/offers/[offerId]/accept/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  context: { params: Promise<{ requestId: string; offerId: string }> }
) {
  try {
    // 🔥 هنا الأهم: await للـ params
    const { requestId: reqId, offerId: offId } = await context.params;

    const requestId = Number(reqId);
    const offerId = Number(offId);

    if (Number.isNaN(requestId) || Number.isNaN(offerId)) {
      return NextResponse.json(
        { error: "معرّف الطلب أو العرض غير صالح." },
        { status: 400 }
      );
    }

    const session: any = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "غير مصرح. يرجى تسجيل الدخول." },
        { status: 401 }
      );
    }

    const clientId = Number(session.user.id);

    // نستخدم ترانزاكشن لضمان التناسق بين الطلب والعروض وغرفة الشات
    const result = await prisma.$transaction(async (tx) => {
      // 1) جلب طلب الاستشارة والتأكد أنه تابع لهذا المستخدم
      const request = await tx.humanConsultRequest.findUnique({
        where: { id: requestId },
        include: {
          chatRoom: true,
        },
      });

      if (!request) {
        throw new Error("NOT_FOUND_REQUEST");
      }

      if (request.clientId !== clientId) {
        throw new Error("NOT_OWNER");
      }

      if (request.status === "COMPLETED" || request.status === "CANCELED") {
        throw new Error("ALREADY_FINISHED");
      }

      if (request.lawyerId && request.status === "ACCEPTED") {
        throw new Error("ALREADY_ACCEPTED");
      }

      // 2) جلب العرض والتأكد أنه تابع لنفس الطلب
      const offer = await tx.humanConsultOffer.findUnique({
        where: { id: offerId },
      });

      if (!offer || offer.requestId !== requestId) {
        throw new Error("NOT_FOUND_OFFER");
      }

      if (offer.status !== "PENDING") {
        throw new Error("OFFER_NOT_PENDING");
      }

      const lawyerId = offer.lawyerId;

      // 3) تحديث حالة العرض المختار
      await tx.humanConsultOffer.update({
        where: { id: offerId },
        data: {
          status: "ACCEPTED_BY_CLIENT",
        },
      });

      // 4) رفض بقية العروض المعلّقة لنفس الطلب
      await tx.humanConsultOffer.updateMany({
        where: {
          requestId,
          id: { not: offerId },
          status: "PENDING",
        },
        data: {
          status: "REJECTED",
        },
      });

      // 5) ربط الطلب بالمحامي وتحديث الحالة
      const updatedRequest = await tx.humanConsultRequest.update({
        where: { id: requestId },
        data: {
          lawyerId,
          status: "ACCEPTED",
          acceptedAt: new Date(),
        },
      });

      // 6) إنشاء غرفة محادثة إذا لم تكن موجودة
      let room = request.chatRoom;

      if (!room) {
        room = await tx.chatRoom.create({
          data: {
            requestId,
            clientId,
            lawyerId,
          },
        });
      }

      return {
        request: updatedRequest,
        room,
      };
    });

    return NextResponse.json(
      {
        message: "تم اختيار المحامي وفتح غرفة المحادثة بنجاح.",
        request: result.request,
        room: result.room,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      "Error in /api/consultations/human/[requestId]/offers/[offerId]/accept:",
      error
    );

    if (error instanceof Error) {
      if (error.message === "NOT_FOUND_REQUEST") {
        return NextResponse.json(
          { error: "لم يتم العثور على طلب الاستشارة." },
          { status: 404 }
        );
      }
      if (error.message === "NOT_OWNER") {
        return NextResponse.json(
          { error: "لا تملك صلاحية على هذا الطلب." },
          { status: 403 }
        );
      }
      if (error.message === "ALREADY_FINISHED") {
        return NextResponse.json(
          { error: "لا يمكن تعديل طلب منهي أو ملغى." },
          { status: 400 }
        );
      }
      if (error.message === "ALREADY_ACCEPTED") {
        return NextResponse.json(
          { error: "تم اختيار محامٍ لهذا الطلب مسبقًا." },
          { status: 400 }
        );
      }
      if (error.message === "NOT_FOUND_OFFER") {
        return NextResponse.json(
          { error: "لم يتم العثور على العرض المطلوب." },
          { status: 404 }
        );
      }
      if (error.message === "OFFER_NOT_PENDING") {
        return NextResponse.json(
          { error: "لا يمكن قبول عرض حالته ليست قيد الانتظار." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "حدث خطأ أثناء قبول عرض الاستشارة." },
      { status: 500 }
    );
  }
}
