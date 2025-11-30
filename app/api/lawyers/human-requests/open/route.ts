// app/api/lawyers/human-requests/open/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { HumanConsultStatus, UserRole } from "@prisma/client";

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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user || (user.role !== UserRole.LAWYER && user.role !== UserRole.ADMIN)) {
      return NextResponse.json(
        { error: "هذه الواجهة مخصصة للمحامين فقط." },
        { status: 403 }
      );
    }

    const requests = await prisma.humanConsultRequest.findMany({
      where: { status: HumanConsultStatus.PENDING },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        status: true,
        createdAt: true,
        consultation: {
          select: {
            id: true,
            title: true,
            description: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        offers: {
          where: { lawyerId: userId },
          select: {
            id: true,
            fee: true,
            currency: true,
            status: true,
          },
        },
      },
    });

    const items = requests.map((r) => ({
      id: r.id,
      status: r.status,
      createdAt: r.createdAt,
      consultation: r.consultation,
      hasOffered: r.offers.length > 0,
      myOffer: r.offers[0] || null,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error in GET /api/lawyers/human-requests/open:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الطلبات المفتوحة." },
      { status: 500 }
    );
  }
}

