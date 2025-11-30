 // app/api/cases/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

// GET /api/cases
export async function GET(req: Request) {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  if (!user) {
    return NextResponse.json(
      { error: "غير مصرح: يرجى تسجيل الدخول" },
      { status: 401 }
    );
  }

  // نسمح فقط للأدمن + المحامي + الشركة
  if (!["ADMIN", "LAWYER", "COMPANY"].includes(user.role)) {
    return NextResponse.json(
      { error: "غير مصرح: لا يمكنك عرض القضايا" },
      { status: 403 }
    );
  }

  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const page = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "10");
  const q = searchParams.get("q")?.trim() || "";
  const status = searchParams.get("status") || "";
  const type = searchParams.get("type") || "";

  const where: any = {};

  // 🔐 فلترة القضايا حسب الدور
  if (user.role === "ADMIN") {
    // لا نضيف شرط userId → الأدمن يرى الكل
  } else {
    // المحامي + الشركة → فقط قضاياهم
    where.userId = Number(user.id);
  }

  // فلاتر إضافية
  if (status) {
    where.status = status;
  }
  if (type) {
    where.type = type;
  }

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { court: { contains: q, mode: "insensitive" } },
      { type: { contains: q, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.case.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        title: true,
        type: true,
        court: true,
        status: true,
        filingDate: true,
        closingDate: true,
      },
    }),
    prisma.case.count({ where }),
  ]);

  // تجهيز النتيجة بالشكل الذي يتوقعه الـ Client
  const jsonItems = items.map((c) => ({
    ...c,
    filingDate: c.filingDate.toISOString(),
    closingDate: c.closingDate ? c.closingDate.toISOString() : null,
  }));

  return NextResponse.json({
    items: jsonItems,
    total,
    page,
    pageSize,
  });
}

// POST /api/cases
export async function POST(req: Request) {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  if (!user) {
    return NextResponse.json(
      { error: "غير مصرح: يرجى تسجيل الدخول" },
      { status: 401 }
    );
  }

  // نسمح بإنشاء قضية فقط للأدمن + المحامي + الشركة
  if (!["ADMIN", "LAWYER", "COMPANY"].includes(user.role)) {
    return NextResponse.json(
      { error: "غير مصرح: لا يمكنك إنشاء قضايا" },
      { status: 403 }
    );
  }

  const body = await req.json();

  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const type = String(body.type || "").trim();
  const court = String(body.court || "").trim();
  const status = String(body.status || "مفتوحة").trim();

  if (!title || !description || !type || !court) {
    return NextResponse.json(
      { error: "عنوان القضية، نوعها، المحكمة والوصف حقول إلزامية." },
      { status: 400 }
    );
  }

  const filingDateRaw = body.filingDate
    ? new Date(body.filingDate)
    : new Date();

  if (Number.isNaN(filingDateRaw.getTime())) {
    return NextResponse.json(
      { error: "تاريخ تسجيل القضية غير صالح." },
      { status: 400 }
    );
  }

  const notes =
    body.notes && String(body.notes).trim().length > 0
      ? String(body.notes).trim()
      : null;

  const parties = body.parties ?? [];

  const created = await prisma.case.create({
    data: {
      title,
      description,
      type,
      court,
      status,
      filingDate: filingDateRaw,
      closingDate: null,
      parties,
      notes,
      userId: Number(user.id), // 👈 ربط القضية بصاحبها (محامي / شركة / أدمن)
    },
  });

  return NextResponse.json(
    {
      id: created.id,
      message: "تم إنشاء القضية بنجاح.",
    },
    { status: 201 }
  );
}
