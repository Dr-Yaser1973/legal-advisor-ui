
// app/api/cases/[id]/events/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const caseId = Number(params.id);
    const { title, note } = await req.json();
    await prisma.caseEvent.create({
      data: { caseId, title, note, date: new Date() },
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
