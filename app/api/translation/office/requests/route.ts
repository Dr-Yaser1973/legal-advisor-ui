 import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/translation/office/requests
export async function GET() {
  const session = (await getServerSession(authOptions as any)) as any;
  const user = session?.user as any;

  if (!user) {
    return NextResponse.json(
      { ok: false, error: "يجب تسجيل الدخول" },
      { status: 401 }
    );
  }

  if (user.role !== "TRANSLATION_OFFICE" || !user.isApproved) {
    return NextResponse.json(
      { ok: false, error: "ليست لديك صلاحية عرض طلبات الترجمة الرسمية" },
      { status: 403 }
    );
  }

  // نعرض الطلبات المعلّقة غير المخصّصة لأي مكتب بعد
  const requests = await prisma.translationRequest.findMany({
    where: {
      status: "PENDING", // TranslationStatus.PENDING
      officeId: null,
    },
    orderBy: {
      createdAt: "desc",
    },
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
    note: null as string | null, // يمكن لاحقاً إضافة حقل ملاحظات من العميل لو موجود في الجدول
    createdAt: r.createdAt.toISOString(),
    targetLang: r.targetLang, // "AR" أو "EN"
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
