// lib/library/pdfEngine.ts
import pdfParse from "pdf-parse";

/**
 * استخراج النص من PDF (قدر الإمكان)
 */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return (data.text || "").replace(/\u0000/g, "").trim();
  } catch (err) {
    console.error("PDF PARSE ERROR:", err);
    return "";
  }
}

/**
 * تقطيع للنص لعمل RAG chunks (بدون أي تعقيد)
 */
export function splitIntoChunks(text: string, maxLen = 900): string[] {
  const t = (text || "").trim();
  if (!t) return [];

  // تقسيم أولي حسب فواصل منطقية
  const parts = t.split(/\n{2,}|(?<=[.؟!])\s+/g);

  const out: string[] = [];
  let buf = "";

  for (const p of parts) {
    const s = (p || "").trim();
    if (!s) continue;

    if ((buf + "\n\n" + s).length <= maxLen) {
      buf = buf ? buf + "\n\n" + s : s;
    } else {
      if (buf) out.push(buf);
      if (s.length <= maxLen) {
        buf = s;
      } else {
        // لو فقرة كبيرة جدًا نقطعها
        for (let i = 0; i < s.length; i += maxLen) {
          out.push(s.slice(i, i + maxLen));
        }
        buf = "";
      }
    }
  }

  if (buf) out.push(buf);
  return out;
}

