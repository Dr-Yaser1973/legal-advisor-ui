
// app/api/organizations/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
 import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export const runtime = "nodejs";

 // GET: /api/organizations/[id]
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = Number(idStr);
    if (isNaN(id)) return NextResponse.json({ error: "معرف غير صالح." }, { status: 400 });

    const org = await prisma.organization.findUnique({
      where: { id },
      include: {
        branches: {
          where: { isActive: true },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { requests: true } },
      },
    });

    if (!org) return NextResponse.json({ error: "المؤسسة غير موجودة." }, { status: 404 });

    return NextResponse.json({
      id: org.id,
      name: org.name,
      type: org.type,
      logo: org.logo,
      website: org.website,
      description: org.description,
      email: org.email,
      phone: org.phone,
      isApproved: org.isApproved,
      branches: org.branches,
      totalRequests: org._count.requests,
    });
  } catch (e: any) {
    console.error("GET /api/organizations/[id] error:", e);
    return NextResponse.json({ error: "حدث خطأ." }, { status: 500 });
  }
}
// POST: إنشاء مؤسسة جديدة (أدمن فقط) + تعيين مالك
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح." }, { status: 403 });
    }

    const body = await req.json();
    const { name, type, logo, website, description, email, phone, branches, ownerId, maxUsers } = body || {};

    if (!name || !type) {
      return NextResponse.json({ error: "الاسم والنوع مطلوبان." }, { status: 400 });
    }

    const org = await prisma.$transaction(async (tx) => {
      const created = await tx.organization.create({
        data: {
          name, type, logo: logo || null, website: website || null,
          description: description || null, email: email || null,
          phone: phone || null, isApproved: true,
          maxUsers: maxUsers && Number(maxUsers) > 0 ? Number(maxUsers) : 5,
          branches: branches?.length ? {
            create: branches.map((b: any) => ({
              name: b.name, city: b.city, country: b.country || "IQ",
              email: b.email || null, phone: b.phone || null, address: b.address || null,
            })),
          } : undefined,
        },
        include: { branches: true },
      });

      // تعيين المالك إن تم تمرير ownerId
      if (ownerId && Number(ownerId) > 0) {
        await tx.orgMember.create({
          data: { orgId: created.id, userId: Number(ownerId), role: "OWNER" },
        });
      }

      return created;
    });

    return NextResponse.json({ ok: true, org });
  } catch (e: any) {
    console.error("POST /api/organizations error:", e);
    return NextResponse.json({ error: e.message || "حدث خطأ." }, { status: 500 });
  }
}