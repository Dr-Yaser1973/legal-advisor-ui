
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ ok: false, error: "id مفقود" }, { status: 400 });

    await prisma.generatedContract.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("contracts/delete error:", e);
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}
