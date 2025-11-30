 // app/api/contracts/generate/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import OpenAI from "openai";
import { renderContractPdf } from "@/lib/contractPdf";

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
};

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions as any);
    const userIdRaw = session?.user?.id;
    const userId = userIdRaw ? Number(userIdRaw) : null;

    if (!session) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول لاستخدام توليد العقود." },
        { status: 401 },
      );
    }

    const body = (await req.json()) as Body;
    const { templateId, partyA, partyB, subject, extra } = body;

    if (!templateId || !partyA || !partyB || !subject) {
      return NextResponse.json(
        { error: "يجب ملء جميع الحقول الإلزامية." },
        { status: 400 },
      );
    }

    const tpl = await prisma.contractTemplate.findUnique({
      where: { id: templateId },
    });

    if (!tpl) {
      return NextResponse.json(
        { error: "قالب العقد غير موجود." },
        { status: 404 },
      );
    }

    // 🧠 استدعاء OpenAI لتوليد نص/HTML العقد
    const model = process.env.CONTRACT_MODEL || "gpt-4.1-mini";

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "أنت مستشار قانوني متخصص في صياغة العقود باللغة العربية الفصحى." +
            " اكتب عقداً قانونياً متكاملاً بصياغة احترافية، مع مراعاة أن النص سيطبع بصيغة PDF،" +
            " فاحرص على الترتيب والعناوين والترقيم، واستخدم عناصر HTML بسيطة مثل <h1>, <h2>, <p>, <ol>, <li> فقط.",
        },
        {
          role: "user",
          content: `
اكتب عقداً بناءً على المعلومات التالية:

نوع العقد (من القالب): ${tpl.title}
نص القالب (إرشادي، يمكنك تعديله وتحسينه):
${tpl.bodyHtml}

الطرف الأول: ${partyA}
الطرف الثاني: ${partyB}
موضوع العقد: ${subject}

تفاصيل إضافية (إن وجدت):
${extra || "لا توجد تفاصيل إضافية صريحة."}

المطلوب:
- عنوان رئيسي للعقد في أعلى الصفحة.
- ديباجة قصيرة تعرّف بالأطراف وموضوع العقد.
- بنود مترابطة ومنظمة (1، 2، 3، ...).
- فقرة خاصة بحل النزاعات والقانون الواجب التطبيق (يمكن افتراض الاختصاص العراقي ما لم يُذكر غير ذلك).
- فقرة ختامية وتواقيع الأطراف.
- لا تستخدم CSS متقدم أو جداول؛ استخدم فقط عناصر HTML النصية البسيطة.
`,
        },
      ],
      temperature: 0.4,
    });

    const aiContent = completion.choices[0]?.message?.content?.trim();
    if (!aiContent) {
      return NextResponse.json(
        {
          error:
            "فشل توليد نص العقد من نموذج الذكاء الاصطناعي. حاول مرة أخرى لاحقاً.",
        },
        { status: 500 },
      );
    }

    // هنا نفترض أن النموذج أعاد HTML جاهز أو نص قريب من HTML
    const htmlBody = aiContent;

    // 🖨️ توليد PDF وحفظه في مجلد public/contracts
    const { relPath, size } = await renderContractPdf(htmlBody);

    // إنشاء LegalDocument لملف الـ PDF
    const filename = relPath.split("/").pop() || "contract.pdf";

    const legalDoc = await prisma.legalDocument.create({
      data: {
        title: `${tpl.title} بين ${partyA} و ${partyB}`,
        filename,
        mimetype: "application/pdf",
        size,
      },
    });

    // إنشاء سجل GeneratedContract
    const generated = await prisma.generatedContract.create({
      data: {
        templateId: tpl.id,
        sourceDocId: legalDoc.id,
        title: `${tpl.title} بين ${partyA} و ${partyB}`,
        partyA,
        partyB,
        subject,
        pdfPath: "/" + relPath.replace(/\\/g, "/"), // مسار يمكن فتحه من المتصفح
        data: {
          extra,
          templateSlug: tpl.slug,
          model,
        },
        createdById: userId ?? null,
      },
    });

    return NextResponse.json({
      ok: true,
      id: generated.id,
      pdfUrl: generated.pdfPath,
    });
  } catch (e: any) {
    console.error("contracts/generate error:", e);
    return NextResponse.json(
      { error: e?.message ?? "فشل توليد العقد" },
      { status: 500 },
    );
  }
}
