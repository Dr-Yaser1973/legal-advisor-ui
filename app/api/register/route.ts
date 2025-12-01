 // app/api/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      password,
      role, // اختياري، لو تحب تمرّره من الواجهة
    } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { ok: false, message: "يرجى ملء الاسم والبريد وكلمة المرور." },
        { status: 400 }
      );
    }

    // هل البريد موجود؟
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { ok: false, message: "هذا البريد مسجّل مسبقًا." },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: fullName,
        email,
        phone,
        password: hashed,
        // لو تريد أول مستخدم يكون أدمن:
        role: role ?? "ADMIN",
        // أو غيّرها إلى CLIENT لو تريد تسجيل مستخدم عادي
      },
    });

    return NextResponse.json(
      { ok: true, message: "تم إنشاء الحساب بنجاح.", userId: user.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("REGISTER_ERROR", err);
    return NextResponse.json(
      { ok: false, message: "حدث خطأ غير متوقع أثناء التسجيل." },
      { status: 500 }
    );
  }
}
