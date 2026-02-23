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
     // قواعد خاصة بالـ Incoterms
  if (meta.group === "INCOTERMS") {
    // نحن نعتمد على incotermsEdition لأنه حقل موجود في الـ UI
    // والمتوقع أن يُكتب فيه مثل: "FOB 2020"
    const raw = String(data.incotermsEdition ?? "")
      .toUpperCase()
      .trim();

    // استخرج المصطلح من النص (أول كلمة غالباً: FOB)
    // يدعم: "FOB 2020" أو "FOB - 2020" أو "FOB Incoterms 2020"
    const term = raw.split(/[^A-Z]+/).find(Boolean) || "";

    if (!INCOTERMS_11.has(term)) {
      const msg =
        meta.lang === "ar"
          ? `مصطلح Incoterms غير صحيح. اكتب مثل: FOB 2020`
          : `Invalid Incoterms term. Use e.g.: FOB 2020`;
      // نربط الخطأ بحقل موجود فعلاً حتى لا "ينهدم" UI
      return { ok: false as const, error: msg, missing: ["incotermsEdition"] };
    }
  }

  return { ok: true as const };
}

