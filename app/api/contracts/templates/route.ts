 // app/api/contracts/templates/route.ts
import { NextResponse } from "next/server";
import { listTemplates } from "@/lib/contracts/catalog";

export const runtime = "nodejs";
export async function GET() {
  return NextResponse.json({ ok: true, templates: listTemplates() });
}
