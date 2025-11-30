 // app/api/contracts/smart-draft/route.ts
import { NextResponse } from "next/server";
import { openai } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { scenario } = body;

    const prompt = `
اكتب مسودة عقد قانوني باللغة العربية بناءً على الوصف التالي:

${scenario}

أعطِ:
- تمهيد
- بنود تفصيلية
- واجبات الطرفين
- شروط فسخ العقد
- أحكام عامة

اكتب بصياغة قانونية احترافية.
`.trim();

    const aiResponse = await openai.responses.create({
      model: process.env.CHAT_MODEL ?? "gpt-4.1-mini",
      input: prompt,
    });

    const draft =
      ((aiResponse as any).output?.[0]?.content?.[0]?.text as string | undefined)?.trim() ??
      "لم يتم توليد مسودة للعقد.";

    return NextResponse.json({ draft });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "فشل توليد المسودة" },
      { status: 500 }
    );
  }
}
