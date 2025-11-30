 import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    const user = session?.user as any;

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    const clientId = Number(user.id);
    if (!clientId || Number.isNaN(clientId)) {
      return NextResponse.json(
        { ok: false, error: "معرّف المستخدم غير صالح" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const officeId = Number(body.officeId);
    const sourceDocId = Number(body.documentId);
    const targetLang = body.targetLang === "AR" ? "AR" : "EN";

    if (!officeId || Number.isNaN(officeId) || !sourceDocId || Number.isNaN(sourceDocId)) {
      return NextResponse.json(
        { ok: false, error: "بيانات الطلب غير مكتملة" },
        { status: 400 }
      );
    }

    const request = await prisma.translationRequest.create({
      data: {
        clientId,
        officeId,
        sourceDocId,
        targetLang,
        status: "PENDING",
      },
    });

    return NextResponse.json({ ok: true, requestId: request.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "خطأ داخلي في الخادم أثناء إنشاء الطلب" },
      { status: 500 }
    );
  }
}
