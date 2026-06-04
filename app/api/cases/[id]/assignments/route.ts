 //app/api/cases/[id]/assignments/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

// مساعد: هل المستخدم يدير تكليف هذه القضية؟
// (الأدمن، أو منشئ القضية، أو المدير العام لنفس شركة القضية)
async function canManageAssignments(userId: number, isAdmin: boolean, caseId: number) {
  if (isAdmin) return true;

  const c = await prisma.case.findUnique({
    where: { id: caseId },
    select: { userId: true },
  });
  if (!c) return false;

  // منشئ القضية
  if (c.userId === userId) return true;

  // المدير العام لنفس شركة القضية
  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: { isManager: true, branch: { select: { orgId: true } } },
  });
  if (!me?.isManager || !me.branch?.orgId) return false;

  const owner = await prisma.user.findUnique({
    where: { id: c.userId },
    select: { branch: { select: { orgId: true } } },
  });

  return owner?.branch?.orgId === me.branch.orgId;
}

// GET: قائمة المكلّفين بالقضية
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const { id } = await params;
    const caseId = Number(id);
    if (isNaN(caseId)) return NextResponse.json({ error: "معرف غير صالح." }, { status: 400 });

    const assignments = await prisma.caseAssignment.findMany({
      where: { caseId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { role: "asc" },
    });

    return NextResponse.json({ items: assignments });
  } catch (e: any) {
    console.error("GET assignments error:", e);
    return NextResponse.json({ error: "حدث خطأ." }, { status: 500 });
  }
}

// POST: تكليف موظف بالقضية
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const userId = Number(session.user.id);
    const isAdmin = session.user.role === "ADMIN";

    const { id } = await params;
    const caseId = Number(id);
    if (isNaN(caseId)) return NextResponse.json({ error: "معرف غير صالح." }, { status: 400 });

    if (!(await canManageAssignments(userId, isAdmin, caseId))) {
      return NextResponse.json({ error: "فقط المدير أو مالك القضية يكلّف الموظفين." }, { status: 403 });
    }

    const body = await req.json();
    const { employeeId, role } = body || {};
    if (!employeeId) return NextResponse.json({ error: "حدد الموظف." }, { status: 400 });

    const assignRole = role === "LEAD" ? "LEAD" : "ASSISTANT";

    // التحقق أن الموظف من نفس شركة مالك القضية
    const c = await prisma.case.findUnique({
      where: { id: caseId },
      select: { userId: true },
    });
    if (!c) return NextResponse.json({ error: "القضية غير موجودة." }, { status: 404 });

    const owner = await prisma.user.findUnique({
      where: { id: c.userId },
      select: { branch: { select: { orgId: true } } },
    });
    const employee = await prisma.user.findUnique({
      where: { id: Number(employeeId) },
      select: { branch: { select: { orgId: true } } },
    });

    const ownerOrgId = owner?.branch?.orgId;
    if (!employee || !ownerOrgId || employee.branch?.orgId !== ownerOrgId) {
      return NextResponse.json({ error: "الموظف ليس ضمن نفس المؤسسة." }, { status: 400 });
    }

    // منع وجود أكثر من LEAD: إن كُلّف LEAD جديد، نخفّض القديم إلى مساعد
    if (assignRole === "LEAD") {
      await prisma.caseAssignment.updateMany({
        where: { caseId, role: "LEAD" },
        data: { role: "ASSISTANT" },
      });
    }

    const assignment = await prisma.caseAssignment.upsert({
      where: { caseId_userId: { caseId, userId: Number(employeeId) } },
      update: { role: assignRole },
      create: { caseId, userId: Number(employeeId), role: assignRole, assignedBy: userId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    // تحديث assignedTo في القضية ليعكس المحامي الرئيسي
    if (assignRole === "LEAD") {
      await prisma.case.update({ where: { id: caseId }, data: { assignedTo: Number(employeeId) } });
    }

    return NextResponse.json({ ok: true, assignment });
  } catch (e: any) {
    console.error("POST assignments error:", e);
    return NextResponse.json({ error: e.message || "حدث خطأ." }, { status: 500 });
  }
}

// DELETE: إزالة تكليف
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const userId = Number(session.user.id);
    const isAdmin = session.user.role === "ADMIN";

    const { id } = await params;
    const caseId = Number(id);

    const { searchParams } = new URL(req.url);
    const employeeId = Number(searchParams.get("employeeId"));
    if (isNaN(caseId) || isNaN(employeeId)) {
      return NextResponse.json({ error: "معرف غير صالح." }, { status: 400 });
    }

    if (!(await canManageAssignments(userId, isAdmin, caseId))) {
      return NextResponse.json({ error: "فقط المدير أو مالك القضية يدير التكليف." }, { status: 403 });
    }

    await prisma.caseAssignment.delete({
      where: { caseId_userId: { caseId, userId: employeeId } },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("DELETE assignment error:", e);
    return NextResponse.json({ error: "حدث خطأ." }, { status: 500 });
  }
}