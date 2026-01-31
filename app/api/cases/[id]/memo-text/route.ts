 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { requireCaseAccess } from "@/lib/auth/guards";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);

    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "معرّف القضية غير صالح." }, { status: 400 });
    }

    const auth = await requireCaseAccess(id);
    if (!auth.ok) return auth.res;

    const c = await prisma.case.findUnique({ where: { id } });
    if (!c) {
      return NextResponse.json({ error: "القضية غير موجودة" }, { status: 404 });
    }

    const body = (await req.json().catch(() => ({}))) as { tone?: string };
    const tone = (body.tone || "professional").toString();

    const prompt = `اكتب مذكرة قانونية نصية (بدون PDF) للقضية التالية مع توصيات عملية.\n\nالعنوان: ${
      c.title ?? ""
    }\nالوصف: ${c.description ?? ""}\nا 👥 الأطراف: ${JSON.stringify(c.parties ?? {}, null, 2)}
\n\nنبرة الكتابة: ${tone}`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const memoText = completion.choices?.[0]?.message?.content?.trim() || "";
    if (!memoText) {
      return NextResponse.json({ error: "تعذر توليد النص." }, { status: 500 });
    }

    await prisma.caseEvent.create({
      data: { caseId: id, title: "مذكرة AI (نص)", note: memoText, date: new Date() },
    });

    return NextResponse.json({ ok: true, memoText });
  } catch (e: any) {
    console.error("memo-text error:", e);
    return NextResponse.json({ error: e?.message || "فشل توليد النص." }, { status: 500 });
  }
}
