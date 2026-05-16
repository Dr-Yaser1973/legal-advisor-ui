// app/api/admin/users/[id]/plan/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { activatePlan } from "@/lib/plans";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type UserPlanValue = "FREE" | "INDIVIDUAL" | "LAWYER" | "TRANSLATION" | "BUSINESS";

const VALID_PLANS: UserPlanValue[] = ["FREE", "INDIVIDUAL", "LAWYER", "TRANSLATION", "BUSINESS"];

 export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ===============================
    // التحقق من صلاحية الأدمن
    // ===============================
    const session: any = await getServerSession(authOptions as any);
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: "غير مصرح." }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ ok: false, error: "هذه العملية للأدمن فقط." }, { status: 403 });
    }

    // ===============================
    // التحقق من المعرف والباقة
    // ===============================
     const { id } = await params;
    const userId = Number(id);
    if (!Number.isFinite(userId)) {
      return NextResponse.json({ ok: false, error: "معرف المستخدم غير صالح." }, { status: 400 });
    }

    const body = await req.json();
    const plan = body.plan as UserPlanValue;

    if (!VALID_PLANS.includes(plan)) {
      return NextResponse.json({ ok: false, error: "الباقة غير صالحة." }, { status: 400 });
    }

    // ===============================
    // التحقق من وجود المستخدم
    // ===============================
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ ok: false, error: "المستخدم غير موجود." }, { status: 404 });
    }

    // ===============================
    // تفعيل الباقة
    // ===============================
    await activatePlan(userId, plan);

    const updated = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        plan: true,
        points: true,
        subscriptionEndsAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      user: {
        ...updated,
        subscriptionEndsAt: updated?.subscriptionEndsAt?.toISOString() ?? null,
      },
    });
  } catch (e: any) {
    console.error("ADMIN_ACTIVATE_PLAN_ERROR", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "فشل تفعيل الباقة." },
      { status: 500 }
    );
  }
}

