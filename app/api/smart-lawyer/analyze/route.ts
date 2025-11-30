
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { fileToText } from "@/lib/fileToText";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const CHAT_MODEL = process.env.CHAT_MODEL ?? "gpt-4o-mini";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const title = (form.get("title") as string) || "";
    const rawTextInput = (form.get("text") as string) || "";

    let text = rawTextInput.trim();
    if (!text && file) text = (await fileToText(file)).trim();

    if (!text || text.length < 30) {
      return NextResponse.json({ error: "النص قصير أو غير موجود." }, { status: 400 });
    }

    // يمكنك هنا استرجاع نصوص/مواد مرتبطة من مكتبتك لو رغبت
    const system =
      "أنت محامٍ خبير. حلّل النص القانوني بدقة وبالعربية الفصحى بنبرة رسمية، " +
      "وقدّم رأيًا قانونيًا موجزًا يتضمن: (وصف النص، الأساس القانوني المحتمل، الملاحظات والثغرات، الرأي النهائي).";

    const prompt =
      `النص محل التحليل:\n` +
      `---\n${text}\n---\n\n` +
      `قدّم تحليلًا قانونيًا منظّمًا ومباشرًا.`;

    const resp = await openai.chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0.25,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    });

    const analysis = resp.choices[0]?.message?.content?.trim() || "تعذّر التحليل.";

    // (اختياري) حفظ سجل التحليل
    if (title) {
      await prisma.legalAnalysis.create({
        data: { title, text, result: analysis },
      }).catch(()=>null);
    }

    return NextResponse.json({ analysis });
  } catch (e: any) {
    console.error("smart-lawyer analyze error:", e);
    return NextResponse.json({ error: e.message || "فشل التحليل" }, { status: 500 });
  }
}
