 // app/api/consultations/ai/my/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "غير مصرح. يرجى تسجيل الدخول." },
        { status: 401 }
      );
    }

    const userId = Number(session.user.id);

    // نُرجع فقط استشارات الذكاء التي أُجيبت فعلاً؛ طلبات المحامين البشرية
    // تُنشئ سجل Consultation بلا answer فنستبعدها من سجل الذكاء.
    const items = await prisma.consultation.findMany({
      where: { userId, answer: { not: null } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error in /api/consultations/ai/my:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب سجل الاستشارات." },
      { status: 500 }
    );
  }
}
