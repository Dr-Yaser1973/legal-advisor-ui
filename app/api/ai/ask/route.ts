 import { NextResponse } from "next/server";
import OpenAI from "openai";
import { semanticSearch } from "@/lib/search";

export const runtime = "nodejs";

const CHAT_MODEL = process.env.CHAT_MODEL ?? "gpt-4o-mini";

// ===============================
// Factory آمن
// ===============================
function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  return new OpenAI({ apiKey });
}

// ===============================
// POST
// ===============================
export async function POST(req: Request) {
  try {
    const { question, topK } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "الرجاء إدخال سؤال." },
        { status: 400 }
      );
    }

    // 1) استرجاع المقاطع الأعلى صلة
    const top = await semanticSearch(question, topK ?? 8);

    const context = top
      .map(
        (t, i) =>
          `المقطع ${i + 1} (من: ${t.title}) [درجة الصلة: ${t.score.toFixed(
            3
          )}]\n${t.snippet}`
      )
      .join("\n\n---\n\n");

    const system =
      "أنت مساعد قانوني يجيب بدقة وبالعربية الفصحى، ويذكر المراجع ضمن النص إذا توفرت. " +
      "إن لم يكن السياق كافيًا، اذكر ذلك صراحة واطلب مزيدًا من المعلومات.";

    const userPrompt =
      `السؤال:\n${question}\n\n` +
      `السياق القانوني المسترجَع (لا تُخترع معلومات غير موجودة):\n${context}\n\n` +
      "التعليمات:\n" +
      "- قدّم خلاصة واضحة ومحدّدة.\n" +
      "- إن وجدت مواد/بنود ذات صلة فاذكر رقمها ونصّها المقتبس باقتضاب.\n" +
      "- أرفق قائمة موجزة بالمراجع في النهاية إن أمكن.";

    // 2) توليد الإجابة
    const openai = getOpenAI();

    const resp = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
    });

    const answer = resp.choices[0]?.message?.content ?? "تعذّر توليد إجابة.";
    return NextResponse.json({ ok: true, answer, references: top });
  } catch (err: any) {
    console.error("ask error:", err);

    if (err.message?.includes("OPENAI_API_KEY")) {
      return NextResponse.json(
        { ok: false, error: "خدمة الذكاء الاصطناعي غير مفعّلة حالياً" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء معالجة السؤال." },
      { status: 500 }
    );
  }
}
