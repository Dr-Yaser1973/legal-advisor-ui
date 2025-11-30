// lib/chunks.ts

/**
 * تقطيع نص طويل إلى مقاطع صغيرة مناسبة لـ embeddings
 * size = عدد الحروف التقريبي لكل مقطع
 */
export function splitIntoChunks(
  text: string,
  size: number = 900,
): string[] {
  if (!text) return [];

  const clean = text.replace(/\r\n/g, "\n").trim();
  if (!clean) return [];

  const parts: string[] = [];
  let current = "";

  const sentences = clean.split(/(\.|\n|\?|!|؛)/); // نحاول التقطيع على الجمل

  for (let i = 0; i < sentences.length; i++) {
    const piece = sentences[i];
    if (!piece) continue;

    if ((current + piece).length > size && current.length > 0) {
      parts.push(current.trim());
      current = piece;
    } else {
      current += piece;
    }
  }

  if (current.trim().length > 0) {
    parts.push(current.trim());
  }

  return parts;
}

