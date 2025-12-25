// lib/contracts/engine/wrap.ts
export type Language = "ar" | "en";

export function wrapHtmlDoc(fragmentOrBody: string, lang: Language): string {
  const raw = (fragmentOrBody ?? "").trim();
  if (!raw) return "";

  // لو القالب أصلاً HTML كامل
  if (/<html[\s>]/i.test(raw) && /<\/html>/i.test(raw)) return raw;

  const isAr = lang === "ar";
  const dir = isAr ? "rtl" : "ltr";
  const textAlign = isAr ? "right" : "left";
  const fontFamily = isAr
    ? `"Cairo","Noto Naskh Arabic","Amiri",Arial,sans-serif`
    : `"Times New Roman",Georgia,Arial,sans-serif`;

  return `<!doctype html>
<html lang="${isAr ? "ar" : "en"}" dir="${dir}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  html, body {
    direction: ${dir};
    text-align: ${textAlign};
    margin: 18mm 14mm;
    line-height: 1.85;
    font-family: ${fontFamily};
    font-size: 13.5px;
    color: #111;
  }
  .muted { color:#555; font-size:12px; }
  h1 { text-align:center; font-size:22px; margin:0 0 12px; }
  h2 { font-size:15px; margin:16px 0 8px; border-bottom:1px solid #ddd; padding-bottom:6px; }
  p { margin: 8px 0; }
  ol { ${isAr ? "padding-right: 22px;" : "padding-left: 22px;"} }
  li { margin: 6px 0; }
  table { width:100%; border-collapse:collapse; margin:10px 0; }
  td, th { border:1px solid #ddd; padding:8px; vertical-align:top; }
  .box { border:1px solid #ddd; padding:10px; border-radius:10px; margin:10px 0; }
  .sig { margin-top: 14px; width:100%; }
  .sig td { height: 60px; }
  @page { size:A4; margin: 18mm 14mm; }
</style>
</head>
<body>
${raw}
</body>
</html>`;
}

