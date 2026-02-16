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
    const user = session?.user as any;

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "غير مصرح" },
        { status: 403 }
      );
    }

    /* 2️⃣ قراءة البيانات */
    const body = await req.json();
    const { name, email, phone, location } = body;

    if (!name || !email) {
      return NextResponse.json(
        { ok: false, error: "اسم المحامي والبريد الإلكتروني مطلوبان" },
        { status: 400 }
      );
    }

    /* 3️⃣ منع التكرار */
    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return NextResponse.json(
        { ok: false, error: "البريد الإلكتروني مستخدم مسبقًا" },
        { status: 409 }
      );
    }

    /* 4️⃣ إنشاء المحامي */
    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        location,
        role: "LAWYER",
        isApproved: true,
        password: null,
      },
    });

    /* 5️⃣ إنشاء token لتعيين كلمة المرور */
    const token = crypto.randomUUID();

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    const link = `${process.env.NEXTAUTH_URL}/set-password?token=${token}`;

    /* 6️⃣ إرسال إيميل التفعيل */
    await mailer.sendMail({
      from: `"منصة المستشار القانوني" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "تفعيل حساب المحامي",
      html: `
        <div style="direction:rtl;font-family:tahoma">
          <h3>مرحبًا ${name}</h3>
          <p>
            تم إنشاء حسابكم كمحامٍ معتمد في
            <strong>منصة المستشار القانوني</strong>.
          </p>
          <p>يرجى تعيين كلمة المرور عبر الرابط التالي:</p>
          <p>
            <a href="${link}">${link}</a>
          </p>
          <p>⏱️ الرابط صالح لمدة 24 ساعة.</p>
          <hr/>
          <p style="font-size:12px;color:#888">
            في حال عدم طلبكم لهذا الحساب، يرجى تجاهل الرسالة.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
      message: "تم إنشاء حساب المحامي وإرسال رابط التفعيل",
    });
  } catch (err) {
    console.error("Create lawyer error:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء إنشاء حساب المحامي" },
      { status: 500 }
    );
  }
}
