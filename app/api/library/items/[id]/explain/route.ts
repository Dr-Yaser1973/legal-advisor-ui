 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// ===============================
// قطع النص بشكل صحيح عند مسافة
// ===============================
function safeSlice(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  const cut = text.lastIndexOf(" ", maxChars);
  return cut > 0 ? text.slice(0, cut) + "..." : text.slice(0, maxChars) + "...";
}

// ===============================
// توليد الشرح حسب المستوى
// ===============================
async function generateExplanation(
  title: string,
  content: string,
  level: "basic" | "pro" | "business"
) {
  const styleMap = {
    basic: `
اشرح النص القانوني التالي بلغة عربية بسيطة جداً موجّهة للمواطن العادي غير المتخصص.

الإخراج المطلوب (التزم بهذا الترتيب):
1. جملة تلخيصية واحدة تشرح هدف المادة ببساطة
2. ثلاث إلى خمس نقاط مرقّمة تشرح أبرز ما تقوله المادة
3. مثال حياتي واقعي من البيئة العراقية يوضح تطبيق المادة
4. ملاحظة ختامية: ماذا يعني هذا للمواطن في حياته اليومية؟

قواعد:
- تجنّب المصطلحات القانونية المعقدة تماماً، أو اشرحها فور ذكرها
- لا تتجاوز 300 كلمة
- استخدم لغة ودية وواضحة
`,
    pro: `
اشرح النص القانوني التالي شرحاً قانونياً أكاديمياً احترافياً موجّهاً للمحامين وطلاب القانون والقضاة.

الإخراج المطلوب (التزم بهذا الترتيب):
1. التكييف القانوني: ما طبيعة هذه المادة وموقعها في المنظومة التشريعية؟
2. التفسير التشريعي: ما الغاية التي أرادها المشرّع من هذا النص؟
3. الأساس الفقهي: اربط المادة بالقواعد العامة في القانون المدني والفقه العربي المقارن
4. المقارنة التشريعية: قارن المادة بنظيراتها في القوانين العربية المشابهة (مصر، الأردن، الكويت إن أمكن)
5. الاستثناءات والحالات الخاصة التي قد تُطبَّق فيها المادة بشكل مختلف
6. الإشكاليات التطبيقية المحتملة أمام القضاء

قواعد:
- أسلوب أكاديمي منظّم مع عناوين فرعية واضحة
- لا تتجاوز 600 كلمة
- استند إلى النص ولا تخترع أحكاماً غير موجودة فيه
`,
    business: `
اشرح النص القانوني التالي من منظور الشركات والأعمال التجارية، موجّهاً لأصحاب الأعمال والمستثمرين والمديرين الماليين.

الإخراج المطلوب (التزم بهذا الترتيب):
1. الأثر التعاقدي: كيف تؤثر هذه المادة على العقود والاتفاقيات التجارية؟
2. المخاطر القانونية: اذكر المخاطر مرتّبةً من الأعلى أثراً إلى الأدنى
3. الالتزامات: ما الالتزامات التي تفرضها المادة على الشركات والأفراد؟
4. ثلاث توصيات عملية قابلة للتطبيق فوراً لتقليل النزاعات وحماية المصالح التجارية
5. مثال تجاري تطبيقي من بيئة الأعمال العراقية

قواعد:
- ركّز على الجانب العملي لا النظري
- استخدم لغة تجارية مباشرة
- لا تتجاوز 450 كلمة
`,
  };

  const systemPrompt = `أنت مستشار قانوني متخصص في القانون العراقي والعربي المقارن، تعمل ضمن منصة "المستشار القانوني الذكي".

مهمتك شرح النصوص القانونية بدقة تامة مع مراعاة السياق التشريعي العراقي.

قواعد صارمة:
- لا تتجاوز النص ولا تخترع أحكاماً غير موجودة فيه
- إذا كان النص غامضاً، أشر إلى ذلك صراحةً
- اكتب بالعربية الفصحى الواضحة دائماً
- التزم بتنسيق الإخراج المطلوب في كل مستوى`;

  const userPrompt = `
${styleMap[level]}

عنوان المادة / القانون:
${title}

نص المادة:
${safeSlice(content, 5000)}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
    max_tokens: 1500,
  });

  const result = completion.choices[0]?.message?.content?.trim() || "";

  // التحقق من جودة المخرج
  if (result.length < 100) {
    throw new Error("الشرح المُولَّد قصير جداً، يرجى المحاولة مجدداً");
  }

  return result;
}

// ===============================
// GET /api/library/items/[id]/explain
// ===============================
export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;

    const { searchParams } = new URL(req.url);
    const level =
      (searchParams.get("level") as "basic" | "pro" | "business") || "basic";
    const articleText = (searchParams.get("text") || "").trim();

    if (!articleText) {
      return NextResponse.json({
        ok: false,
        error: "يرجى إدخال نص المادة للشرح",
      });
    }

    // =========================
    // 1) جلب المادة من قاعدة البيانات
    // =========================
    const item = await prisma.libraryItem.findUnique({
      where: { id },
      select: {
        id: true,
        titleAr: true,
        basicExplanation: true,
        professionalExplanation: true,
        commercialExplanation: true,
      },
    });

    if (!item) {
      return NextResponse.json(
        { ok: false, error: "المادة غير موجودة" },
        { status: 404 }
      );
    }

    // =========================
    // 2) التحقق من وجود شرح مخبأ
    // =========================
    const existingMap = {
      basic: item.basicExplanation,
      pro: item.professionalExplanation,
      business: item.commercialExplanation,
    };

    const existingExplanation = existingMap[level];

    if (existingExplanation) {
      return NextResponse.json({
        ok: true,
        cached: true,
        level,
        explanation: existingExplanation,
      });
    }

    // =========================
    // 3) توليد شرح جديد
    // =========================
    const explanation = await generateExplanation(item.titleAr, articleText, level);

    // =========================
    // 4) حفظ في الحقل المناسب
    // =========================
    const fieldMap = {
      basic: { basicExplanation: explanation },
      pro: { professionalExplanation: explanation },
      business: { commercialExplanation: explanation },
    };

    await prisma.libraryItem.update({
      where: { id: item.id },
      data: fieldMap[level],
    });

    // =========================
    // 5) الرد النهائي
    // =========================
    return NextResponse.json({
      ok: true,
      cached: false,
      level,
      explanation,
    });
  } catch (err: any) {
    console.error("AI EXPLAIN ERROR:", err);

    const message =
      err?.message?.includes("قصير جداً")
        ? err.message
        : "فشل إنشاء شرح المادة، يرجى المحاولة مجدداً";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}