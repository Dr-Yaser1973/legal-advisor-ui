import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/jwt";
import { getTemplateBySlug } from "@/lib/contracts/catalog";
import { fillPlaceholders } from "@/lib/contracts/engine/placeholders";
import { validateData } from "@/lib/contracts/engine/validate";
import { wrapHtmlDoc } from "@/lib/contracts/engine/wrap";
import { hasPermission, getUserPlanData } from "@/lib/plans";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    const payload = await verifyUserToken(authHeader.split(" ")[1]);
    const userId = Number(payload.sub);

    // التحقق من الباقة
    const planData = await getUserPlanData(userId);
    if (!planData) {
      return NextResponse.json({ error: "تعذر التحقق من الاشتراك." }, { status: 500 });
    }
    if (!hasPermission(planData.effectivePlan, "contracts")) {
      return NextResponse.json(
        { error: "توليد العقود غير متاح في باقتك الحالية.", upgradeRequired: true },
        { status: 403 }
      );
    }

    const body = await req.json();
    if (!body?.slug || !body?.data) {
      return NextResponse.json({ error: "بيانات غير مكتملة." }, { status: 400 });
    }

    const tpl = getTemplateBySlug(body.slug);
    if (!tpl) {
      return NextResponse.json({ error: "القالب غير موجود." }, { status: 404 });
    }

    const lang = tpl.lang;
    const defaults =
      lang === "ar"
        ? {
            governingLawClause: "يخضع هذا العقد لأحكام القانون المدني العراقي رقم (40) لسنة 1951.",
            jurisdictionClause: "تختص محاكم العراق بالنظر في أي نزاع ينشأ عن هذا العقد.",
          }
        : {
            governingLawClause: "This Agreement shall be governed by the Iraqi Civil Code No. (40) of 1951.",
            jurisdictionClause: "The competent courts of Baghdad shall have jurisdiction.",
          };

    const merged = { ...defaults, ...body.data };

    const v = validateData(
      { slug: tpl.slug, title: tpl.title, lang: tpl.lang, group: tpl.group, body: tpl.html },
      merged
    );
    if (!v.ok) {
      return NextResponse.json({ error: v.error, missing: v.missing }, { status: 400 });
    }

    const filled = fillPlaceholders(tpl.html, merged);
    const htmlBody = wrapHtmlDoc(filled, lang);
    const title = `${tpl.title} — ${merged.partyAName ?? merged.lessorName ?? ""}`.trim();

    const created = await prisma.generatedContract.create({
      data: {
        title,
        partyA: (merged.partyAName ?? merged.lessorName ?? "") || null,
        partyB: (merged.partyBName ?? merged.lesseeName ?? "") || null,
        subject: (merged.goodsDesc ?? merged.propertyDescription ?? "") || null,
        pdfPath: "PENDING",
        data: { htmlBody, lang, templateSlug: tpl.slug, group: tpl.group, input: merged } as any,
        createdById: userId,
      },
      select: { id: true },
    });

    const pdfPath = `/api/contracts/generated/${created.id}/pdf`;
    await prisma.generatedContract.update({
      where: { id: created.id },
      data: { pdfPath },
    });

    // رابط كامل ليُفتح في الموبايل
    const fullPdfUrl = `https://smartlegaladvisor.com${pdfPath}`;

    return NextResponse.json({ ok: true, id: created.id, pdfUrl: fullPdfUrl });
  } catch (e) {
    console.error("mobile contracts/generate error:", e);
    return NextResponse.json({ error: "فشل توليد العقد" }, { status: 500 });
  }
}
