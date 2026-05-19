// app/api/admin/firms/resend-invite/route.ts
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
    const admin = session?.user as any;
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 403 });
    }

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ ok: false, error: "البريد الإلكتروني مطلوب" }, { status: 400 });
    }

    const firmUser = await prisma.user.findUnique({ where: { email } });
    if (!firmUser || firmUser.role !== "LAW_FIRM") {
      return NextResponse.json({ ok: false, error: "المكتب غير موجود" }, { status: 404 });
    }
    if (firmUser.password) {
      return NextResponse.json({ ok: false, error: "تم تفعيل هذا الحساب مسبقًا" }, { status: 400 });
    }

    // حذف توكن قديم وإنشاء جديد
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
    const token = crypto.randomUUID();
    await prisma.verificationToken.create({
      data: { identifier: email, token, expires: new Date(Date.now() + 1000 * 60 * 60 * 48) },
    });

    const link = `${process.env.NEXTAUTH_URL}/set-password?token=${token}`;

    await mailer.sendMail({
      from: `"منصة المستشار القانوني" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "إعادة إرسال رابط تفعيل حساب المكتب",
      html: `
        <div style="direction:rtl;font-family:tahoma;max-width:600px;margin:auto">
          <div style="background:#9A7D4A;padding:20px;border-radius:8px 8px 0 0;text-align:center">
            <h2 style="color:white;margin:0">منصة المستشار القانوني الذكي</h2>
          </div>
          <div style="background:#f9f9f9;padding:24px;border-radius:0 0 8px 8px">
            <h3>مرحباً ${firmUser.name || ""}</h3>
            <p>هذا رابط جديد لتفعيل حساب مكتبكم في <strong>منصة المستشار القانوني</strong>.</p>
            <div style="text-align:center;margin:24px 0">
              <a href="${link}" style="background:#9A7D4A;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-size:16px">
                تعيين كلمة المرور
              </a>
            </div>
            <p style="color:#888;font-size:13px">⏱️ الرابط صالح لمدة 48 ساعة.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true, message: "تم إرسال رابط التفعيل بنجاح" });
  } catch (err) {
    console.error("Resend firm invite error:", err);
    return NextResponse.json({ ok: false, error: "حدث خطأ أثناء إعادة إرسال الرابط" }, { status: 500 });
  }
}

