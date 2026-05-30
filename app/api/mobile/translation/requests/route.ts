//app/api/mobile/translation/requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── إرسال طلب ترجمة رسمية ──
export async function POST(req: NextRequest) {
  try {
    
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
    }
    const payload: any = await verifyUserToken(authHeader.split(" ")[1]);
     const clientId = Number(payload.sub); 

    const body = await req.json();
    const officeId = Number(body.officeId);
    const sourceDocId = Number(body.documentId);
    const targetLang: "AR" | "EN" = body.targetLang === "AR" ? "AR" : "EN";

    if (!Number.isFinite(officeId) || officeId <= 0) {
      return NextResponse.json({ ok: false, error: "مكتب الترجمة غير محدد." }, { status: 400 });
    }
    if (!Number.isFinite(sourceDocId) || sourceDocId <= 0) {
      return NextResponse.json({ ok: false, error: "المستند غير محدد." }, { status: 400 });
    }

    const office = await prisma.user.findUnique({
      where: { id: officeId },
      select: { id: true, role: true, isApproved: true },
    });
    if (!office || office.role !== "TRANSLATION_OFFICE") {
      return NextResponse.json({ ok: false, error: "مكتب الترجمة غير صحيح." }, { status: 400 });
    }
    if (!office.isApproved) {
      return NextResponse.json({ ok: false, error: "هذا المكتب غير معتمد بعد." }, { status: 400 });
    }

    const doc = await prisma.legalDocument.findUnique({
      where: { id: sourceDocId },
      select: { id: true, filePath: true },
    });
    if (!doc || !doc.filePath) {
      return NextResponse.json({ ok: false, error: "المستند غير موجود." }, { status: 400 });
    }

    const request = await prisma.translationRequest.create({
      data: { clientId, officeId, sourceDocId, targetLang, status: "PENDING" },
    });

    try {
      await prisma.notification.create({
        data: {
          userId: officeId,
          title: "طلب ترجمة رسمية جديد",
          body: `يوجد طلب ترجمة جديد برقم ${request.id} بانتظار مراجعتكم.`,
        },
      });
    } catch (notifyErr) {
      console.error("notification error (ignored):", notifyErr);
    }

    return NextResponse.json({
      ok: true,
      requestId: request.id,
      message: "تم إرسال طلب الترجمة الرسمية إلى المكتب.",
    });
    
    } catch (err: any) {
    console.error("mobile translation requests POST error:", err);
    return NextResponse.json(
      { ok: false, error: "خطأ داخلي", debug: err?.message || String(err) },
      { status: 500 }
      
    );
  }
}

// ── متابعة طلباتي ──
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
    }
    const payload: any = await verifyUserToken(authHeader.split(" ")[1]);
     const clientId = Number(payload.sub); 

    const requests = await prisma.translationRequest.findMany({
      where: { clientId },
      orderBy: { id: "desc" },
      select: {
        id: true,
        status: true,
        targetLang: true,
        createdAt: true,
        office: { select: { name: true } },
        sourceDoc: { select: { title: true } },
      },
    });

    return NextResponse.json({ ok: true, requests });
  } catch (err) {
    console.error("mobile translation requests GET error:", err);
    return NextResponse.json({ ok: false, error: "خطأ في جلب الطلبات." }, { status: 500 });
  }
}
