
import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { text, title } = await req.json();

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

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const answer = completion.choices[0]?.message?.content ?? "لم يتم توليد تحليل.";

    return NextResponse.json({ analysis: answer });
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء تحليل النص." }, { status: 500 });
  }
}
