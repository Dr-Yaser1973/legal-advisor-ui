 // app/api/firm-consult/[id]/offer/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { notifyUser } from "@/lib/notify";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "غير مصرح." }, { status: 401 });

    const { id } = await params;
    const requestId = Number(id);
    if (isNaN(requestId)) return NextResponse.json({ error: "معرف غير صالح." }, { status: 400 });

    const body = await req.json();
    const { fee, currency, note } = body || {};

    if (!fee) return NextResponse.json({ error: "الأتعاب مطلوبة." }, { status: 400 });

    const request = await prisma.firmConsultRequest.findUnique({
      where: { id: requestId },
      select: { id: true, clientId: true, subject: true, status: true },
    });
    if (!request) return NextResponse.json({ error: "الطلب غير موجود." }, { status: 404 });
    if (request.status !== "PENDING") {
      return NextResponse.json({ error: "لا يمكن تقديم عرض على هذا الطلب." }, { status: 400 });
    }

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

    // إشعار العميل داخل المنصة + إيميل (best-effort — خارج الترانزاكشن)
    try {
      await notifyUser({
        userId: request.clientId,
        title: "عرض جديد من مكتب محاماة",
        body: `تلقيت عرضاً على استشارتك "${request.subject}" — اضغط لعرض التفاصيل.`,
        emailKind: "new_offer",
        emailData: {
          subject: request.subject,
          offerPath: "/firm-consult/my",
        },
      });
    } catch (notifyError) {
      console.error("فشل إشعار العميل بعرض المكتب:", notifyError);
    }

    return NextResponse.json({ ok: true, offer });
  } catch (e: any) {
    console.error("POST /api/firm-consult/[id]/offer error:", e);
    return NextResponse.json({ error: e.message || "حدث خطأ." }, { status: 500 });
  }
}