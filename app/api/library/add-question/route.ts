
// app/api/library/add-question/route.ts
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { legalQuestionSchema } from "@/lib/validations/legalQuestion";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = legalQuestionSchema.parse(json);
    const result = await prisma.legalQuestion.create({ data });
    return NextResponse.json(result);
  } catch (err: any) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error("add-question error:", err);
    return NextResponse.json({ error: "خطأ غير متوقع" }, { status: 500 });
  }
}
