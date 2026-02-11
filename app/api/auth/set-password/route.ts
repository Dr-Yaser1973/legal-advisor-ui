import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password || password.length < 8) {
      return NextResponse.json(
        { error: "بيانات غير صالحة" },
        { status: 400 }
      );
    }

    // 1️⃣ تحقق من التوكن
    const record = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!record || record.expires < new Date()) {
      return NextResponse.json(
        { error: "الرابط غير صالح أو منتهي" },
        { status: 400 }
      );
    }

    // 2️⃣ تحديث كلمة المرور
    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email: record.identifier },
      data: { password: hashed },
    });

    // 3️⃣ حذف التوكن
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "فشل تعيين كلمة المرور" },
      { status: 500 }
    );
  }
}

