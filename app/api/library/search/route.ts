 import { NextResponse } from "next/server";
import { searchLibrary } from "@/lib/library/search";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = (searchParams.get("q") || "").trim();
  const section = (searchParams.get("section") || "ALL") as any;
  const mode = (searchParams.get("mode") || "hybrid") as any;
  const take = Number(searchParams.get("take") || "20");

  if (!q) return NextResponse.json({ ok: true, hits: [] });

  const data = await searchLibrary({ q, section, mode, take: Number.isFinite(take) ? take : 20 });
  return NextResponse.json({ ok: true, ...data });
}
