//app/api/organizations/[id]/members/[memberId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
  import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

const MANAGER_ROLES = ["OWNER", "ADMIN"];

async function canManage(userId: number, orgId: number, isPlatformAdmin: boolean) {
  if (isPlatformAdmin) return true;
  const me = await prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId } },
  });
  return !!me && MANAGER_ROLES.includes(me.role);
}

// PATCH: تغيير دور العضو أو تفعيله/تعطيله
 export async function PATCH(req: Request, { params }: { params: Promise<{ id: string; memberId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

      const { id, memberId: memberIdStr } = await params;
  const orgId = Number(id);
  const memberId = Number(memberIdStr);
    if (isNaN(orgId) || isNaN(memberId)) {
      return NextResponse.json({ error: "معرف غير صالح." }, { status: 400 });
    }

    const currentUserId = Number((session.user as any).id);
    const isPlatformAdmin = (session.user as any).role === "ADMIN";

    if (!(await canManage(currentUserId, orgId, isPlatformAdmin))) {
      return NextResponse.json({ error: "لا تملك صلاحية التعديل." }, { status: 403 });
    }

    // العضو يجب أن ينتمي لنفس المنظمة
    const member = await prisma.orgMember.findUnique({ where: { id: memberId } });
    if (!member || member.orgId !== orgId) {
      return NextResponse.json({ error: "العضو غير موجود." }, { status: 404 });
    }

    const body = await req.json();
    const { role, isActive, branchId } = body || {};

    // حماية: لا يمكن تعطيل أو تخفيض آخر OWNER
    if (member.role === "OWNER" && (role && role !== "OWNER" || isActive === false)) {
      const ownerCount = await prisma.orgMember.count({
        where: { orgId, role: "OWNER", isActive: true },
      });
      if (ownerCount <= 1) {
        return NextResponse.json(
          { error: "لا يمكن تعطيل أو تخفيض المالك الوحيد للمنظمة." },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.orgMember.update({
      where: { id: memberId },
      data: {
        ...(role !== undefined ? { role } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
        ...(branchId !== undefined ? { branchId: branchId ? Number(branchId) : null } : {}),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        branch: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ ok: true, member: updated });
  } catch (e: any) {
    console.error("PATCH member error:", e);
    return NextResponse.json({ error: e.message || "حدث خطأ." }, { status: 500 });
  }
}

// DELETE: إزالة عضو
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const orgId = Number(params.id);
    const memberId = Number(params.memberId);
    if (isNaN(orgId) || isNaN(memberId)) {
      return NextResponse.json({ error: "معرف غير صالح." }, { status: 400 });
    }

    const currentUserId = Number((session.user as any).id);
    const isPlatformAdmin = (session.user as any).role === "ADMIN";

    if (!(await canManage(currentUserId, orgId, isPlatformAdmin))) {
      return NextResponse.json({ error: "لا تملك صلاحية الإزالة." }, { status: 403 });
    }

    const member = await prisma.orgMember.findUnique({ where: { id: memberId } });
    if (!member || member.orgId !== orgId) {
      return NextResponse.json({ error: "العضو غير موجود." }, { status: 404 });
    }

    // حماية: لا يمكن حذف آخر OWNER
    if (member.role === "OWNER") {
      const ownerCount = await prisma.orgMember.count({
        where: { orgId, role: "OWNER", isActive: true },
      });
      if (ownerCount <= 1) {
        return NextResponse.json(
          { error: "لا يمكن حذف المالك الوحيد للمنظمة." },
          { status: 400 }
        );
      }
    }

    await prisma.orgMember.delete({ where: { id: memberId } });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("DELETE member error:", e);
    return NextResponse.json({ error: e.message || "حدث خطأ." }, { status: 500 });
  }
}
