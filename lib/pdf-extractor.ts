 import { createWorker } from 'tesseract.js';
import * as fs from 'fs';
import * as path from 'path';

// ✅ استيراد pdf-parse بالطريقة الصحيحة
const pdfParse = require('pdf-parse');

interface ExtractedText {
  text: string;
  method: 'pdf-parse' | 'tesseract' | 'combined';
  confidence?: number;
  pages: number;
}

// دالة للكشف إذا كان PDF ممسوح ضوئياً
export async function isScannedPDF(buffer: Buffer): Promise<boolean> {
  try {
    const data = await pdfParse(buffer);
    // إذا كان النص المستخرج أقل من 10% من حجم الملف، غالباً ممسوح ضوئياً
    const textRatio = data.text.length / buffer.length;
    return textRatio < 0.05;
  } catch {
    return true;
  }
}

// استخراج النص باستخدام pdf-parse (للملفات النصية)
export async function extractWithPdfParse(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer, {
      // تحسينات لترتيب النص
      pagerender: (pageData: any) => {
        return pageData.getTextContent({
          normalizeWhitespace: true,
          disableCombineTextItems: false
        }).then((textContent: any) => {
          let lastY: number | null = null;
          let text = '';
          
          // ترتيب النص حسب الموضع على الصفحة
          const items = textContent.items.sort((a: any, b: any) => {
            if (Math.abs(a.transform[5] - b.transform[5]) > 5) {
              return b.transform[5] - a.transform[5];
            }
            return a.transform[4] - b.transform[4];
          });
          
          for (const item of items) {
            if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
              text += '\n';
            }
            text += item.str;
            lastY = item.transform[5];
          }
          return text;
        });
      }
    });
    return data.text;
  } catch (error) {
    console.error("pdf-parse error:", error);
    return "";
  }
}

// استخراج النص باستخدام Tesseract OCR (للملفات الممسوحة ضوئياً)
export async function extractWithOCR(buffer: Buffer, lang: string = 'ara'): Promise<{ text: string; confidence: number }> {
  const worker = await createWorker(lang);
  
  try {
    // حفظ الملف مؤقتاً
    const tempPath = path.join('/tmp', `pdf-${Date.now()}.pdf`);
    fs.writeFileSync(tempPath, buffer);
    
    const { data } = await worker.recognize(tempPath);
    
    // تنظيف الملف المؤقت
    fs.unlinkSync(tempPath);
    
    await worker.terminate();
    
    return {
      text: data.text,
      confidence: data.confidence || 0
    };
  } catch (error) {
    await worker.terminate();
    console.error("OCR error:", error);
    return { text: "", confidence: 0 };
  }
}

// تنظيف النص المستخرج
export function cleanExtractedText(text: string): string {
  return text
    // إزالة الأحرف غير المرغوب فيها
    .replace(/[^\x00-\x7F\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, '')
    // إزالة المسافات المتعددة
    .replace(/\s+/g, ' ')
    // إصلاح الفواصل العربية
    .replace(/[,،]/g, '،')
    // إصلاح النقاط
    .replace(/[.]/g, '.')
    // إزالة الأسطر الفارغة المتعددة
    .replace(/\n\s*\n/g, '\n\n')
    // تنظيف البداية والنهاية
    .trim();
}

// دالة رئيسية لاستخراج النص من PDF
export async function extractTextFromPDF(
  buffer: Buffer,
  options?: {
    forceOCR?: boolean;
    ocrLanguage?: string;
  }
): Promise<ExtractedText> {
  const { forceOCR = false, ocrLanguage = 'ara' } = options || {};
  
  // 1. التحقق إذا كان الملف ممسوحاً ضوئياً
  const isScanned = await isScannedPDF(buffer);
  
  // 2. اختيار طريقة الاستخراج
  let text = "";
  let method: 'pdf-parse' | 'tesseract' | 'combined' = 'pdf-parse';
  let confidence = 0;
  
  if (forceOCR || isScanned) {
    // استخدام OCR للملفات الممسوحة
    const ocrResult = await extractWithOCR(buffer, ocrLanguage);
    text = ocrResult.text;
    confidence = ocrResult.confidence;
    method = 'tesseract';
    
    // إذا كان OCR ذو ثقة منخفضة، حاول أيضاً pdf-parse
    if (confidence < 70) {
      const pdfText = await extractWithPdfParse(buffer);
      if (pdfText.length > text.length) {
        text = pdfText;
        method = 'combined';
      }
    }
  } else {
    // استخدام pdf-parse للملفات النصية
    text = await extractWithPdfParse(buffer);
    method = 'pdf-parse';
    
    // إذا كان النص المستخرج قليلاً جداً، جرب OCR
    if (text.length < 100) {
      const ocrResult = await extractWithOCR(buffer, ocrLanguage);
      if (ocrResult.text.length > text.length) {
        text = ocrResult.text;
        confidence = ocrResult.confidence;
        method = 'tesseract';
      }
    }
  }
  
  // 3. تنظيف النص
  const cleanedText = cleanExtractedText(text);
  
  // 4. حساب عدد الصفحات (تقديري)
  const pages = Math.max(1, Math.floor(cleanedText.length / 2000));
  
  return {
    text: cleanedText,
    method,
    confidence,
    pages
  };
}

// دالة لاستخراج المواد من النص
export function extractArticles(text: string): Array<{ number?: string; text: string }> {
  const articles: Array<{ number?: string; text: string }> = [];
  
  // أنماط المواد بالعربية
  const arabicPattern = /(?:المادة|مادة)\s*(\d+)\s*[:\-–—]\s*([^]+?)(?=(?:المادة|مادة)\s*\d+|$)/gi;
  
  // أنماط المواد بالإنجليزية
  const englishPattern = /(?:Art(?:icle)?\.?)\s*(\d+)\s*[:\-–—]\s*([^]+?)(?=(?:Art(?:icle)?\.?)\s*\d+|$)/gi;
  
  // أنماط عامة
  const generalPattern = /(\d+)\s*[.\-–—]\s*([^]+?)(?=\d+\s*[.\-–—]|$)/g;
  
  let match;
  
  // البحث عن المواد بالعربية
  while ((match = arabicPattern.exec(text)) !== null) {
    const number = match[1]?.trim();
    const content = match[2]?.trim();
    if (content && content.length > 10) {
      articles.push({ number, text: content });
    }
  }
  
  // إذا لم نجد، جرب الإنجليزية
  if (articles.length === 0) {
    while ((match = englishPattern.exec(text)) !== null) {
      const number = match[1]?.trim();
      const content = match[2]?.trim();
      if (content && content.length > 10) {
        articles.push({ number, text: content });
      }
    }
  }
  
  // إذا لم نجد، جرب النمط العام
  if (articles.length === 0) {
    while ((match = generalPattern.exec(text)) !== null) {
      const number = match[1]?.trim();
      const content = match[2]?.trim();
      if (content && content.length > 20) {
        articles.push({ number, text: content });
      }
    }
  }
  
  // إذا لم يتم العثور على مواد، نأخذ النص كاملاً كمادة واحدة
  if (articles.length === 0 && text.trim()) {
    articles.push({ number: undefined, text: text.trim() });
  }
  
  return articles;
}