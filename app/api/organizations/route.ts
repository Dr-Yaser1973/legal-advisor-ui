// app/api/organizations/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export const runtime = "nodejs";

// GET: /api/organizations?type=&q=&page=&pageSize=
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const type = (searchParams.get("type") || "").trim();
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const pageSize = Math.min(50, Math.max(6, Number(searchParams.get("pageSize") || "12")));

    const where: any = { isApproved: true, isActive: true };

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    if (type) {
      where.type = type;
    }

    const total = await prisma.organization.count({ where });

    const orgs = await prisma.organization.findMany({
      where,
      include: {
        branches: {
          where: { isActive: true },
          select: { id: true, city: true, country: true, email: true, phone: true, name: true },
        },
        _count: { select: { requests: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const items = orgs.map((org) => ({
      id: org.id,
      name: org.name,
      type: org.type,
      logo: org.logo,
      website: org.website,
      description: org.description,
      email: org.email,
      phone: org.phone,
      branches: org.branches,
      totalRequests: org._count.requests,
    }));

    return NextResponse.json({ items, total, page, pageSize });
  } catch (e: any) {
    console.error("GET /api/organizations error:", e);
    return NextResponse.json({ error: "حدث خطأ أثناء جلب المؤسسات." }, { status: 500 });
  }
}

// POST: إنشاء مؤسسة جديدة (أدمن فقط)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح." }, { status: 403 });
    }

    const body = await req.json();
    const { name, type, logo, website, description, email, phone, branches } = body || {};

    if (!name || !type) {
      return NextResponse.json({ error: "الاسم والنوع مطلوبان." }, { status: 400 });
    }

    const org = await prisma.organization.create({
      data: {
        name,
        type,
        logo: logo || null,
        website: website || null,
        description: description || null,
        email: email || null,
        phone: phone || null,
        isApproved: true,
        branches: branches?.length
          ? {
              create: branches.map((b: any) => ({
                name: b.name,
                city: b.city,
                country: b.country || "IQ",
                email: b.email || null,
                phone: b.phone || null,
                address: b.address || null,
              })),
            }
          : undefined,
      },
      include: { branches: true },
    });

    return NextResponse.json({ ok: true, org });
  } catch (e: any) {
    console.error("POST /api/organizations error:", e);
    return NextResponse.json({ error: e.message || "حدث خطأ." }, { status: 500 });
  }
}

