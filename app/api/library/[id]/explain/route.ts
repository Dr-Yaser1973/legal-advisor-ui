 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// ===============================
// Helpers
// ===============================
function safeParse(json: string) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// ===============================
// توليد الشرح حسب المستوى + مادة واحدة
// ===============================
async function generateExplanation(
  lawTitle: string,
  articleLabel: string,
  articleText: string,
  level: "basic" | "pro" | "business"
) {
  const styleMap = {
    basic: `
اشرح المادة القانونية التالية بلغة عربية بسيطة جدًا للمواطن العادي.
- استخدم نقاط واضحة
- أضف مثالًا حياتيًا بسيطًا
- تجنب المصطلحات القانونية المعقدة
`,
    pro: `
اشرح المادة القانونية التالية شرحًا قانونيًا احترافيًا موجّهًا لمحامٍ أو طالب قانون.
- اربط التفسير بالقواعد العامة في القانون المدني
- استشهد بالفقه العربي وخاصة:
  • السنهوري (الوسيط في شرح القانون المدني)
  • المبادئ العامة في القوانين المدنية العربية
- أضف تفسيرًا تشريعيًا ومقارنة مختصرة بين العراق ومصر/الأردن إن أمكن
- استخدم أسلوب أكاديمي منظم بعناوين فرعية
`,
    business: `
اشرح المادة القانونية التالية من منظور الشركات والأعمال.
- ركز على الأثر التعاقدي
- المخاطر القانونية
- الالتزامات المحتملة
- توصيات عملية لتقليل النزاعات
- مثال تجاري تطبيقي
`,
  };

  const prompt = `
${styleMap[level]}

اسم القانون:
${lawTitle}

رقم المادة:
${articleLabel}

نص المادة:
${articleText.slice(0, 5000)}

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
          "أنت فقيه قانوني عربي متخصص في شرح القوانين المدنية والفقه المقارن بأسلوب علمي ومنهجي.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  return completion.choices[0]?.message?.content?.trim() || "";
}

// ===============================
// GET /api/library/[id]/explain
// params:
//  - level=basic|pro|business
//  - article=رقم المادة (اختياري)
//  - text=نص المادة (اختياري)
// ===============================
export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const lawUnitId = Number(id);

    if (!Number.isFinite(lawUnitId)) {
      return NextResponse.json(
        { ok: false, error: "Bad id" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const level =
      (searchParams.get("level") as
        | "basic"
        | "pro"
        | "business") || "basic";

    const articleNo = (searchParams.get("article") || "").trim();
    const articleText = (searchParams.get("text") || "").trim();

    if (!articleNo && !articleText) {
      return NextResponse.json({
        ok: false,
        error: "يرجى تحديد رقم المادة أو نص المادة للشرح",
      });
    }

    // =========================
    // 1) جلب القانون
    // =========================
    const unit = await prisma.lawUnit.findUnique({
      where: { id: lawUnitId },
      select: {
        id: true,
        title: true,
        simplified: true,
      },
    });

    if (!unit) {
      return NextResponse.json(
        { ok: false, error: "Not found" },
        { status: 404 }
      );
    }

    // =========================
    // 2) تجهيز مفتاح كاش فريد
    // =========================
    const cacheKey = `${level}::${articleNo || "text"}::${articleText.slice(
      0,
      50
    )}`;

    let store = safeParse(unit.simplified || "") || {};

    if (store[cacheKey]) {
      return NextResponse.json({
        ok: true,
        cached: true,
        level,
        article: articleNo || "custom",
        explanation: store[cacheKey],
      });
    }

    // =========================
    // 3) توليد الشرح
    // =========================
    const explanation = await generateExplanation(
      unit.title,
      articleNo || "—",
      articleText || "المادة مطلوبة من المستخدم",
      level
    );

    if (!explanation) {
      throw new Error("AI returned empty explanation");
    }

    // =========================
    // 4) حفظ في الكاش داخل simplified
    // =========================
    store[cacheKey] = explanation;

    await prisma.lawUnit.update({
      where: { id: unit.id },
      data: {
        simplified: JSON.stringify(store).slice(0, 15000),
      },
    });

    // =========================
    // 5) رد نهائي
    // =========================
    return NextResponse.json({
      ok: true,
      cached: false,
      level,
      article: articleNo || "custom",
      explanation,
    });
  } catch (err) {
    console.error("ARTICLE EXPLAIN ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "فشل إنشاء شرح المادة" },
      { status: 500 }
    );
  }
}
