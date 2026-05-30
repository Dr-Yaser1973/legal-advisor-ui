 // lib/contracts/engine/types.ts
 export type Language = "ar" | "en";
export type ContractGroup = "PRO" | "INCOTERMS";

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
  html: string;
  fields?: ContractField[];
};