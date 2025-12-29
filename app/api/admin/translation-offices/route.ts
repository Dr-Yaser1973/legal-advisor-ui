import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    const user = session?.user as any;

    // 🔒 حماية: أدمن فقط
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "غير مصرح" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, phone, location } = body;

    // 🧪 تحقق بسيط
    if (!name || !email) {
      return NextResponse.json(
        { ok: false, error: "اسم المكتب والبريد الإلكتروني مطلوبان" },
        { status: 400 }
      );
    }

    // 🚫 منع التكرار
    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return NextResponse.json(
        { ok: false, error: "البريد الإلكتروني مستخدم مسبقًا" },
        { status: 409 }
      );
    }

    // ✅ إنشاء مكتب الترجمة
    const office = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        location,
        role: "TRANSLATION_OFFICE",
        isApproved: true, // أو false لو تحب موافقة لاحقة
        status: "ACTIVE", // إذا عندك enum UserStatus
      },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({ ok: true, office });
  } catch (err) {
    console.error("Create translation office error:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء إنشاء مكتب الترجمة" },
      { status: 500 }
    );
  }
}

