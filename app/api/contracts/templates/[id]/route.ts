import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: any) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const { title, slug, language, bodyHtml } = body;

    const updated = await prisma.contractTemplate.update({
      where: { id },
      data: { title, slug, language, bodyHtml },
    });

    return NextResponse.json({ updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "فشل التعديل" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: any) {
  try {
    const id = Number(params.id);

    await prisma.contractTemplate.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}

