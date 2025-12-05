 // app/api/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, password } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { ok: false, message: "يرجى ملء الاسم والبريد وكلمة المرور." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // هل البريد موجود مسبقًا؟
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { ok: false, message: "هذا البريد مسجّل مسبقًا." },
        { status: 400 },
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    // ملاحظة:
    // role: نضع CLIENT افتراضيًا (أو ADMIN لأول مستخدم إذا أردت يدوياً)
    // status: ACTIVE ليعمل الدخول مباشرة في النسخة التجريبية
    const user = await prisma.user.create({
      data: {
        name: fullName,
        email: normalizedEmail,
        phone,
        password: hashed,
        role: "CLIENT",   // غيّرها يدوياً لـ "ADMIN" لو تريد حساب مشرف
        status: "ACTIVE", // متوافق مع enum UserStatus الموجود عندك
        isApproved: true,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        message: "تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن.",
        userId: user.id,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("REGISTER_ERROR", err);
    return NextResponse.json(
      { ok: false, message: "حدث خطأ غير متوقع أثناء التسجيل." },
      { status: 500 },
    );
  }
}
