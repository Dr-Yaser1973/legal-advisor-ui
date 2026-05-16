 // app/api/contracts/generate/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTemplateBySlug } from "@/lib/contracts/catalog";
import { fillPlaceholders } from "@/lib/contracts/engine/placeholders";
import { validateData } from "@/lib/contracts/engine/validate";
import { wrapHtmlDoc } from "@/lib/contracts/engine/wrap";
import { hasPermission, getUserPlanData } from "@/lib/plans";

export const runtime = "nodejs";

type GenerateBody = {
  slug: string;
  lang: "ar" | "en";
  data: Record<string, any>;
};

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as any;
    if (!session?.user?.id) {
      return NextResponse.json({ error: "يجب تسجيل الدخول." }, { status: 401 });
    }
    const userId = Number(session.user.id);

    // ===============================
    // التحقق من الباقة
    // ===============================
    const planData = await getUserPlanData(userId);

    if (!planData) {
      return NextResponse.json(
        { error: "تعذر التحقق من بيانات الاشتراك." },
        { status: 500 }
      );
    }

    if (!hasPermission(planData.effectivePlan, "contracts")) {
      return NextResponse.json(
        {
          error: "توليد العقود غير متاح في باقتك الحالية. يرجى الترقية إلى باقة الأفراد أو أعلى.",
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    // ===============================
    // التحقق من البيانات
    // ===============================
    const body = (await req.json()) as GenerateBody;
    if (!body?.slug || !body?.lang || !body?.data) {
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
            governingLawClause:
              "يخضع هذا العقد ويُفسَّر وفقًا لأحكام القانون المدني العراقي رقم (40) لسنة 1951، ما لم يُتفق صراحةً على خلاف ذلك.",
            jurisdictionClause:
              "تختص محاكم العراق بالنظر في أي نزاع ينشأ عن هذا العقد، ما لم يتفق الطرفان على التحكيم.",
          }
        : {
            governingLawClause:
              "This Agreement shall be governed by and construed in accordance with the Iraqi Civil Code No. (40) of 1951, unless expressly agreed otherwise.",
            jurisdictionClause:
              "The competent courts of Baghdad shall have jurisdiction over any dispute arising out of this Agreement unless arbitration is agreed.",
          };

    const merged: Record<string, any> = {
      ...defaults,
      ...(body.data ?? {}),
    };

    // ===============================
    // التحقق من صحة البيانات وتوليد العقد
    // ===============================
    const v = validateData(
      { slug: tpl.slug, title: tpl.title, lang: tpl.lang, group: tpl.group, body: tpl.html },
      merged
    );
    if (!v.ok) {
      return NextResponse.json({ error: v.error, missing: v.missing }, { status: 400 });
    }

    const filled = fillPlaceholders(tpl.html, merged);
    const htmlBody = wrapHtmlDoc(filled, lang);

    const title =
      `${tpl.title} — ${merged.partyAName ?? ""} / ${merged.partyBName ?? ""}`.trim();

    // ===============================
    // حفظ العقد
    // ===============================
    const created = await prisma.generatedContract.create({
      data: {
        title,
        partyA: (merged.partyAName ?? "") || null,
        partyB: (merged.partyBName ?? "") || null,
        subject: (merged.goodsDesc ?? merged.servicesScope ?? merged.purpose ?? "") || null,
        pdfPath: "PENDING",
        data: {
          htmlBody,
          lang,
          templateSlug: tpl.slug,
          group: tpl.group,
          input: merged,
        } as any,
        createdById: userId,
      },
      select: { id: true },
    });

    const pdfPath = `/api/contracts/generated/${created.id}/pdf`;

    await prisma.generatedContract.update({
      where: { id: created.id },
      data: { pdfPath },
    });

    return NextResponse.json({ ok: true, id: created.id, pdfUrl: pdfPath });
  } catch (e) {
    console.error("contracts/generate error:", e);
    return NextResponse.json({ error: "فشل توليد العقد" }, { status: 500 });
  }
}