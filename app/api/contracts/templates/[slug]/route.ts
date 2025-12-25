 // app/api/contracts/templates/[slug]/route.ts
import { NextResponse } from "next/server";
import { getTemplateBySlug } from "@/lib/contracts/catalog";
import { extractPlaceholders } from "@/lib/contracts/engine/placeholders";

export const runtime = "nodejs";

type Ctx = {
  params: Promise<{ slug: string }>;
};

export async function GET(_req: Request, ctx: Ctx) {
  const { slug } = await ctx.params; // ✅ مهم جدًا في Next 16

  const tpl = getTemplateBySlug(slug);
  if (!tpl) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    template: {
      ...tpl,
      body: tpl.html,                    // للواجهة (كما تستخدمها الآن)
      fields: extractPlaceholders(tpl.html),
    },
  });
}
