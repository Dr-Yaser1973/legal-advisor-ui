// app/api/company/employees/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export const runtime = "nodejs";

// DELETE: إيقاف تفعيل موظف
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const user = session.user as any;
    if (user.role !== "COMPANY") return NextResponse.json({ error: "غير مصرح." }, { status: 403 });

    const { id } = await params;
    const employeeId = Number(id);
    if (isNaN(employeeId)) return NextResponse.json({ error: "معرف غير صالح." }, { status: 400 });

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { branch: true },
    });

    if (!dbUser?.branch) return NextResponse.json({ error: "غير مصرح." }, { status: 403 });

    // التحقق أن الموظف ينتمي لنفس المؤسسة
    const employee = await prisma.user.findUnique({
      where: { id: employeeId },
      include: { branch: true },
    });

    if (!employee || employee.branch?.orgId !== dbUser.branch.orgId) {
      return NextResponse.json({ error: "الموظف غير موجود." }, { status: 404 });
    }

    if (employee.id === dbUser.id) {
      return NextResponse.json({ error: "لا يمكنك حذف حسابك الخاص." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: employeeId },
      data: { status: "SUSPENDED", isApproved: false },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("DELETE /api/company/employees/[id] error:", e);
    return NextResponse.json({ error: "حدث خطأ." }, { status: 500 });
  }
}
