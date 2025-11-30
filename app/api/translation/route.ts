 import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, fromLang, toLang, mode } = body;

    const styleMap: Record<string, string> = {
      formal: "ترجمة قانونية رسمية بصياغة دقيقة وواضحة.",
      simple: "ترجمة عربية مبسطة وسهلة الفهم.",
      free: "ترجمة حرة بأسلوب عربي طبيعي.",
    };

    const prompt = `
ترجم النص التالي من ${fromLang} إلى ${toLang}.
نمط الترجمة المطلوب: ${styleMap[mode]}.
النص:
${text}
    `;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const translated = completion.choices[0].message.content;

    return NextResponse.json({ translated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "فشل الترجمة" }, { status: 500 });
  }
}
