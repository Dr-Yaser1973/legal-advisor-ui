// app/api/team-workload/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    // المدير فقط
    const manager = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isManager: true, branch: { select: { orgId: true } } },
    });
    if (!manager?.isManager || !manager.branch?.orgId) {
      return NextResponse.json({ error: "هذه الصلاحية للمدير العام فقط." }, { status: 403 });
    }

    const orgId = manager.branch.orgId;

    // موظفو المؤسسة (غير المدير)
    const employees = await prisma.user.findMany({
      where: { branch: { orgId }, isManager: false },
      select: { id: true, name: true, email: true },
      orderBy: { createdAt: "asc" },
    });

    const employeeIds = employees.map((e) => e.id);

    // القضايا المكلّف بها هؤلاء الموظفون
    const caseAssignments = await prisma.caseAssignment.findMany({
      where: { userId: { in: employeeIds } },
      select: {
        userId: true,
        role: true,
        case: { select: { id: true, title: true, status: true } },
      },
    });

    // الاستشارات المكلّف بها
    const consults = await prisma.firmConsultRequest.findMany({
      where: { assignedTo: { in: employeeIds } },
      select: { id: true, subject: true, status: true, assignedTo: true },
    });

    // تجميع لكل موظف
    const team = employees.map((emp) => {
      const empCases = caseAssignments
        .filter((a) => a.userId === emp.id && a.case)
        .map((a) => ({
          id: a.case!.id,
          title: a.case!.title,
          status: a.case!.status,
          role: a.role, // LEAD | ASSISTANT
        }));

      const empConsults = consults
        .filter((c) => c.assignedTo === emp.id)
        .map((c) => ({ id: c.id, subject: c.subject, status: c.status }));

      return {
        id: emp.id,
        name: emp.name,
        email: emp.email,
        cases: empCases,
        consults: empConsults,
        total: empCases.length + empConsults.length,
      };
    });

    return NextResponse.json({ team });
  } catch (e: any) {
    console.error("GET /api/team-workload error:", e);
    return NextResponse.json({ error: "حدث خطأ." }, { status: 500 });
  }
}
