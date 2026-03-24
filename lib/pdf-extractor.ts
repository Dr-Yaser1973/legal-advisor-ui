 // lib/pdf-extractor.ts

// ✅ الطريقة الصحيحة: استخدم require بدلاً من import
const pdfParse = require('pdf-parse');

// دالة للتحقق من جودة النص المستخرج
export function isTextClean(text: string): boolean {
  if (!text || text.length < 50) return false;
  
  // حساب نسبة الأحرف العربية
  const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const totalChars = text.replace(/\s/g, "").length;
  const arabicRatio = totalChars > 0 ? arabicChars / totalChars : 0;
  
  // حساب نسبة الأحرف الغريبة
  const strangeChars = (text.match(/[^a-zA-Z0-9\u0600-\u06FF\s.,:;()\-]/g) || []).length;
  const strangeRatio = totalChars > 0 ? strangeChars / totalChars : 0;
  
  // التحقق من وجود ترميز مشوش
  const hasGarbage = /[#%&*@!?$^~`|\\]/g.test(text);
  const hasRepeatedStrange = /([^a-zA-Z0-9\u0600-\u06FF\s])\1{3,}/g.test(text);
  
  return (
    arabicRatio > 0.3 &&
    strangeRatio < 0.1 &&
    !hasGarbage &&
    !hasRepeatedStrange
  );
}

// دالة لتنظيف النص الأساسية
function basicClean(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n/g, "\n\n")
    .trim();
}

export async function extractTextFromPDF(
  buffer: Buffer
): Promise<{
  text: string;
  method: string;
  pages: number;
  isClean: boolean;
}> {
  try {
    const data = await pdfParse(buffer);
    const rawText = data.text;
    const cleanedText = basicClean(rawText);
    const isCleanText = isTextClean(cleanedText);
    
    return {
      text: isCleanText ? cleanedText : "",
      method: "pdf-parse",
      pages: data.numpages,
      isClean: isCleanText,
    };
  } catch (error) {
    console.error("PDF extraction error:", error);
    return {
      text: "",
      method: "error",
      pages: 0,
      isClean: false,
    };
  }
}

export function extractArticles(text: string): Array<{ number?: string; text: string }> {
  const articles: Array<{ number?: string; text: string }> = [];
  if (!text) return articles;
  
  const cleanedText = text.replace(/\n+/g, " ").replace(/\s+/g, " ");
  const pattern = /(?:المادة|مادة)\s*(\d+)\s*[:\-–—]\s*([^المادة]+?)(?=(?:المادة|مادة)\s*\d+|$)/gi;
  
  let match;
  while ((match = pattern.exec(cleanedText)) !== null) {
    const number = match[1]?.trim();
    let content = match[2]?.trim();
    if (content && content.length > 10) {
      content = content.replace(/\s+/g, " ").trim();
      articles.push({ number, text: content });
    }
  }
  
  if (articles.length === 0 && cleanedText.trim()) {
    articles.push({ number: undefined, text: cleanedText.trim() });
  }
  
  return articles;
}

export async function extractTextFromWord(buffer: Buffer): Promise<{
  text: string;
  isClean: boolean;
}> {
  try {
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    const cleanedText = basicClean(result.value);
    const isCleanText = isTextClean(cleanedText);
    
    return {
      text: isCleanText ? cleanedText : "",
      isClean: isCleanText,
    };
  } catch (error) {
    console.error("Word extraction error:", error);
    return {
      text: "",
      isClean: false,
    };
  }
}