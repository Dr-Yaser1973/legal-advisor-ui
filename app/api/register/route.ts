// app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "البيانات غير مكتملة" },
        { status: 400 }
      );
    }

    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return NextResponse.json(
        { error: "هذا البريد مسجّل مسبقًا" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        role: "CLIENT",
        password: hashed,
      },
    });

    console.log("User created:", user.id);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("REGISTER ERROR:", e);

    const message =
      e?.message ||
      (typeof e === "string" ? e : "خطأ غير معروف من السيرفر");

    // 🔍 مؤقتًا نُرجع الرسالة الحقيقية لمعرفة سبب المشكلة على Vercel
    return NextResponse.json(
      { error: `تفاصيل الخطأ: ${message}` },
      { status: 500 }
    );
  }
}
