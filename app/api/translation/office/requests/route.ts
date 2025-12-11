 import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as any;
  const user = session?.user as any;

  if (!user) {
    return NextResponse.json(
      { ok: false, error: "يجب تسجيل الدخول" },
      { status: 401 }
    );
  }

  if (user.role !== "TRANSLATION_OFFICE") {
    return NextResponse.json(
      { ok: false, error: "ليست لديك صلاحية عرض طلبات الترجمة الرسمية" },
      { status: 403 }
    );
  }

  const officeId = Number(user.id);

  const requests = await prisma.translationRequest.findMany({
    where: {
      officeId,
      status: {
        in: ["PENDING", "ACCEPTED", "IN_PROGRESS"],
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      sourceDoc: {
        select: {
          id: true,
          title: true,
          filename: true,
        },
      },
    },
  });

  const items = requests.map((r) => ({
    id: r.id,
    status: r.status,
    targetLang: r.targetLang,
    hasPrice: r.price != null,
    sourceDoc: {
      id: r.sourceDoc.id,
      title: r.sourceDoc.title,
      filename: r.sourceDoc.filename,
    },
    client: {
      id: r.client.id,
      name: r.client.name,
      email: r.client.email,
    },
  }));

  return NextResponse.json({ ok: true, items });
}
