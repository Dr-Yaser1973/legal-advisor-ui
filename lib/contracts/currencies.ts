// lib/contracts/currencies.ts
// سجلّ العملات — يشمل عملات الدول العربية + الدولار واليورو.
// يُستخدم لبناء خيارات حقل "العملة" في القوالب حسب الاختصاص.

export type CurrencyCode =
  | "IQD" // دينار عراقي
  | "EGP" // جنيه مصري
  | "SAR" // ريال سعودي
  | "AED" // درهم إماراتي
  | "KWD" // دينار كويتي
  | "QAR" // ريال قطري
  | "BHD" // دينار بحريني
  | "OMR" // ريال عماني
  | "JOD" // دينار أردني
  | "LBP" // ليرة لبنانية
  | "SYP" // ليرة سورية
  | "YER" // ريال يمني
  | "LYD" // دينار ليبي
  | "TND" // دينار تونسي
  | "DZD" // دينار جزائري
  | "MAD" // درهم مغربي
  | "SDG" // جنيه سوداني
  | "USD" // دولار أمريكي
  | "EUR"; // يورو

export type Currency = {
  code: CurrencyCode;
  nameAr: string;
  nameEn: string;
  symbol: string;
};

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  IQD: { code: "IQD", nameAr: "دينار عراقي", nameEn: "Iraqi Dinar", symbol: "د.ع" },
  EGP: { code: "EGP", nameAr: "جنيه مصري", nameEn: "Egyptian Pound", symbol: "ج.م" },
  SAR: { code: "SAR", nameAr: "ريال سعودي", nameEn: "Saudi Riyal", symbol: "ر.س" },
  AED: { code: "AED", nameAr: "درهم إماراتي", nameEn: "UAE Dirham", symbol: "د.إ" },
  KWD: { code: "KWD", nameAr: "دينار كويتي", nameEn: "Kuwaiti Dinar", symbol: "د.ك" },
  QAR: { code: "QAR", nameAr: "ريال قطري", nameEn: "Qatari Riyal", symbol: "ر.ق" },
  BHD: { code: "BHD", nameAr: "دينار بحريني", nameEn: "Bahraini Dinar", symbol: "د.ب" },
  OMR: { code: "OMR", nameAr: "ريال عماني", nameEn: "Omani Rial", symbol: "ر.ع" },
  JOD: { code: "JOD", nameAr: "دينار أردني", nameEn: "Jordanian Dinar", symbol: "د.أ" },
  LBP: { code: "LBP", nameAr: "ليرة لبنانية", nameEn: "Lebanese Pound", symbol: "ل.ل" },
  SYP: { code: "SYP", nameAr: "ليرة سورية", nameEn: "Syrian Pound", symbol: "ل.س" },
  YER: { code: "YER", nameAr: "ريال يمني", nameEn: "Yemeni Rial", symbol: "ر.ي" },
  LYD: { code: "LYD", nameAr: "دينار ليبي", nameEn: "Libyan Dinar", symbol: "د.ل" },
  TND: { code: "TND", nameAr: "دينار تونسي", nameEn: "Tunisian Dinar", symbol: "د.ت" },
  DZD: { code: "DZD", nameAr: "دينار جزائري", nameEn: "Algerian Dinar", symbol: "د.ج" },
  MAD: { code: "MAD", nameAr: "درهم مغربي", nameEn: "Moroccan Dirham", symbol: "د.م" },
  SDG: { code: "SDG", nameAr: "جنيه سوداني", nameEn: "Sudanese Pound", symbol: "ج.س" },
  USD: { code: "USD", nameAr: "دولار أمريكي", nameEn: "US Dollar", symbol: "$" },
  EUR: { code: "EUR", nameAr: "يورو", nameEn: "Euro", symbol: "€" },
};

export function getCurrency(code: CurrencyCode): Currency {
  return CURRENCIES[code];
}

/** خيارات select بالعربية (القيمة = الاسم العربي، لتظهر مباشرة في نص العقد). */
export function currencyOptionsAr(codes: CurrencyCode[]): string[] {
  return codes.map((c) => CURRENCIES[c].nameAr);
}

/** خيارات select بالإنجليزية (القيمة = "CODE — Name"). */
export function currencyOptionsEn(codes: CurrencyCode[]): string[] {
  return codes.map((c) => `${c} — ${CURRENCIES[c].nameEn}`);
}
