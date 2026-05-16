
// app/api/firm-consult/[id]/offer/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export const runtime = "nodejs";

// POST: المكتب يقدم عرضاً على الطلب
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const requestId = Number(params.id);
    if (isNaN(requestId)) return NextResponse.json({ error: "معرف غير صالح." }, { status: 400 });

    const body = await req.json();
    const { fee, currency, note } = body || {};

    if (!fee) return NextResponse.json({ error: "الأتعاب مطلوبة." }, { status: 400 });

    // التحقق من وجود الطلب
    const request = await prisma.firmConsultRequest.findUnique({
      where: { id: requestId },
      select: { id: true, clientId: true, subject: true, status: true },
    });
    if (!request) return NextResponse.json({ error: "الطلب غير موجود." }, { status: 404 });
    if (request.status !== "PENDING") {
      return NextResponse.json({ error: "لا يمكن تقديم عرض على هذا الطلب." }, { status: 400 });
    }

    // إنشاء العرض وتحديث حالة الطلب
    const [offer] = await prisma.$transaction([
      prisma.firmConsultOffer.create({
        data: {
          requestId,
          fee: Number(fee),
          currency: currency || "USD",
          note: note || null,
        },
      }),
      prisma.firmConsultRequest.update({
        where: { id: requestId },
        data: { status: "OFFER_SENT" },
      }),
    ]);

    // إشعار للعميل
    await prisma.notification.create({
      data: {
        userId: request.clientId,
        title: "عرض جديد من مكتب محاماة",
        body: `تلقيت عرضاً على استشارتك "${request.subject}" — اضغط لعرض التفاصيل.`,
      },
    });

    return NextResponse.json({ ok: true, offer });
  } catch (e: any) {
    console.error("POST /api/firm-consult/[id]/offer error:", e);
    return NextResponse.json({ error: e.message || "حدث خطأ." }, { status: 500 });
  }
}
