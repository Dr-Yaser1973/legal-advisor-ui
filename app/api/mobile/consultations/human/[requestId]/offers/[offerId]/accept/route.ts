//app/api/mobile/consultations/human/[requestId]/offers/[offerId]/accept/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/jwt";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ requestId: string; offerId: string }> }
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    const payload: any = await verifyUserToken(authHeader.split(" ")[1]);
    const clientId = Number(payload.sub);

    const { requestId: reqId, offerId: offId } = await context.params;
    const requestId = Number(reqId);
    const offerId = Number(offId);

    if (Number.isNaN(requestId) || Number.isNaN(offerId)) {
      return NextResponse.json({ error: "معرّف غير صالح." }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const request = await tx.humanConsultRequest.findUnique({
        where: { id: requestId },
        include: { chatRoom: true },
      });

      if (!request) throw new Error("NOT_FOUND_REQUEST");
      if (request.clientId !== clientId) throw new Error("NOT_OWNER");
      if (request.status === "COMPLETED" || request.status === "CANCELED")
        throw new Error("ALREADY_FINISHED");
      if (request.lawyerId && request.status === "ACCEPTED")
        throw new Error("ALREADY_ACCEPTED");

      const offer = await tx.humanConsultOffer.findUnique({ where: { id: offerId } });
      if (!offer || offer.requestId !== requestId) throw new Error("NOT_FOUND_OFFER");
      if (offer.status !== "PENDING") throw new Error("OFFER_NOT_PENDING");

      const lawyerId = offer.lawyerId;

      await tx.humanConsultOffer.update({
        where: { id: offerId },
        data: { status: "ACCEPTED_BY_CLIENT" },
      });
      await tx.humanConsultOffer.updateMany({
        where: { requestId, id: { not: offerId }, status: "PENDING" },
        data: { status: "REJECTED" },
      });
      const updatedRequest = await tx.humanConsultRequest.update({
        where: { id: requestId },
        data: { lawyerId, status: "ACCEPTED", acceptedAt: new Date() },
      });

      let room = request.chatRoom;
      if (!room) {
        room = await tx.chatRoom.create({
          data: { requestId, clientId, lawyerId },
        });
      }
      return { request: updatedRequest, room };
    });

    return NextResponse.json({
      ok: true,
      message: "تم اختيار المحامي وفتح غرفة المحادثة.",
      room: result.room,
    });
  } catch (error: any) {
    console.error("mobile accept offer error:", error);
    const map: Record<string, [string, number]> = {
      NOT_FOUND_REQUEST: ["لم يتم العثور على الطلب.", 404],
      NOT_OWNER: ["لا تملك صلاحية على هذا الطلب.", 403],
      ALREADY_FINISHED: ["لا يمكن تعديل طلب منهٍ أو ملغى.", 400],
      ALREADY_ACCEPTED: ["تم اختيار محامٍ مسبقاً.", 400],
      NOT_FOUND_OFFER: ["لم يتم العثور على العرض.", 404],
      OFFER_NOT_PENDING: ["لا يمكن قبول هذا العرض.", 400],
    };
    const entry = map[error?.message];
    if (entry) return NextResponse.json({ error: entry[0] }, { status: entry[1] });
    return NextResponse.json({ error: "حدث خطأ أثناء قبول العرض." }, { status: 500 });
  }
}
