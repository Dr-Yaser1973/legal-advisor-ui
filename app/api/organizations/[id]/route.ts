
// app/api/organizations/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET: /api/organizations/[id]
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
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
