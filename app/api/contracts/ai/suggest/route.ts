
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function POST(req: Request) {
  try {
    if (!openai) {
      return NextResponse.json({
        suggestions: "لم يتم ضبط OPENAI_API_KEY، سيتم تفعيل الاقتراحات لاحقًا."
      });
    }
    const { template, vars, draft } = await req.json();

    const prompt =
      `صيغ اقتراحات بنود قانونية موجزة لتحسين هذا العقد (${template}):\n\n` +
      `المتغيرات: ${JSON.stringify(vars, null, 2)}\n\n` +
      `المسودة:\n${draft}\n\n` +
      `أعد 5 بنود محسّنة بالعربية بنقاط مختصرة.`;

    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const suggestions = resp.choices[0]?.message?.content?.trim() || "لا اقتراحات.";
    return NextResponse.json({ suggestions });
  } catch (e: any) {
    console.error("contracts/ai/suggest error:", e);
    return NextResponse.json({ suggestions: "تعذر جلب الاقتراحات الآن." }, { status: 200 });
  }
}
