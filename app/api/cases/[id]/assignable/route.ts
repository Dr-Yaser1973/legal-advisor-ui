//app/api/cases/[id]/assignable/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

// يجلب موظفي مؤسسة مالك القضية — القابلين للتكليف
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const userId = Number(session.user.id);
    const isAdmin = session.user.role === "ADMIN";

    const { id } = await params;
    const caseId = Number(id);
    if (isNaN(caseId)) return NextResponse.json({ error: "معرف غير صالح." }, { status: 400 });

    // جلب القضية ومالكها
    const c = await prisma.case.findUnique({
      where: { id: caseId },
      select: { userId: true },
    });
    if (!c) return NextResponse.json({ error: "القضية غير موجودة." }, { status: 404 });

    // التحقق أن الطالب مدير عام أو منشئ القضية أو أدمن
    const me = await prisma.user.findUnique({
      where: { id: userId },
      select: { isManager: true, branch: { select: { orgId: true } } },
    });

    const isOwner = c.userId === userId;
    if (!isAdmin && !isOwner && !me?.isManager) {
      return NextResponse.json({ error: "لا تملك صلاحية التكليف." }, { status: 403 });
    }

    // orgId الخاص بمالك القضية — منه نجلب الموظفين
    const owner = await prisma.user.findUnique({
      where: { id: c.userId },
      select: { branch: { select: { orgId: true } } },
    });
    const orgId = owner?.branch?.orgId;
    if (!orgId) {
      return NextResponse.json({ items: [] }); // قضية فردية بلا مؤسسة
    }

    // كل أعضاء المؤسسة (موظفو الشركة / محامو المكتب)
    const employees = await prisma.user.findMany({
      where: { branch: { orgId }, status: "ACTIVE" },
      select: { id: true, name: true, email: true, isManager: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ items: employees });
  } catch (e: any) {
    console.error("GET assignable error:", e);
    return NextResponse.json({ error: "حدث خطأ." }, { status: 500 });
  }
}
