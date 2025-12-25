// lib/contracts/engine/placeholders.ts
export type DataMap = Record<string, any>;

function escapeHtml(input: any): string {
  const s = String(input ?? "");
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function extractPlaceholders(html: string): string[] {
  const set = new Set<string>();
  const re = /{{\s*([a-zA-Z0-9_.-]+)\s*}}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) set.add(m[1]);
  return [...set];
}

export function fillPlaceholders(html: string, data: DataMap): string {
  return html.replace(/{{\s*([a-zA-Z0-9_.-]+)\s*}}/g, (_all, key: string) => {
    const val = data?.[key];
    return escapeHtml(val ?? "");
  });
}

