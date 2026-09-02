// lib/contracts/jurisdictions.ts
// سجلّ الاختصاصات القانونية (الدول). البنية مهيّأة لإضافة دول عربية أخرى:
// أضف الرمز في JurisdictionCode (engine/types.ts) ثم عرّف الاختصاص هنا مع enabled:true.

import type { JurisdictionCode } from "./engine/types";
import type { CurrencyCode } from "./currencies";

export type Jurisdiction = {
  code: JurisdictionCode;
  nameAr: string;
  nameEn: string;
  flag: string; // علم الدولة (إيموجي) للعرض في التبويبات
  /** نص القانون الحاكم الافتراضي — يُستخدم كـ placeholder في حقل governingLaw. */
  governingLawAr: string;
  governingLawEn: string;
  /** مدينة المحكمة المختصة الافتراضية. */
  defaultCourtCityAr: string;
  defaultCourtCityEn: string;
  /** العملات المتاحة لهذا الاختصاص (أول عنصر هو الافتراضي المحلي). */
  currencies: CurrencyCode[];
  /** هل الاختصاص مفعّل ويظهر في الواجهة؟ */
  enabled: boolean;
};

export const DEFAULT_JURISDICTION: JurisdictionCode = "IQ";

/**
 * قائمة الاختصاصات. المفعّل منها (enabled:true) يظهر كتبويب في صفحة العقود.
 * الدول غير المفعّلة معرّفة مسبقاً لتسهيل تفعيلها لاحقاً عند إضافة عقودها.
 */
export const JURISDICTIONS: Jurisdiction[] = [
  {
    code: "IQ",
    nameAr: "العراق",
    nameEn: "Iraq",
    flag: "🇮🇶",
    governingLawAr: "القانون المدني العراقي رقم 40 لسنة 1951",
    governingLawEn: "Iraqi Civil Code No. 40 of 1951",
    defaultCourtCityAr: "بغداد",
    defaultCourtCityEn: "Baghdad",
    currencies: ["IQD", "USD", "EUR"],
    enabled: true,
  },
  {
    code: "EG",
    nameAr: "مصر",
    nameEn: "Egypt",
    flag: "🇪🇬",
    governingLawAr: "القانون المدني المصري رقم 131 لسنة 1948",
    governingLawEn: "Egyptian Civil Code No. 131 of 1948",
    defaultCourtCityAr: "القاهرة",
    defaultCourtCityEn: "Cairo",
    currencies: ["EGP", "USD", "EUR"],
    enabled: true,
  },

  // ── جاهزة للتفعيل عند إضافة عقودها (enabled:false حالياً) ──
  {
    code: "SA",
    nameAr: "السعودية",
    nameEn: "Saudi Arabia",
    flag: "🇸🇦",
    governingLawAr: "الأنظمة المعمول بها في المملكة العربية السعودية",
    governingLawEn: "Laws in force in the Kingdom of Saudi Arabia",
    defaultCourtCityAr: "الرياض",
    defaultCourtCityEn: "Riyadh",
    currencies: ["SAR", "USD"],
    enabled: false,
  },
  {
    code: "AE",
    nameAr: "الإمارات",
    nameEn: "United Arab Emirates",
    flag: "🇦🇪",
    governingLawAr: "قانون المعاملات المدنية الإماراتي رقم 5 لسنة 1985",
    governingLawEn: "UAE Civil Transactions Law No. 5 of 1985",
    defaultCourtCityAr: "دبي",
    defaultCourtCityEn: "Dubai",
    currencies: ["AED", "USD"],
    enabled: false,
  },
  {
    code: "JO",
    nameAr: "الأردن",
    nameEn: "Jordan",
    flag: "🇯🇴",
    governingLawAr: "القانون المدني الأردني رقم 43 لسنة 1976",
    governingLawEn: "Jordanian Civil Code No. 43 of 1976",
    defaultCourtCityAr: "عمّان",
    defaultCourtCityEn: "Amman",
    currencies: ["JOD", "USD"],
    enabled: false,
  },
];

export function getJurisdiction(code: JurisdictionCode | undefined): Jurisdiction {
  return (
    JURISDICTIONS.find((j) => j.code === (code ?? DEFAULT_JURISDICTION)) ??
    JURISDICTIONS[0]
  );
}

/** الاختصاصات المفعّلة فقط (لتوليد التبويبات). */
export function enabledJurisdictions(): Jurisdiction[] {
  return JURISDICTIONS.filter((j) => j.enabled);
}

/** اختصاص القالب مع الافتراض للقوالب القديمة التي لا تحمل الحقل. */
export function templateJurisdiction(t: {
  jurisdiction?: JurisdictionCode;
}): JurisdictionCode {
  return t.jurisdiction ?? DEFAULT_JURISDICTION;
}
