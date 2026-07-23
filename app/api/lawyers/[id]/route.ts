// app/api/lawyers/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

 type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params; // ← await هنا
    const lawyerId = Number(id);
    if (!lawyerId || Number.isNaN(lawyerId)) {
      return NextResponse.json(
        { error: "معرّف المحامي غير صالح." },
        { status: 400 }
      );
    }
    // ... باقي الكود بدون تغيير

    const user = await prisma.user.findFirst({
      where: {
        id: lawyerId,
        role: UserRole.LAWYER,
        isApproved: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        lawyerProfile: {
          select: {
            bio: true,
            specialties: true,
            phone: true,
            city: true,
            rating: true,
            consultFee: true,
            consultCurrency: true,
            officeAddress: true,
          },
        },
      },
    });

    if (!user || !user.lawyerProfile) {
      return NextResponse.json(
        { error: "المحامي غير موجود." },
        { status: 404 }
      );
    }

    // بيانات الاتصال تُكشف للمالك أو الأدمن فقط — الزائر يتواصل عبر المنصة
    const session: any = await getServerSession(authOptions as any);
    const viewerId = session?.user?.id ? Number(session.user.id) : null;
    const isAdmin = session?.user?.role === "ADMIN";
    const canSeeContact = isAdmin || viewerId === lawyerId;

    // 🔒 Mapping قراءة فقط
    const lawyer = {
      id: user.id,
      fullName: user.name || "",
      email: canSeeContact ? user.email : null,
      avatarUrl: user.image ?? null,

      bio: user.lawyerProfile.bio ?? "",
      specialization: user.lawyerProfile.specialties ?? "",
      phone: canSeeContact ? (user.lawyerProfile.phone ?? "") : "",
      location: user.lawyerProfile.city ?? "",
      rating: user.lawyerProfile.rating ?? 0,

      consultFee: user.lawyerProfile.consultFee ?? null,
      consultCurrency: user.lawyerProfile.consultCurrency ?? "IQD",
      officeAddress: canSeeContact ? (user.lawyerProfile.officeAddress ?? "") : "",
    };

    return NextResponse.json({ lawyer });
  } catch (e) {
    console.error("GET /api/lawyers/[id] error:", e);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحميل ملف المحامي." },
      { status: 500 }
    );
  }
}

