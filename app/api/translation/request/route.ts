 // app/api/translation/requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1) التأكد من أن المستخدم مسجَّل دخول
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
        { ok: false, error: "معرّف المستخدم (العميل) غير صالح." },
        { status: 400 }
      );
    }

    // 2) قراءة بيانات الطلب من الـ body
    const body = await req.json().catch(() => null as any);

    if (!body) {
      return NextResponse.json(
        { ok: false, error: "لم تصل أي بيانات للطلب من الواجهة." },
        { status: 400 }
      );
    }

    // نحاول دعم أكثر من اسم للمستند تحسبًا للاختلاف
    const officeIdRaw = body.officeId ?? body.office ?? body.office_id;
    const docIdRaw =
      body.documentId ?? body.sourceDocId ?? body.docId ?? body.legalDocumentId;

    const officeId = Number(officeIdRaw);
    const sourceDocId = Number(docIdRaw);

    if (!Number.isFinite(officeId) || officeId <= 0) {
      return NextResponse.json(
        { ok: false, error: "مكتب الترجمة غير محدد أو قيمته غير صالحة." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(sourceDocId) || sourceDocId <= 0) {
      return NextResponse.json(
        { ok: false, error: "المستند المطلوب ترجمته غير محدد أو قيمته غير صالحة." },
        { status: 400 }
      );
    }

    // لغة الهدف: افتراضيًا EN، إلا إذا أرسلت "AR"
    const targetLang: "AR" | "EN" =
      body.targetLang === "AR" ? "AR" : "EN";

    // 3) التحقق أن المكتب موجود وموافق عليه (اختياري لكن مفيد)
    const officeUser = await prisma.user.findUnique({
      where: { id: officeId },
      select: { id: true, role: true, isApproved: true },
    });

    if (!officeUser || officeUser.role !== "TRANSLATION_OFFICE") {
      return NextResponse.json(
        { ok: false, error: "مكتب الترجمة المحدد غير موجود أو غير صحيح." },
        { status: 400 }
      );
    }

    if (!officeUser.isApproved) {
      return NextResponse.json(
        {
          ok: false,
          error: "لا يمكن الإرسال إلى هذا المكتب لأنه غير معتمد بعد من الإدارة.",
        },
        { status: 400 }
      );
    }

    // 4) إنشاء سجل في TranslationRequest
    const request = await prisma.translationRequest.create({
      data: {
        clientId,
        officeId,
        sourceDocId,
        targetLang,
        status: "PENDING", // بانتظار قبول المكتب و تحديد السعر
      },
    });

    // 5) إشعار للمكتب (اختياري)
    try {
      await prisma.notification.create({
        data: {
          userId: officeId,
          title: "طلب ترجمة رسمية جديد",
          body: `يوجد طلب ترجمة جديد برقم ${request.id} بانتظار مراجعتكم.`,
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
  } catch (e) {
    console.error("translation/requests POST error:", e);
    return NextResponse.json(
      {
        ok: false,
        error: "حدث خطأ داخلي في الخادم أثناء إنشاء طلب الترجمة الرسمية.",
      },
      { status: 500 }
    );
  }
}
