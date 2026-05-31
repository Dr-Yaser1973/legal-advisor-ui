//app/api/mobile/consultations/human/my/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    const payload: any = await verifyUserToken(authHeader.split(" ")[1]);
    const clientId = Number(payload.sub);

    const items = await prisma.humanConsultRequest.findMany({
      where: { clientId },
      orderBy: { id: "desc" },
      include: {
        consultation: { select: { id: true, title: true, description: true } },
        chatRoom: { select: { id: true } },
        offers: {
          orderBy: { id: "desc" },
          include: {
            lawyer: {
              select: {
                id: true, name: true,
                lawyerProfile: {
                  select: { specialties: true, city: true, rating: true },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ ok: true, items });
  } catch (error) {
    console.error("mobile human/my error:", error);
    return NextResponse.json({ error: "تعذر جلب الاستشارات." }, { status: 500 });
  }
}
