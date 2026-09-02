 // lib/contracts/engine/types.ts
 export type Language = "ar" | "en";
export type ContractGroup = "PRO" | "INCOTERMS";

/**
 * رمز الاختصاص (الدولة) الذي صيغ العقد وفق قوانينه.
 * البنية مهيّأة لإضافة دول عربية أخرى — يكفي إضافة الرمز هنا
 * وتعريف الاختصاص في lib/contracts/jurisdictions.ts.
 */
export type JurisdictionCode =
  | "IQ" // العراق
  | "EG" // مصر
  | "SA" // السعودية
  | "AE" // الإمارات
  | "JO" // الأردن
  | "KW" // الكويت
  | "QA" // قطر
  | "BH" // البحرين
  | "OM" // عُمان
  | "LB" // لبنان
  | "SY" // سوريا
  | "YE" // اليمن
  | "LY" // ليبيا
  | "TN" // تونس
  | "DZ" // الجزائر
  | "MA" // المغرب
  | "SD" // السودان
  | "PS"; // فلسطين

/** نوع الحقل */
export type FieldType = "text" | "textarea" | "date" | "number" | "select";

/** تعريف حقل إدخال */
export type ContractField = {
  key: string;
  label: string;
  required?: boolean;
  type?: FieldType;        // ← جديد (افتراضي text)
  group?: string;          // ← جديد (قسم الحقل: الأطراف، المالية...)
  options?: string[];      // ← جديد (لـ select)
  placeholder?: string;    // ← جديد
  hint?: string;           // ← جديد (ملاحظة توضيحية)
};

/** القالب */
export type ContractTemplate = {
  id: number;
  slug: string;
  title: string;
  lang: Language;
  group: ContractGroup;
  /** الاختصاص القانوني. اختياري للتوافق مع القوالب القديمة (تُعامل كـ "IQ"). */
  jurisdiction?: JurisdictionCode;
  html: string;
  fields?: ContractField[];
};