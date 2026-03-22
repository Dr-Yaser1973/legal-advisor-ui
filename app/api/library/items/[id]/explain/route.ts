 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

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
اشرح النص القانوني التالي بلغة عربية بسيطة جدًا للمواطن العادي.
- استخدم نقاط واضحة
- أضف مثالًا حياتيًا بسيطًا
- تجنب المصطلحات القانونية المعقدة
`,
    pro: `
اشرح النص القانوني التالي شرحًا قانونيًا احترافيًا موجّهًا لمحامٍ أو طالب قانون.
- اربط التفسير بالقواعد العامة في القانون
- استشهد بالفقه العربي
- أضف تفسيرًا تشريعيًا
- استخدم أسلوب أكاديمي منظم بعناوين فرعية
`,
    business: `
اشرح النص القانوني التالي من منظور الشركات والأعمال.
- ركز على الأثر التعاقدي
- المخاطر القانونية
- الالتزامات المحتملة
- توصيات عملية لتقليل النزاعات
- مثال تجاري تطبيقي
`,
  };

  const prompt = `
${styleMap[level]}

عنوان المادة:
${title}

نص المادة:
${content.slice(0, 5000)}

مطلوب:
- صياغة عربية واضحة
- تنظيم الشرح بعناوين ونقاط
- عدم الإطالة غير المفيدة
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "أنت فقيه قانوني عربي متخصص في شرح القوانين بأسلوب علمي ومنهجي.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  return completion.choices[0]?.message?.content?.trim() || "";
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
      (searchParams.get("level") as
        | "basic"
        | "pro"
        | "business") || "basic";

    const articleText = (searchParams.get("text") || "").trim();

    if (!articleText) {
      return NextResponse.json({
        ok: false,
        error: "يرجى إدخال نص المادة للشرح",
      });
    }

    // =========================
    // 1) جلب المادة من المكتبة
    // =========================
    const item = await prisma.libraryItem.findUnique({
      where: { id },
      select: {
        id: true,
        titleAr: true,
        // ✅ استخدام الحقول الموجودة
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
    let existingExplanation = null;
    if (level === "basic") existingExplanation = item.basicExplanation;
    else if (level === "pro") existingExplanation = item.professionalExplanation;
    else if (level === "business") existingExplanation = item.commercialExplanation;

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
    const explanation = await generateExplanation(
      item.titleAr,
      articleText,
      level
    );

    if (!explanation) {
      throw new Error("AI returned empty explanation");
    }

    // =========================
    // 4) حفظ في الحقل المناسب
    // =========================
    const updateData: any = {};
    if (level === "basic") updateData.basicExplanation = explanation;
    else if (level === "pro") updateData.professionalExplanation = explanation;
    else if (level === "business") updateData.commercialExplanation = explanation;

    await prisma.libraryItem.update({
      where: { id: item.id },
      data: updateData,
    });

    // =========================
    // 5) رد نهائي
    // =========================
    return NextResponse.json({
      ok: true,
      cached: false,
      level,
      explanation,
    });
    
  } catch (err) {
    console.error("AI EXPLAIN ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "فشل إنشاء شرح المادة" },
      { status: 500 }
    );
  }
}