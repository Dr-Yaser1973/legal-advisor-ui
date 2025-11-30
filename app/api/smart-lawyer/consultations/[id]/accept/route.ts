// app/api/lawyer/consultations/[id]/accept/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

type Context = {
  params: { id: string };
};

export async function POST(req: Request, { params }: Context) {
  try {
    const session: any = await getServerSession(authOptions as any);
    const role = session?.user?.role ?? "CLIENT";
    const lawyerIdRaw = session?.user?.id;
    const lawyerId = lawyerIdRaw ? Number(lawyerIdRaw) : null;

    if (!session || role !== "LAWYER" || !lawyerId) {
      return NextResponse.json(
        { error: "فقط المحامون المسجلون يمكنهم قبول الاستشارات." },
        { status: 403 },
      );
    }

    const reqId = Number(params.id);
    if (!Number.isInteger(reqId)) {
      return NextResponse.json(
        { error: "معرّف طلب الاستشارة غير صالح." },
        { status: 400 },
      );
    }

    const request = await prisma.humanConsultRequest.findUnique({
      where: { id: reqId },
      include: {
        consultation: true,
        client: true,
      },
    });

    if (!request) {
      return NextResponse.json(
        { error: "طلب الاستشارة غير موجود." },
        { status: 404 },
      );
    }

    if (request.status !== "PENDING") {
      return NextResponse.json(
        { error: "تم التعامل مع هذا الطلب مسبقًا." },
        { status: 400 },
      );
    }

    // نحدث حالة الطلب ونعين المحامي
    const updated = await prisma.humanConsultRequest.update({
      where: { id: reqId },
      data: {
        status: "ACCEPTED",
        lawyerId,
        acceptedAt: new Date(),
      },
    });

    // ننشئ غرفة محادثة
    const chatRoom = await prisma.chatRoom.create({
      data: {
        requestId: updated.id,
        clientId: request.clientId,
        lawyerId,
      },
    });

    // إعلام الأدمنين بقبول الاستشارة
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    });

    if (admins.length > 0) {
      await prisma.notification.createMany({
        data: admins.map((a) => ({
          userId: a.id,
          title: "تم قبول استشارة من محامٍ",
          body: `المحامي قبل استشارة بعنوان: "${request.consultation.title}"`,
        })),
      });
    }

    return NextResponse.json({
      ok: true,
      requestId: updated.id,
      chatRoomId: chatRoom.id,
    });
  } catch (e: any) {
    console.error("lawyer/consultations/[id]/accept error:", e);
    return NextResponse.json(
      { error: e?.message ?? "فشل قبول الاستشارة." },
      { status: 500 },
    );
  }
}

