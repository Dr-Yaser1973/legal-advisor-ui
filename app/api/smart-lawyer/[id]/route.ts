
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const item = await prisma.lawyer.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "غير موجود." }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const data = await req.json();
    const updated = await prisma.lawyer.update({ where: { id }, data });
    return NextResponse.json({ ok: true, id: updated.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.lawyer.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
