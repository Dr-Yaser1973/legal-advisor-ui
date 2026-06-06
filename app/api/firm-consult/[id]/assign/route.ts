// app/api/firm-consult/[id]/assign/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

// POST: تكليف موظف بمتابعة استشارة (للمدير فقط)
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const { id } = await params;
    const requestId = Number(id);
    if (isNaN(requestId)) return NextResponse.json({ error: "معرف غير صالح." }, { status: 400 });

    // المدير الحالي
    const manager = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, isManager: true, branch: { select: { orgId: true } } },
    });
    if (!manager?.isManager || !manager.branch?.orgId) {
      return NextResponse.json({ error: "هذه الصلاحية للمدير العام فقط." }, { status: 403 });
    }

    // الاستشارة — يجب أن تكون ضمن مؤسسة المدير
    const consult = await prisma.firmConsultRequest.findUnique({
      where: { id: requestId },
      select: { orgId: true },
    });
    if (!consult || consult.orgId !== manager.branch.orgId) {
      return NextResponse.json({ error: "الاستشارة ليست ضمن مؤسستك." }, { status: 404 });
    }

    const body = await req.json();
    const employeeId = Number(body?.employeeId);
    if (!employeeId) return NextResponse.json({ error: "حدد الموظف." }, { status: 400 });

    // الموظف يجب أن يكون ضمن نفس المؤسسة
    const employee = await prisma.user.findUnique({
      where: { id: employeeId },
      select: { branch: { select: { orgId: true } } },
    });
    if (!employee || employee.branch?.orgId !== manager.branch.orgId) {
      return NextResponse.json({ error: "الموظف ليس ضمن مؤسستك." }, { status: 400 });
    }

    await prisma.firmConsultRequest.update({
      where: { id: requestId },
      data: { assignedTo: employeeId },
    });

    // إشعار الموظف (اختياري — جدول Notification موجود)
    await prisma.notification.create({
      data: {
        userId: employeeId,
        title: "تكليف باستشارة جديدة",
        body: "كُلّفت بمتابعة استشارة في مكتبك. راجع لوحتك.",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("POST assign consult error:", e);
    return NextResponse.json({ error: e.message || "حدث خطأ." }, { status: 500 });
  }
}

// DELETE: إلغاء التكليف
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const { id } = await params;
    const requestId = Number(id);
    if (isNaN(requestId)) return NextResponse.json({ error: "معرف غير صالح." }, { status: 400 });

    const manager = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isManager: true, branch: { select: { orgId: true } } },
    });
    if (!manager?.isManager || !manager.branch?.orgId) {
      return NextResponse.json({ error: "هذه الصلاحية للمدير العام فقط." }, { status: 403 });
    }

    const consult = await prisma.firmConsultRequest.findUnique({
      where: { id: requestId },
      select: { orgId: true },
    });
    if (!consult || consult.orgId !== manager.branch.orgId) {
      return NextResponse.json({ error: "الاستشارة ليست ضمن مؤسستك." }, { status: 404 });
    }

    await prisma.firmConsultRequest.update({
      where: { id: requestId },
      data: { assignedTo: null },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("DELETE assign consult error:", e);
    return NextResponse.json({ error: "حدث خطأ." }, { status: 500 });
  }
}
