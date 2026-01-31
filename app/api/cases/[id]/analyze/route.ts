 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAnswer } from "@/lib/ai";
import { requireCaseAccess } from "@/lib/auth/guards";



export const runtime = "nodejs";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);

    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "معرّف القضية غير صالح." }, { status: 400 });
    }

    const auth = await requireCaseAccess(id);
    if (!auth.ok) return auth.res;

    const c = await prisma.case.findUnique({ where: { id } });
    if (!c) {
      return NextResponse.json({ error: "القضية غير موجودة." }, { status: 404 });
    }

    const contextText = [
      `عنوان القضية: ${c.title ?? ""}`,
       `الأطراف: ${JSON.stringify(c.parties ?? {}, null, 2)}`,

      `الوصف: ${c.description ?? ""}`,
    ].join("\n");
 
      const answer = await generateAnswer(
  "حلّل هذه القضية قانونيًا وقدّم توصيات عملية مختصرة.",
  contextText
);


    await prisma.caseEvent.create({
      data: {
        caseId: id,
        title: "تحليل AI",
        note: answer,
        date: new Date(),
      },
    });

    return NextResponse.json({ ok: true, answer });
  } catch (e: any) {
    console.error("case analyze error:", e);
    return NextResponse.json({ error: e?.message || "فشل تحليل القضية." }, { status: 500 });
  }
}
