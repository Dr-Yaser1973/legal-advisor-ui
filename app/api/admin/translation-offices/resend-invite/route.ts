import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import crypto from "crypto";
import mailer from "@/lib/mailer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    /* 1️⃣ تحقق من الجلسة (أدمن فقط) */
    const session = (await getServerSession(authOptions as any)) as any;
    const admin = session?.user as any;

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "غير مصرح" },
        { status: 403 }
      );
    }

    /* 2️⃣ قراءة البيانات */
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "البريد الإلكتروني مطلوب" },
        { status: 400 }
      );
    }

    /* 3️⃣ التأكد من وجود مكتب ترجمة */
    const office = await prisma.user.findUnique({
      where: { email },
    });

    if (!office || office.role !== "TRANSLATION_OFFICE") {
      return NextResponse.json(
        { ok: false, error: "مكتب الترجمة غير موجود" },
        { status: 404 }
      );
    }

    /* 4️⃣ منع الإرسال إن كانت كلمة المرور موجودة */
    if (office.password) {
      return NextResponse.json(
        { ok: false, error: "تم تفعيل هذا الحساب مسبقًا" },
        { status: 400 }
      );
    }

    /* 5️⃣ حذف أي توكن قديم */
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    /* 6️⃣ إنشاء توكن جديد */
    const token = crypto.randomUUID();

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 ساعة
      },
    });

    const link = `${process.env.NEXTAUTH_URL}/set-password?token=${token}`;

    /* 7️⃣ إرسال الإيميل */
    await mailer.sendMail({
      from: `"منصة المستشار القانوني" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "إعادة إرسال رابط تفعيل حساب مكتب الترجمة",
      html: `
        <div style="direction:rtl;font-family:tahoma">
          <h3>مرحبًا ${office.name || ""}</h3>
          <p>
            هذا رابط جديد لتفعيل حسابكم كمكتب ترجمة معتمد في
            <strong>منصة المستشار القانوني</strong>.
          </p>
          <p>يرجى تعيين كلمة المرور عبر الرابط التالي:</p>
          <p>
            <a href="${link}">${link}</a>
          </p>
          <p>⏱️ الرابط صالح لمدة 24 ساعة.</p>
        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
      message: "تم إرسال رابط التفعيل بنجاح",
    });
  } catch (err) {
    console.error("Resend invite error:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء إعادة إرسال الرابط" },
      { status: 500 }
    );
  }
}

