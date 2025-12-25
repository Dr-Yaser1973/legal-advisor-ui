// lib/contracts/engine/validate.ts
import { extractPlaceholders } from "./placeholders";

export type Language = "ar" | "en";
export type TemplateGroup = "PRO" | "INCOTERMS";

export type TemplateMeta = {
  slug: string;
  title: string;
  lang: Language;
  group: TemplateGroup;
  body: string; // HTML template (with {{placeholders}})
};

const INCOTERMS_11 = new Set([
  "EXW","FCA","FAS","FOB","CFR","CIF","CPT","CIP","DAP","DPU","DDP",
]);

export function validateData(meta: TemplateMeta, data: Record<string, any>) {
  const required = extractPlaceholders(meta.body);
  const missing = required.filter((k) => {
    const v = data?.[k];
    return v === undefined || v === null || String(v).trim() === "";
  });

  if (missing.length) {
    const msg =
      meta.lang === "ar"
        ? `حقول ناقصة: ${missing.join("، ")}`
        : `Missing fields: ${missing.join(", ")}`;
    return { ok: false as const, error: msg, missing };
  }

  // قواعد خاصة بالـ Incoterms
  if (meta.group === "INCOTERMS") {
    const term = String(data.incoterm ?? "").toUpperCase().trim();
    if (!INCOTERMS_11.has(term)) {
      const msg =
        meta.lang === "ar"
          ? `مصطلح Incoterms غير صحيح: ${term}`
          : `Invalid Incoterms term: ${term}`;
      return { ok: false as const, error: msg, missing: ["incoterm"] };
    }
  }

  return { ok: true as const };
}

