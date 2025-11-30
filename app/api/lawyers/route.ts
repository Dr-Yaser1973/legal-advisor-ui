 // app/api/lawyers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";

// GET: /api/lawyers?q=&specialization=&location=&available=&page=&pageSize=
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const specialization = (searchParams.get("specialization") || "").trim();
    const location = (searchParams.get("location") || "").trim();
    const available = searchParams.get("available"); // حالياً غير مستخدمة فعلياً
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const pageSize = Math.min(
      50,
      Math.max(6, Number(searchParams.get("pageSize") || "12"))
    );

    const where: any = {
      role: UserRole.LAWYER,
      isApproved: true,
    };

    // بحث نصي
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        {
          lawyerProfile: {
            specialties: { contains: q, mode: "insensitive" },
          },
        },
        {
          lawyerProfile: {
            city: { contains: q, mode: "insensitive" },
          },
        },
      ];
    }

    // تصفية بالاختصاص
    if (specialization) {
      where.lawyerProfile = {
        ...(where.lawyerProfile || {}),
        specialties: { contains: specialization, mode: "insensitive" },
      };
    }

    // تصفية بالموقع (المدينة)
    if (location) {
      where.lawyerProfile = {
        ...(where.lawyerProfile || {}),
        city: { contains: location, mode: "insensitive" },
      };
    }

    // مبدئياً: available لا يوجد له حقل في السكيمة، يمكن إضافته لاحقاً
    // فنتركه بدون تطبيق فعلي الآن.

    const total = await prisma.user.count({ where });

    const users = await prisma.user.findMany({
      where,
      include: {
        lawyerProfile: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const items = users.map((u) => ({
      id: u.id,
      fullName: u.name || "",
      email: u.email || "",
      phone: u.lawyerProfile?.phone || "",
      specialization: u.lawyerProfile?.specialties || "",
      bio: u.lawyerProfile?.bio || "",
      experience: null as number | null, // لا يوجد حقل experience حالياً
      location: u.lawyerProfile?.city || "",
      rating: u.lawyerProfile?.rating ?? 0,
      avatarUrl: u.image || "",
      // لا يوجد حقل available في السكيمة، نفترض أنه متاح دائماً
      available: true,
    }));

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
    });
  } catch (e: any) {
    console.error("Error in GET /api/lawyers:", e);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب قائمة المحامين." },
      { status: 500 }
    );
  }
}

// POST: لإنشاء محامٍ سريعاً من واجهة الإدارة (quickCreate)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      specialization,
      phone,
      bio,
      location,
    } = body || {};

    if (!fullName || !email || !specialization) {
      return NextResponse.json(
        { error: "الاسم والبريد والاختصاص مطلوبة." },
        { status: 400 }
      );
    }

     const created = await prisma.user.create({
  data: {
    name: fullName,
    email,
    role: UserRole.LAWYER,
    // المحامي الجديد لا يكون معتمداً إلا بعد موافقة الأدمن
    isApproved: false,
    lawyerProfile: {
      create: {
        specialties: specialization,
        phone: phone || null,
        city: location || null,
        rating: null,
        bio: bio || null,
      },
    },
  },
  select: { id: true },
});


    return NextResponse.json({ ok: true, id: created.id });
  } catch (e: any) {
    console.error("Error in POST /api/lawyers:", e);
    return NextResponse.json(
      { error: e.message || "حدث خطأ أثناء إنشاء المحامي." },
      { status: 500 }
    );
  }
}
