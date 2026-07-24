// app/api/admin/companies/route.ts
// إنشاء حساب شركة يدوياً من لوحة الأدمن + إرسال رابط تفعيل.
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import crypto from "crypto";
import mailer from "@/lib/mailer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    const user = session?.user as any;
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, phone, location } = body;

    if (!name || !email) {
      return NextResponse.json(
        { ok: false, error: "اسم الشركة والبريد الإلكتروني مطلوبان" },
        { status: 400 }
      );
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { ok: false, error: "البريد الإلكتروني مستخدم مسبقًا" },
        { status: 409 }
      );
    }

    await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        location: location || null,
        role: "COMPANY",
        isApproved: true,
        isManager: true,
        password: null, // تُعيَّن عبر رابط التفعيل
      },
    });

    const token = crypto.randomUUID();
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    const link = `${process.env.NEXTAUTH_URL}/set-password?token=${token}`;

    await mailer.sendMail({
      from: `"منصة المستشار القانوني" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "تفعيل حساب الشركة",
      html: `
        <div style="direction:rtl;font-family:tahoma">
          <h3>مرحبًا ${name}</h3>
          <p>تم إنشاء حساب شركتكم في <strong>منصة المستشار القانوني</strong>.</p>
          <p>يرجى تعيين كلمة المرور عبر الرابط التالي:</p>
          <p><a href="${link}">${link}</a></p>
          <p>⏱️ الرابط صالح لمدة 24 ساعة.</p>
        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
      message: "تم إنشاء حساب الشركة وإرسال رابط التفعيل",
    });
  } catch (err) {
    console.error("Create company error:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء إنشاء حساب الشركة" },
      { status: 500 }
    );
  }
}
