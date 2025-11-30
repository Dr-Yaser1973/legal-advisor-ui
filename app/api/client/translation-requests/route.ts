// app/api/client/translation-requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as any;
const user = session?.user as any;


  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  // نسمح للمستخدم العادي أو الشركة
  if (user.role !== "CLIENT" && user.role !== "COMPANY") {
    return NextResponse.json({ error: "صلاحية غير كافية" }, { status: 403 });
  }

  const requests = await prisma.translationRequest.findMany({
    where: { clientId: Number(user.id) },
    orderBy: { createdAt: "desc" },
    include: {
      sourceDoc: true,
      office: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json({ items: requests });
}

