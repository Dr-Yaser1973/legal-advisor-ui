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

    // جميع طلبات الاستشارة البشرية الخاصة بالمستخدم (clientId)
    const items = await prisma.humanConsultRequest.findMany({
      where: {
        clientId: userId,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        createdAt: true,

        // الاستشارة الأصلية (الذكاء الاصطناعي) إن وجدت
        consultation: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },

        // قائمة عروض المحامين
        offers: {
          select: {
            id: true,
            fee: true,
            currency: true,
            note: true,
            status: true,
            createdAt: true,

            // بيانات المحامي الذي قدّم العرض
            lawyer: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                lawyerProfile: {
                  select: {
                    specialties: true,
                    phone: true,
                    city: true,
                    rating: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error in /api/consultations/human/my:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب سجل طلبات الاستشارة." },
      { status: 500 }
    );
  }
}
