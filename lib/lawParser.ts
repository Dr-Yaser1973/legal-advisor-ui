 // lib/lawParser.ts

export type ParsedArticle = {
  ordinal?: number;
  number?: string | null;
  text: string;
};

/**
 * تقطيع نص قانون عربي إلى مواد
 * يقبل صيغ مثل:
 *  - المادة 1
 *  - المادة الأولى
 *  - مادة (1)
 */
export function parseLawText(input: string): ParsedArticle[] {
  if (!input) return [];

  const normalized = input.replace(/\r\n/g, "\n");

  const articleRegex =
    /(?:^|\n)\s*(?:المادة|مادة)\s*(?:رقم)?\s*([0-9۰-۹]+|[^\n:：]+)\s*[:：\-]?\s*/g;

  const parts: ParsedArticle[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let idx = 0;

  const matches: { start: number; numberRaw: string }[] = [];

  while ((match = articleRegex.exec(normalized))) {
    const start = match.index;
    const numberRaw = (match[1] || "").toString().trim();
    matches.push({ start, numberRaw });
  }

  if (matches.length === 0) {
    // نص بدون مواد ظاهرة -> مادة واحدة
    return [
      {
        ordinal: 1,
        number: null,
        text: normalized.trim(),
      },
    ];
  }

  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const next = matches[i + 1];

    const contentStart = cur.start;
    const sliceStart =
      normalized.indexOf("\n", contentStart) + 1 || contentStart;

    const sliceEnd = next ? next.start : normalized.length;

    const raw = normalized.slice(sliceStart, sliceEnd).trim();
    if (!raw) continue;

    idx++;
    parts.push({
      ordinal: idx,
      number: cur.numberRaw,
      text: raw,
    });
  }

  return parts;
}

export function parseLawArticles(input: string): ParsedArticle[] {
  return parseLawText(input);
}
