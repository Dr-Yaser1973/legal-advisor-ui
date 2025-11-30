 // lib/arabic.ts

import * as reshaperModule from "arabic-persian-reshaper";

// نختار أفضل دالة متاحة للـ reshape بغض النظر عن طريقة التصدير
const reshapeFn: (text: string) => string =
  typeof (reshaperModule as any) === "function"
    ? (reshaperModule as any)                    // default export كدالة
    : typeof (reshaperModule as any).reshape === "function"
    ? (reshaperModule as any).reshape            // named export: { reshape }
    : (x: string) => x;                          // احتياطًا، نرجع النص كما هو

/**
 * تهيئة النص العربي للـ PDF:
 * 1) ربط الحروف (ligatures) باستخدام arabic-persian-reshaper
 * 2) إضافة رموز تحكم RTL لضمان اتجاه من اليمين لليسار
 */
export function shapeArabic(input: string): string {
  if (!input) return "";

  // تشكيل الحروف العربية
  const shaped = reshapeFn(input);

  // إضافة رموز التحكم لاتجاه RTL (Right-To-Left Embedding ... Pop Directional)
  return `\u202B${shaped}\u202C`;
}
