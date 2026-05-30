 // app/api/contracts/templates/[slug]/route.ts
 import { NextResponse } from "next/server";
import { getTemplateBySlug } from "@/lib/contracts/catalog";
import { extractPlaceholders } from "@/lib/contracts/engine/placeholders";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { slug } = await ctx.params;

  const tpl = getTemplateBySlug(slug);
  if (!tpl) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  // إذا القالب له fields معرّفة → استخدمها (كائنات كاملة)
  // وإلا → استخرج من HTML وحوّل لكائنات بسيطة
  const fields =
    Array.isArray(tpl.fields) && tpl.fields.length > 0
      ? tpl.fields
      : extractPlaceholders(tpl.html).map((key) => ({
          key,
          label: key,
          required: true,
          type: "text" as const,
          group: "الحقول",
        }));

  return NextResponse.json({
    ok: true,
    template: {
      ...tpl,
      body: tpl.html,
      fields,
    },
  });
}
