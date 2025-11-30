// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "البريد الإلكتروني وكلمة المرور مطلوبة" },
        { status: 400 }
      );
    }

    // منع إنشاء أدمن من الواجهة
    if (role === "ADMIN") {
      return NextResponse.json(
        { error: "لا يمكن إنشاء حساب أدمن من هذه الواجهة" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "هذا البريد الإلكتروني مستخدم مسبقًا" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    // تطبيع الدور: لو أرسل شيء غريب نعتبره CLIENT
    let normalizedRole: UserRole;
    switch (role) {
      case "LAWYER":
        normalizedRole = UserRole.LAWYER;
        break;
      case "COMPANY":
        normalizedRole = UserRole.COMPANY;
        break;
      case "TRANSLATION_OFFICE":
        normalizedRole = UserRole.TRANSLATION_OFFICE;
        break;
      case "CLIENT":
      default:
        normalizedRole = UserRole.CLIENT;
        break;
    }

    // المستخدم العادي: مفعّل مباشرة
    // باقي الأدوار: بانتظار موافقة الأدمن
    const isApproved =
      normalizedRole === UserRole.CLIENT ? true : false;

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: normalizedRole,
        isApproved,
      },
    });

    const msg =
      normalizedRole === UserRole.CLIENT
        ? "تم إنشاء الحساب، يمكنك تسجيل الدخول الآن."
        : "تم إنشاء الحساب، وسيتم مراجعته من مدير النظام قبل التفعيل.";

    return NextResponse.json({ ok: true, message: msg });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع" },
      { status: 500 }
    );
  }
}

