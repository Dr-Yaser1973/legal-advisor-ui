//app/api/mobile/consultations/human-request/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/jwt";
import { HumanConsultStatus } from "@prisma/client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    const payload: any = await verifyUserToken(authHeader.split(" ")[1]);
    const userId = Number(payload.sub);

    const body = await req.json();
    const topic = (body?.topic || "").trim();
    const details = (body?.details || "").trim();

    if (!topic || !details) {
      return NextResponse.json(
        { error: "يرجى إدخال موضوع الاستشارة وتفاصيلها." },
        { status: 400 }
      );
    }

    const consultation = await prisma.consultation.create({
      data: { userId, title: topic, description: details },
    });

    const created = await prisma.humanConsultRequest.create({
      data: {
        consultationId: consultation.id,
        clientId: userId,
        status: HumanConsultStatus.PENDING,
      },
    });

    return NextResponse.json({
      ok: true,
      id: created.id,
      message: "تم تسجيل طلب الاستشارة، وسيتم إشعارك عند تقديم العروض.",
    });
  } catch (error) {
    console.error("mobile human-request error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء إرسال الطلب." }, { status: 500 });
  }
}
