 // app/api/admin/users/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// مهم: params هنا Promise
type RouteParams = Promise<{ id: string }>;

export async function PATCH(
  req: NextRequest,
  context: { params: RouteParams }
) {
  // نفك الـ Promise هنا
  const { id } = await context.params;
  const userId = Number(id);

  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  if (!userId || Number.isNaN(userId)) {
    return NextResponse.json({ error: "معرّف غير صالح" }, { status: 400 });
  }

  const body = await req.json();

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      status: body.status,
      role: body.role,
      subscriptionEndsAt: body.subscriptionEndsAt
        ? new Date(body.subscriptionEndsAt)
        : undefined, // أو null حسب ما تحب
    },
  });

  return NextResponse.json({ ok: true, user: updated });
}
