// app/api/debug/make-me-admin/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

// نستخدم GET حتى تستطيع فتح الرابط مباشرة من المتصفح
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          ok: false,
          message: "يجب تسجيل الدخول أولاً قبل استعمال هذا المسار.",
        },
        { status: 401 },
      );
    }

    const email = session.user.email.toLowerCase().trim();

    const user = await prisma.user.update({
      where: { email },
      data: {
        role: "ADMIN",
        isApproved: true,
        status: "ACTIVE", // غيّرها إذا كان Enum عندك باسم آخر للحالة المفعّلة
      },
    });

    return NextResponse.json({
      ok: true,
      message: "تم ترقيتك إلى أدمن وتفعيل حسابك بنجاح.",
      userId: user.id,
      role: user.role,
      status: user.status,
    });
  } catch (err) {
    console.error("make-me-admin error:", err);
    return NextResponse.json(
      {
        ok: false,
        message: "حدث خطأ أثناء ترقية الحساب إلى أدمن.",
      },
      { status: 500 },
    );
  }
}

