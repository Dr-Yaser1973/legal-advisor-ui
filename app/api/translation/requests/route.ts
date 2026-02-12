 // app/api/translation/requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // ===============================
    // 1️⃣ التحقق من الجلسة
    // ===============================
    const session = (await getServerSession(authOptions as any)) as any;
    const user = session?.user as any;

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "يجب تسجيل الدخول قبل طلب الترجمة الرسمية." },
        { status: 401 }
      );
    }

    // ===============================
    // 2️⃣ جلب clientId الصحيح من قاعدة البيانات عبر email
    // (حل نهائي لمشكلة user.id string)
    // ===============================
    const email = (user.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "تعذر تحديد بريد المستخدم من الجلسة." },
        { status: 400 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json(
        { ok: false, error: "المستخدم غير موجود في قاعدة البيانات." },
        { status: 400 }
      );
    }

    const clientId = dbUser.id; // ✅ رقم صحيح متوافق مع Prisma

    // ===============================
    // 3️⃣ قراءة البيانات المرسلة
    // ===============================
    const body = await req.json();

    const officeId = Number(body.officeId);
    const sourceDocId = Number(body.documentId);

    // 🔒 حصر اللغة في AR / EN فقط (بدون تعديل السكيمة)
    const targetLang: "AR" | "EN" =
      body.targetLang === "AR" ? "AR" : "EN";

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

    // ===============================
    // 4️⃣ التحقق من مكتب الترجمة
    // ===============================
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

    // ===============================
    // 5️⃣ التحقق من المستند
    // ===============================
    const doc = await prisma.legalDocument.findUnique({
      where: { id: sourceDocId },
      select: {
        id: true,
        filePath: true,
      },
    });

    if (!doc || !doc.filePath) {
      return NextResponse.json(
        {
          ok: false,
          error: "المستند المطلوب ترجمته غير موجود أو لا يحتوي على ملف.",
        },
        { status: 400 }
      );
    }

    // ===============================
    // 6️⃣ إنشاء طلب الترجمة الرسمية
    // ===============================
    const request = await prisma.translationRequest.create({
      data: {
        clientId,
        officeId,
        sourceDocId,
        targetLang, // AR | EN فقط
        status: "PENDING",
      },
    });

    // ===============================
    // 7️⃣ إشعار مكتب الترجمة (اختياري)
    // ===============================
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

    // ===============================
    // 8️⃣ الاستجابة النهائية
    // ===============================
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
