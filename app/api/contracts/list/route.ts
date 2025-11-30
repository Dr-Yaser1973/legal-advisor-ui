
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const items = await prisma.generatedContract.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, type: true, createdAt: true, pdfUrl: true },
      take: 200,
    });
    return NextResponse.json({ items });
  } catch (e: any) {
    console.error("contracts/list error:", e);
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}
