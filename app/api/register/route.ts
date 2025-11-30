 // app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password } = body || {};

    console.log("📩 Register request body:", body);

    // تحقق من الحقول الأساسية
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "الاسم والبريد وكلمة المرور مطلوبة" },
        { status: 400 }
      );
    }

    // هل يوجد مستخدم بنفس البريد؟
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "هذا البريد مستخدم بالفعل" },
        { status: 400 }
      );
    }

    // تشفير كلمة المرور
    const hashed = await bcrypt.hash(password, 10);

    // إنشاء المستخدم (عميل عادي)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashed,
        phone,
        role: "CLIENT", // مستخدم عادي
        // status: "ACTIVE", // إذا عندك default في البريسما ممكن تتركه
      },
    });

    console.log("✅ User created:", user.id, user.email);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("❌ Register error:", e);
    return NextResponse.json(
      { error: e?.message || "خطأ غير متوقع أثناء التسجيل" },
      { status: 500 }
    );
  }
}
