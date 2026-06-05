 // app/api/company/employees/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

// مساعد: يتحقق أن المستخدم مدير عام له فرع، ويعيد بياناته
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

// GET: جلب موظفي المؤسسة
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const user = session.user as any;
    const manager = await getManager(user.email);
    if (!manager) {
      return NextResponse.json({ error: "هذه الصلاحية للمدير العام فقط." }, { status: 403 });
    }

    const orgId = manager.branch!.orgId;
    const org = manager.branch!.org;

    // كل موظفي المؤسسة عدا المدير نفسه
    const employees = await prisma.user.findMany({
      where: { branch: { orgId }, isManager: false },
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
    const manager = await getManager(user.email);
    if (!manager) {
      return NextResponse.json({ error: "هذه الصلاحية للمدير العام فقط." }, { status: 403 });
    }

    const org = manager.branch!.org;
    const orgId = org.id;
    const branchId = manager.branchId!;

    // التحقق من الحد الأقصى (الموظفون فقط، لا المدير)
    const currentCount = await prisma.user.count({
      where: { branch: { orgId }, isManager: false },
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
        role: "COMPANY",     // موظف المؤسسة (شركة أو مكتب) يُعامل كـ COMPANY
        status: "ACTIVE",
        isApproved: true,
        branchId,
        plan: "BUSINESS",
        isManager: false,
      },
      select: { id: true, name: true, email: true, status: true },
    });

    return NextResponse.json({ ok: true, employee }, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/company/employees error:", e);
    return NextResponse.json({ error: e.message || "حدث خطأ." }, { status: 500 });
  }
}