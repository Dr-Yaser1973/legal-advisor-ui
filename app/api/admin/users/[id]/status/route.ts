 // app/api/admin/users/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type UserStatusValue = "ACTIVE" | "PENDING" | "SUSPENDED" | "EXPIRED";

type UserRoleValue =
  | "ADMIN"
  | "CLIENT"
  | "LAWYER"
  | "COMPANY"
  | "TRANSLATION_OFFICE";

type BodyType = {
  status?: UserStatusValue;
  role?: UserRoleValue;
  subscriptionEndsAt?: string | null;
};

// مهم: params هنا Promise
type RouteParams = Promise<{ id: string }>;

export async function PATCH(
  req: NextRequest,
  context: { params: RouteParams }
) {
  // نفكّ الـ Promise ونأخذ id
  const { id } = await context.params;
  const userId = Number(id);

  const session: any = await getServerSession(authOptions as any);
  const currentUser: any = session?.user ?? null;

  // التحقق أن المستدعي هو ADMIN
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  if (!userId || Number.isNaN(userId)) {
    return NextResponse.json(
      { error: "معرّف مستخدم غير صالح" },
      { status: 400 }
    );
  }

  const body = (await req.json()) as BodyType;
  const data: any = {};

  if (body.status) {
    data.status = body.status;
  }

  if (body.role) {
    data.role = body.role;
  }

  if (body.subscriptionEndsAt !== undefined) {
    data.subscriptionEndsAt = body.subscriptionEndsAt
      ? new Date(body.subscriptionEndsAt)
      : null;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "لا توجد بيانات لتحديثها" },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        isApproved: true,
        subscriptionEndsAt: true,
      },
    });

    return NextResponse.json({ ok: true, user: updated });
  } catch (err) {
    console.error("[ADMIN_UPDATE_USER_STATUS]", err);
    return NextResponse.json(
      { error: "تعذر تحديث المستخدم" },
      { status: 500 }
    );
  }
}
