// app/api/firm-consult/[id]/accept/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export const runtime = "nodejs";

// POST: العميل يقبل عرض المكتب وتُفتح غرفة الجات
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const userId = Number(session.user.id);
    const requestId = Number(params.id);
    if (isNaN(requestId)) return NextResponse.json({ error: "معرف غير صالح." }, { status: 400 });

    // التحقق من الطلب وأن العميل هو صاحبه
    const request = await prisma.firmConsultRequest.findUnique({
      where: { id: requestId },
      include: { offer: true, org: { select: { name: true } } },
    });

    if (!request) return NextResponse.json({ error: "الطلب غير موجود." }, { status: 404 });
    if (request.clientId !== userId) return NextResponse.json({ error: "غير مصرح." }, { status: 403 });
    if (!request.offer) return NextResponse.json({ error: "لا يوجد عرض لقبوله." }, { status: 400 });
    if (request.status !== "OFFER_SENT") {
      return NextResponse.json({ error: "لا يمكن قبول هذا الطلب." }, { status: 400 });
    }

    // قبول العرض + فتح غرفة الجات
    const [, , chatRoom] = await prisma.$transaction([
      prisma.firmConsultOffer.update({
        where: { id: request.offer.id },
        data: { status: "ACCEPTED", respondedAt: new Date() },
      }),
      prisma.firmConsultRequest.update({
        where: { id: requestId },
        data: { status: "ACCEPTED", acceptedAt: new Date() },
      }),
      prisma.firmChatRoom.create({
        data: { requestId },
      }),
    ]);

    // إشعار لمحامي الفرع
    const orgUsers = await prisma.user.findMany({
      where: {
        branchId: request.branchId ?? undefined,
        role: "LAWYER",
      },
      select: { id: true },
    });

    if (orgUsers.length > 0) {
      await prisma.notification.createMany({
        data: orgUsers.map((u) => ({
          userId: u.id,
          title: "تم قبول عرضكم",
          body: `قبل العميل عرضكم على استشارة "${request.subject}" — غرفة المحادثة مفتوحة الآن.`,
        })),
      });
    }

    return NextResponse.json({ ok: true, chatRoomId: chatRoom.id });
  } catch (e: any) {
    console.error("POST /api/firm-consult/[id]/accept error:", e);
    return NextResponse.json({ error: e.message || "حدث خطأ." }, { status: 500 });
  }
}

