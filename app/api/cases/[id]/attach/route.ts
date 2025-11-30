
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const caseId = Number(params.id);
    const { documentId } = await req.json();
    if (!documentId) return NextResponse.json({ error: "documentId مطلوب." }, { status: 400 });

    await prisma.caseDocument.create({ data: { caseId, documentId } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
