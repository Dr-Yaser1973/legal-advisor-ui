// app/api/mobile/google/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OAuth2Client } from "google-auth-library";
import { signUserToken, signRefreshToken } from "@/lib/jwt";

export const runtime = "nodejs";

// Web Client ID — نفس الذي تستخدمه المنصة (Legal Advisor Web Client)
 const GOOGLE_WEB_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(GOOGLE_WEB_CLIENT_ID);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const idToken = body?.idToken as string | undefined;

    if (!idToken) {
      return NextResponse.json(
        { error: "توكن Google مفقود" },
        { status: 400 }
      );
    }

    if (!GOOGLE_WEB_CLIENT_ID) {
      console.error("GOOGLE_WEB_CLIENT_ID is missing");
      return NextResponse.json(
        { error: "إعداد الخادم غير مكتمل" },
        { status: 500 }
      );
    }

    // ===============================
    // التحقق من توكن Google
    // ===============================
    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: GOOGLE_WEB_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      console.error("Google token verification failed:", err);
      return NextResponse.json(
        { error: "توكن Google غير صالح" },
        { status: 401 }
      );
    }

    if (!payload || !payload.email) {
      return NextResponse.json(
        { error: "تعذّر قراءة بيانات الحساب من Google" },
        { status: 401 }
      );
    }

    const email = payload.email.trim().toLowerCase();
    const name = payload.name || payload.email.split("@")[0];
    const googleSub = payload.sub;

    // ===============================
    // جلب المستخدم أو إنشاؤه / ربطه
    // ===============================
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // مستخدم جديد — إنشاء حساب عميل مفعّل مباشرة
      user = await prisma.user.create({
        data: {
          email,
          name,
          role: "CLIENT",
          authProvider: "GOOGLE",
          providerId: googleSub,
          isApproved: true,
          status: "ACTIVE",
        },
      });
    } else {
      // البريد موجود — ربطه بحساب Google إن لم يكن مربوطاً
      if (user.authProvider !== "GOOGLE" || !user.providerId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            authProvider: "GOOGLE",
            providerId: user.providerId || googleSub,
          },
        });
      }

      // حماية: حساب موقوف لا يدخل
      if (user.status === "SUSPENDED") {
        return NextResponse.json(
          { error: "تم تعليق حسابك. يرجى التواصل مع الدعم." },
          { status: 403 }
        );
      }

      // حساب مهني قيد المراجعة (محامٍ/مكتب) لا يدخل عبر التطبيق
      if (!user.isApproved || user.status === "PENDING") {
        return NextResponse.json(
          { error: "حسابك قيد المراجعة، سيتم تفعيله خلال 24-48 ساعة" },
          { status: 403 }
        );
      }
    }

    // ===============================
    // إصدار التوكن — نفس صيغة login
    // ===============================
    const token = await signUserToken({
      id: user.id,
      role: user.role,
      isApproved: user.isApproved,
    });

    const refreshToken = await signRefreshToken(user.id);

    return NextResponse.json({
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (err) {
    console.error("mobile google login error:", err);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع" },
      { status: 500 }
    );
  }
}
