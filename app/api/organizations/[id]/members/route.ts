 // app/api/organizations/[id]/members/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

const MANAGER_ROLES = ["OWNER", "ADMIN"];

// مساعد: التحقق أن المستخدم الحالي يدير هذه المنظمة
async function getManagerMembership(userId: number, orgId: number) {
  // أدمن المنصة يدير أي منظمة
  const member = await prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId } },
  });
  return member;
}

// GET: قائمة أعضاء المنظمة
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const { id } = await params;
    const orgId = Number(id);
    if (isNaN(orgId)) return NextResponse.json({ error: "معرف غير صالح." }, { status: 400 });

    const userId = Number((session.user as any).id);
    const isPlatformAdmin = (session.user as any).role === "ADMIN";

    // يجب أن يكون عضواً أو أدمن منصة
    if (!isPlatformAdmin) {
      const me = await getManagerMembership(userId, orgId);
      if (!me) return NextResponse.json({ error: "غير مصرح." }, { status: 403 });
    }

    const members = await prisma.orgMember.findMany({
      where: { orgId },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        branch: { select: { id: true, name: true, city: true } },
      },
      orderBy: { joinedAt: "asc" },
    });

    return NextResponse.json({ items: members });
  } catch (e: any) {
    console.error("GET members error:", e);
    return NextResponse.json({ error: "حدث خطأ." }, { status: 500 });
  }
}

// POST: إضافة عضو جديد
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });
    const { id } = await params;
    const orgId = Number(id);
    if (isNaN(orgId)) return NextResponse.json({ error: "معرف غير صالح." }, { status: 400 });

    const currentUserId = Number((session.user as any).id);
    const isPlatformAdmin = (session.user as any).role === "ADMIN";

    // التحقق من صلاحية الإدارة
    if (!isPlatformAdmin) {
      const me = await getManagerMembership(currentUserId, orgId);
      if (!me || !MANAGER_ROLES.includes(me.role)) {
        return NextResponse.json({ error: "لا تملك صلاحية إضافة أعضاء." }, { status: 403 });
      }
    }

    const body = await req.json();
    const { email, role, branchId } = body || {};

    if (!email || !role) {
      return NextResponse.json({ error: "البريد الإلكتروني والدور مطلوبان." }, { status: 400 });
    }

    // البحث عن المستخدم بالبريد
    const targetUser = await prisma.user.findUnique({ where: { email: email.trim() } });
    if (!targetUser) {
      return NextResponse.json(
        { error: "لا يوجد مستخدم مسجّل بهذا البريد. اطلب منه التسجيل أولاً." },
        { status: 404 }
      );
    }

    // التحقق أنه ليس عضواً بالفعل
    const existing = await prisma.orgMember.findUnique({
      where: { orgId_userId: { orgId, userId: targetUser.id } },
    });
    if (existing) {
      return NextResponse.json({ error: "هذا المستخدم عضو بالفعل." }, { status: 409 });
    }

    // التحقق من حد العدد (maxUsers)
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { maxUsers: true },
    });
    if (!org) return NextResponse.json({ error: "المؤسسة غير موجودة." }, { status: 404 });

    const activeCount = await prisma.orgMember.count({
      where: { orgId, isActive: true },
    });
    if (activeCount >= org.maxUsers) {
      return NextResponse.json(
        { error: `بلغت المنظمة الحد الأقصى للأعضاء (${org.maxUsers}). يُرجى ترقية الباقة.` },
        { status: 403 }
      );
    }

    const member = await prisma.orgMember.create({
      data: {
        orgId,
        userId: targetUser.id,
        role,
        branchId: branchId ? Number(branchId) : null,
      },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        branch: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ ok: true, member });
  } catch (e: any) {
    console.error("POST members error:", e);
    return NextResponse.json({ error: e.message || "حدث خطأ." }, { status: 500 });
  }
}