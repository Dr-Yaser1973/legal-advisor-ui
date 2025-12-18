 // app/api/contracts/generate/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type Body = {
  templateId?: number;
  partyA?: string;
  partyB?: string;
  subject?: string;
  extra?: string;
  notes?: string; // دعم الفرونت الحالي
};

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول لاستخدام توليد العقود." },
        { status: 401 }
      );
    }

    const userIdRaw = session?.user?.id;
    const userId = userIdRaw ? Number(userIdRaw) : null;

    const body = (await req.json()) as Body;
    const { templateId, partyA, partyB, subject } = body;
    const extra = body.extra ?? body.notes ?? "";

    if (!templateId || !partyA || !partyB || !subject) {
      return NextResponse.json(
        { error: "يجب ملء جميع الحقول الإلزامية." },
        { status: 400 }
      );
    }

    const tpl = await prisma.contractTemplate.findUnique({
      where: { id: Number(templateId) },
    });

    if (!tpl) {
      return NextResponse.json({ error: "قالب العقد غير موجود." }, { status: 404 });
    }

    const model = process.env.CONTRACT_MODEL || "gpt-4.1-mini";

    const completion = await openai.chat.completions.create({
      model,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "أنت مستشار قانوني متخصص في صياغة العقود باللغة العربية الفصحى. " +
            "اكتب عقداً متكاملاً بصياغة احترافية. استخدم HTML بسيط فقط: <h1>, <h2>, <p>, <ol>, <li>.",
        },
        {
          role: "user",
          content: `
اكتب عقداً بناءً على المعلومات التالية:

نوع العقد (من القالب): ${tpl.title}
نص القالب (إرشادي):
${tpl.bodyHtml}

الطرف الأول: ${partyA}
الطرف الثاني: ${partyB}
موضوع العقد: ${subject}

تفاصيل إضافية:
${extra || "لا توجد تفاصيل إضافية."}

المطلوب:
- عنوان رئيسي أعلى الصفحة.
- ديباجة قصيرة.
- بنود مرقمة.
- نزاعات + قانون واجب التطبيق (العراق افتراضاً).
- خاتمة + تواقيع.
`,
        },
      ],
    });

    const htmlBody = completion.choices[0]?.message?.content?.trim();
    if (!htmlBody) {
      return NextResponse.json(
        { error: "فشل توليد نص العقد من نموذج الذكاء الاصطناعي." },
        { status: 500 }
      );
    }

    const title = `${tpl.title} بين ${partyA} و ${partyB}`;

    // pdfPath إجباري في السكيمة: نضعه مؤقتاً ثم نحدّثه
    const created = await prisma.generatedContract.create({
      data: {
        templateId: tpl.id,
        sourceDocId: null,
        title,
        partyA,
        partyB,
        subject,
        pdfPath: "PENDING",
        data: {
          htmlBody,
          extra,
          templateSlug: tpl.slug,
          model,
        },
        createdById: userId ?? null,
      },
    });

    const pdfPath = `/api/contracts/generated/${created.id}/pdf`;

    const generated = await prisma.generatedContract.update({
      where: { id: created.id },
      data: { pdfPath },
    });

    return NextResponse.json({ ok: true, id: generated.id, pdfUrl: generated.pdfPath });
  } catch (e: any) {
    console.error("contracts/generate error:", e);
    return NextResponse.json(
      { error: e?.message ?? "فشل توليد العقد" },
      { status: 500 }
    );
  }
}
