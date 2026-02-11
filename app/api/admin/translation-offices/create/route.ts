import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    /* 1️⃣ تحقق من الأدمن */
    const session = (await getServerSession(authOptions as any)) as any;
    const user = session?.user;

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    /* 2️⃣ قراءة البيانات */
    const body = await req.json();
    const { name, email, phone, location } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: "الاسم والبريد الإلكتروني مطلوبان" },
        { status: 400 }
      );
    }

    /* 3️⃣ تأكد أن البريد غير مستخدم */
    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return NextResponse.json(
        { error: "هذا البريد مستخدم مسبقًا" },
        { status: 400 }
      );
    }

    /* 4️⃣ إنشاء المستخدم */
    const office = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        location,
        role: "TRANSLATION_OFFICE",
        isApproved: true,
        password: null, // مهم
      },
    });

    /* 5️⃣ إنشاء token */
    const token = crypto.randomUUID();

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 ساعة
      },
    });

    const link = `${process.env.NEXTAUTH_URL}/set-password?token=${token}`;

    /* 6️⃣ إرسال الإيميل */
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"منصة المستشار القانوني" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: "تفعيل حساب مكتب الترجمة",
      html: `
        <div style="direction:rtl;font-family:tahoma">
          <h3>مرحبًا ${name}</h3>
          <p>تم إنشاء حسابكم كمكتب ترجمة معتمد في منصة المستشار القانوني.</p>
          <p>الرجاء تعيين كلمة المرور عبر الرابط التالي:</p>
          <p>
            <a href="${link}">${link}</a>
          </p>
          <p>الرابط صالح لمدة 24 ساعة.</p>
        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
      message: "تم إنشاء المكتب وإرسال رابط التفعيل",
    });
  } catch (err: any) {
    console.error("create translation office error:", err);
    return NextResponse.json(
      { error: "خطأ داخلي في الخادم" },
      { status: 500 }
    );
  }
}

