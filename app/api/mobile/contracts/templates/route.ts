 import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/jwt";
import { CONTRACT_CATALOG } from "@/lib/contracts/catalog";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    await verifyUserToken(authHeader.split(" ")[1]);

    const templates = CONTRACT_CATALOG.map((t) => ({
      id: t.id,
      slug: t.slug,
      title: t.title,
      lang: t.lang,
      group: t.group,
      fields: Array.isArray(t.fields) ? t.fields : [],
    }));

    return NextResponse.json({ templates });
  } catch {
    return NextResponse.json({ error: "token غير صالح" }, { status: 401 });
  }
}