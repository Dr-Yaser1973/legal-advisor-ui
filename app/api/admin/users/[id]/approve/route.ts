 // app/api/admin/users/[id]/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type RouteParams = Promise<{ id: string }>;

export async function POST(
  _req: NextRequest,
  context: { params: RouteParams }
) {
  const { id } = await context.params;
  const userId = Number(id);

  const session: any = await getServerSession(authOptions as any);
  const currentUser: any = session?.user ?? null;

  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: "معرّف مستخدم غير صالح" }, { status: 400 });
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        status: true,
        branchId: true,
        branch: {
          select: {
            orgId: true,
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    const nextStatus = existing.status === "PENDING" ? "ACTIVE" : existing.status;

    // اعتماد المستخدم واعتماد المؤسسة معاً في transaction
    const [updated] = await prisma.$transaction([
      // ١. اعتماد المستخدم
      prisma.user.update({
        where: { id: userId },
        data: { isApproved: true, status: nextStatus },
        select: {
          id: true, name: true, email: true,
          role: true, status: true, isApproved: true,
        },
      }),
      // ٢. اعتماد المؤسسة إن وجدت
      ...(existing.branch?.orgId
        ? [prisma.organization.update({
            where: { id: existing.branch.orgId },
            data: { isApproved: true },
          })]
        : []
      ),
    ]);

    return NextResponse.json({ ok: true, user: updated });
  } catch (err) {
    console.error("[ADMIN_APPROVE_USER]", err);
    return NextResponse.json(
      { error: "تعذر اعتماد المستخدم" },
      { status: 500 }
    );
  }
}