 // app/api/company/employees/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export const runtime = "nodejs";

// مساعد: يتحقق أن المستخدم مدير عام له فرع
async function getManager(email: string) {
  const dbUser = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      isManager: true,
      branchId: true,
      branch: { include: { org: true } },
    },
  });
  if (!dbUser?.isManager || !dbUser.branch) return null;
  return dbUser;
}

// DELETE: إيقاف تفعيل موظف
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const user = session.user as any;
    const manager = await getManager(user.email);
    if (!manager) {
      return NextResponse.json({ error: "هذه الصلاحية للمدير العام فقط." }, { status: 403 });
    }

    const { id } = await params;
    const employeeId = Number(id);
    if (isNaN(employeeId)) return NextResponse.json({ error: "معرف غير صالح." }, { status: 400 });

    // التحقق أن الموظف ينتمي لنفس المؤسسة
    const employee = await prisma.user.findUnique({
      where: { id: employeeId },
      include: { branch: true },
    });

    if (!employee || employee.branch?.orgId !== manager.branch!.orgId) {
      return NextResponse.json({ error: "الموظف غير موجود." }, { status: 404 });
    }

    if (employee.id === manager.id) {
      return NextResponse.json({ error: "لا يمكنك حذف حسابك الخاص." }, { status: 400 });
    }

    // حماية إضافية: لا يُحذف مدير آخر عبر هذا المسار
    if ((employee as any).isManager) {
      return NextResponse.json({ error: "لا يمكن إيقاف حساب مدير." }, { status: 400 });
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