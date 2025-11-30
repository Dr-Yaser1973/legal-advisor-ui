// app/api/admin/users/[id]/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions as any);
  const user: any = session?.user;

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const userId = Number(params.id);
  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: "معرّف مستخدم غير صالح" }, { status: 400 });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { isApproved: true },
      select: { id: true, name: true, email: true, role: true, isApproved: true },
    });

    return NextResponse.json({ ok: true, user: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "تعذر تحديث المستخدم (تحقق من أنّه موجود)" },
      { status: 500 }
    );
  }
}

