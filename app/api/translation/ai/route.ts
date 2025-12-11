import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text: string = body.text;
    const fromLang: "AR" | "EN" = body.fromLang === "EN" ? "EN" : "AR";
    const toLang: "AR" | "EN" = body.toLang === "EN" ? "EN" : "AR";
    const mode: string = body.mode || "formal";

    if (!text || !text.trim()) {
      return NextResponse.json(
        { ok: false, error: "لا يوجد نص للترجمة" },
        { status: 400 }
      );
    }

    const style =
      mode === "simple"
        ? "بأسلوب مبسط وواضح لغير المختصين"
        : mode === "free"
        ? "مع إمكانية إعادة الصياغة لتحسين الأسلوب"
        : mode === "review"
        ? "بدقة عالية جدًا مع تدقيق قانوني شديد دون فقدان أي معنى"
        : "بدقة عالية بأسلوب قانوني رسمي دون شرح أو تعليقات إضافية";

    const systemPrompt =
      fromLang === "AR"
        ? `أنت مترجم قانوني محترف. ترجم النص التالي من العربية إلى ${
            toLang === "EN" ? "الإنجليزية" : "العربية"
          } ${style}.`
        : `You are a professional legal translator. Translate the following text from English to ${
            toLang === "AR" ? "Arabic" : "English"
          } ${style}.`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
    });

    const translated =
      completion.choices[0]?.message?.content?.toString() || "";

    return NextResponse.json({ ok: true, translated });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "فشل تنفيذ الترجمة الذكية" },
      { status: 500 }
    );
  }
}

