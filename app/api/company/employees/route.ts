// app/api/company/employees/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

// GET: جلب موظفي الشركة
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const user = session.user as any;
    if (user.role !== "COMPANY") return NextResponse.json({ error: "غير مصرح." }, { status: 403 });

    // جلب المؤسسة عبر الفرع
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { branch: { include: { org: true } } },
    });

    if (!dbUser?.branch) return NextResponse.json({ error: "لا توجد مؤسسة مرتبطة." }, { status: 404 });

    const orgId = dbUser.branch.orgId;
    const org   = dbUser.branch.org;

    // جلب كل موظفي المؤسسة
    const employees = await prisma.user.findMany({
      where: { branch: { orgId }, role: "COMPANY" },
      select: {
        id: true, name: true, email: true, phone: true,
        status: true, isApproved: true, createdAt: true,
        branch: { select: { name: true, city: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      employees,
      org: { id: org.id, name: org.name, maxUsers: org.maxUsers },
      currentCount: employees.length,
      canAddMore: employees.length < org.maxUsers,
    });
  } catch (e: any) {
    console.error("GET /api/company/employees error:", e);
    return NextResponse.json({ error: "حدث خطأ." }, { status: 500 });
  }
}

// POST: إضافة موظف جديد
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const user = session.user as any;
    if (user.role !== "COMPANY") return NextResponse.json({ error: "غير مصرح." }, { status: 403 });

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { branch: { include: { org: true } } },
    });

    if (!dbUser?.branch) return NextResponse.json({ error: "لا توجد مؤسسة مرتبطة." }, { status: 404 });

    const org     = dbUser.branch.org;
    const orgId   = org.id;
    const branchId = dbUser.branchId!;

    // التحقق من الحد الأقصى
    const currentCount = await prisma.user.count({
      where: { branch: { orgId }, role: "COMPANY" },
    });

    if (currentCount >= org.maxUsers) {
      return NextResponse.json({
        error: `وصلت الحد الأقصى للمستخدمين (${org.maxUsers}). قم بترقية الباقة لإضافة المزيد.`,
        upgradeRequired: true,
      }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, phone, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ error: "البريد وكلمة المرور مطلوبان." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return NextResponse.json({ error: "هذا البريد مسجّل مسبقاً." }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);

    const employee = await prisma.user.create({
      data: {
        name: name || null,
        email: email.toLowerCase(),
        phone: phone || null,
        password: hashed,
        role: "COMPANY",
        status: "ACTIVE",
        isApproved: true,
        branchId,
        plan: "BUSINESS", // يرث باقة الشركة
        isManager: false,   // ← الموظف المُضاف ليس مديراً
      },
      select: { id: true, name: true, email: true, status: true },
    });

    return NextResponse.json({ ok: true, employee }, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/company/employees error:", e);
    return NextResponse.json({ error: e.message || "حدث خطأ." }, { status: 500 });
  }
}

