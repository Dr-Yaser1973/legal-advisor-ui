 import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// ===============================
// Factory آمن لإنشاء OpenAI
// ===============================
function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  return new OpenAI({ apiKey });
}

// ===============================
// POST
// ===============================
export async function POST(req: Request) {
  try {
    const { text, title } = await req.json();

    if (!text || !title) {
      return NextResponse.json(
        { error: "النص والعنوان مطلوبان للتحليل" },
        { status: 400 }
      );
    }

    const prompt = `
أنت مستشار قانوني ذكي متخصص في تحليل القوانين العراقية.
قم بتحليل النص الآتي تحت عنوان: "${title}".

المطلوب:
1. استخراج الفكرة الأساسية.
2. تحديد الهدف التشريعي من النص.
3. بيان الإشكالات المحتملة في التطبيق العملي.
4. اقتراح تعديل أو تفسير إذا لزم الأمر.

النص:
${text}
`;

    const openai = getOpenAI();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const answer =
      completion.choices[0]?.message?.content ?? "لم يتم توليد تحليل.";

    return NextResponse.json({ analysis: answer });
  } catch (error: any) {
    console.error("AI Error:", error);

    if (error.message?.includes("OPENAI_API_KEY")) {
      return NextResponse.json(
        { error: "خدمة الذكاء الاصطناعي غير مفعّلة حالياً" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "حدث خطأ أثناء تحليل النص." },
      { status: 500 }
    );
  }
}
