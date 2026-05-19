// app/api/admin/firms/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import crypto from "crypto";
import mailer from "@/lib/mailer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // ── التحقق من الأدمن ────────────────────────────────────
    const session = (await getServerSession(authOptions as any)) as any;
    const user = session?.user as any;
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 403 });
    }

    // ── قراءة البيانات ───────────────────────────────────────
    const body = await req.json();
    const { orgName, contactName, email, phone, city, website, description } = body;

    if (!orgName || !email) {
      return NextResponse.json(
        { ok: false, error: "اسم المكتب والبريد الإلكتروني مطلوبان" },
        { status: 400 }
      );
    }

    // ── منع التكرار ──────────────────────────────────────────
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { ok: false, error: "البريد الإلكتروني مستخدم مسبقًا" },
        { status: 409 }
      );
    }

    // ── إنشاء المؤسسة والفرع والمستخدم في transaction ────────
    await prisma.$transaction(async (tx) => {
      // ١. إنشاء المؤسسة
      const org = await tx.organization.create({
        data: {
          name: orgName,
          type: "LAW_FIRM",
          email,
          phone: phone || null,
          website: website || null,
          description: description || null,
          isApproved: true,
          isActive: true,
          branches: {
            create: [{
              name: "المقر الرئيسي",
              city: city || "غير محدد",
              country: "IQ",
              email,
              phone: phone || null,
            }],
          },
        },
        include: { branches: true },
      });

      // ٢. إنشاء المستخدم المسؤول
      await tx.user.create({
        data: {
          name: contactName || orgName,
          email,
          phone: phone || null,
          role: "LAW_FIRM",
          isApproved: true,
          status: "ACTIVE",
          password: null,
          branchId: org.branches[0].id,
        },
      });
    });

    // ── إنشاء token التفعيل ───────────────────────────────────
    const token = crypto.randomUUID();
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 48), // 48 ساعة
      },
    });

    const link = `${process.env.NEXTAUTH_URL}/set-password?token=${token}`;

    // ── إرسال البريد ──────────────────────────────────────────
    await mailer.sendMail({
      from: `"منصة المستشار القانوني" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `تفعيل حساب مكتب ${orgName} في منصة المستشار القانوني`,
      html: `
        <div style="direction:rtl;font-family:tahoma;max-width:600px;margin:auto">
          <div style="background:#9A7D4A;padding:20px;border-radius:8px 8px 0 0;text-align:center">
            <h2 style="color:white;margin:0">منصة المستشار القانوني الذكي</h2>
          </div>
          <div style="background:#f9f9f9;padding:24px;border-radius:0 0 8px 8px">
            <h3 style="color:#333">مرحباً بمكتب ${orgName}</h3>
            <p style="color:#555">
              تم إضافة مكتبكم كمكتب محاماة معتمد في <strong>منصة المستشار القانوني الذكي</strong>.
            </p>
            <p style="color:#555">يرجى تعيين كلمة المرور للدخول إلى لوحة التحكم الخاصة بكم:</p>
            <div style="text-align:center;margin:24px 0">
              <a href="${link}"
                 style="background:#9A7D4A;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-size:16px">
                تعيين كلمة المرور
              </a>
            </div>
            <p style="color:#888;font-size:13px">⏱️ الرابط صالح لمدة 48 ساعة.</p>
            <hr style="border:none;border-top:1px solid #ddd;margin:16px 0"/>
            <p style="color:#aaa;font-size:12px">
              في حال عدم طلبكم لهذا الحساب، يرجى تجاهل الرسالة أو التواصل مع الإدارة.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
      message: `تم إنشاء حساب مكتب ${orgName} وإرسال رابط التفعيل إلى ${email}`,
    });

  } catch (err) {
    console.error("Create firm error:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء إنشاء حساب المكتب" },
      { status: 500 }
    );
  }
}

