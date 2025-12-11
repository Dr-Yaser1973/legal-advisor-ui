 // app/api/translation/requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    const user = session?.user as any;

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "يجب تسجيل الدخول قبل طلب الترجمة الرسمية." },
        { status: 401 }
      );
    }

    const clientId = Number(user.id);
    if (!Number.isFinite(clientId) || clientId <= 0) {
      return NextResponse.json(
        { ok: false, error: "معرّف المستخدم غير صالح." },
        { status: 400 }
      );
    }

    const body = await req.json();

    const officeId = Number(body.officeId);
    const sourceDocId = Number(body.documentId);
    // نستخدم enum Language الموجود في السكيمة: AR / EN
    const targetLang = body.targetLang === "AR" ? "AR" : "EN";

    if (!Number.isFinite(officeId) || officeId <= 0) {
      return NextResponse.json(
        { ok: false, error: "مكتب الترجمة غير محدد أو غير صالح." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(sourceDocId) || sourceDocId <= 0) {
      return NextResponse.json(
        { ok: false, error: "المستند غير محدد أو غير صالح." },
        { status: 400 }
      );
    }

    // تأكيد أن المكتب موجود وبالدور الصحيح
    const office = await prisma.user.findUnique({
      where: { id: officeId },
      select: { id: true, role: true, isApproved: true },
    });

    if (!office || office.role !== "TRANSLATION_OFFICE") {
      return NextResponse.json(
        { ok: false, error: "مكتب الترجمة المحدد غير موجود أو غير صحيح." },
        { status: 400 }
      );
    }

    if (!office.isApproved) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "لا يمكن الإرسال إلى هذا المكتب لأنه غير معتمد بعد من إدارة المنصّة.",
        },
        { status: 400 }
      );
    }

    // تأكيد أن المستند موجود في LegalDocument
    const doc = await prisma.legalDocument.findUnique({
      where: { id: sourceDocId },
      select: { id: true },
    });

    if (!doc) {
      return NextResponse.json(
        { ok: false, error: "المستند المطلوب ترجمته غير موجود في النظام." },
        { status: 400 }
      );
    }

    // إنشاء TranslationRequest مطابق للسكيمة:
    // clientId, officeId, sourceDocId, targetLang: Language, status: TranslationStatus
    const request = await prisma.translationRequest.create({
      data: {
        clientId,
        officeId,
        sourceDocId,
        targetLang, // Language enum
        status: "PENDING", // TranslationStatus.PENDING
      },
    });

    // إشعار للمكتب (اختياري)
    try {
      await prisma.notification.create({
        data: {
          userId: officeId,
          title: "طلب ترجمة رسمية جديد",
          body: `يوجد طلب ترجمة جديدة برقم ${request.id} بانتظار مراجعتكم.`,
        },
      });
    } catch (notifyErr) {
      console.error("notification error (ignored):", notifyErr);
    }

    return NextResponse.json(
      {
        ok: true,
        requestId: request.id,
        message: "تم إنشاء طلب الترجمة الرسمية وإرساله إلى مكتب الترجمة.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("translation/requests POST error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "حدث خطأ داخلي في الخادم أثناء إنشاء طلب الترجمة الرسمية.",
      },
      { status: 500 }
    );
  }
}
