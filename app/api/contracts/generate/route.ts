// app/api/contracts/generate/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTemplateBySlug } from "@/lib/contracts/catalog";
import { fillPlaceholders } from "@/lib/contracts/engine/placeholders";
import { validateData } from "@/lib/contracts/engine/validate";
import { wrapHtmlDoc } from "@/lib/contracts/engine/wrap";

export const runtime = "nodejs";

type GenerateBody = {
  slug: string;              // template slug
  lang: "ar" | "en";         // output language
  data: Record<string, any>; // form data
};

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as any;
    if (!session?.user?.id) {
      return NextResponse.json({ error: "يجب تسجيل الدخول." }, { status: 401 });
    }
    const userId = Number(session.user.id);

    const body = (await req.json()) as GenerateBody;
    if (!body?.slug || !body?.lang || !body?.data) {
      return NextResponse.json({ error: "بيانات غير مكتملة." }, { status: 400 });
    }

    const tpl = getTemplateBySlug(body.slug);
    if (!tpl) return NextResponse.json({ error: "القالب غير موجود." }, { status: 404 });

    // نجبر اللغة على لغة القالب (حتى لا تختلط)
    const lang = tpl.lang;

    // حقول افتراضية للقانون/الاختصاص (يمكن تخصيصها لاحقًا)
    const defaults =
      lang === "ar"
        ? {
            governingLawClause:
              "يخضع هذا العقد ويُفسَّر وفقًا لأحكام القانون المدني العراقي رقم (40) لسنة 1951، ما لم يُتفق صراحةً على خلاف ذلك.",
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


    // Validator (including Incoterms rules)
    const v = validateData(
      { slug: tpl.slug, title: tpl.title, lang: tpl.lang, group: tpl.group, body: tpl.html },
      merged
    );
    if (!v.ok) {
      return NextResponse.json({ error: v.error, missing: v.missing }, { status: 400 });
    }

    // Render: Fill placeholders -> Wrap
    const filled = fillPlaceholders(tpl.html, merged);
    const htmlBody = wrapHtmlDoc(filled, lang);

    const title =
      lang === "ar"
        ? `${tpl.title} — ${merged.partyAName ?? ""} / ${merged.partyBName ?? ""}`.trim()
        : `${tpl.title} — ${merged.partyAName ?? ""} / ${merged.partyBName ?? ""}`.trim();

    // Save
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

    // ✅ هذا هو المسار الذي قلت لا نغيره
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
