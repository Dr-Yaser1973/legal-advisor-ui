// lib/i18n/config.ts
// المصدر الوحيد للحقيقة بخصوص اللغة في المنصة.
// أي كود يحتاج معرفة اللغة أو الاتجاه يجب أن يمرّ من هنا.

export const LOCALES = ["ar", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ar";

/** اسم الكوكي الذي يحفظ اختيار المستخدم (نفس الاسم المستخدم سابقاً في localStorage). */
export const LOCALE_COOKIE = "locale";

/** الترويسة التي يضبطها middleware ليقرأها الخادم. */
export const LOCALE_HEADER = "x-locale";

/** اسم الـ query param المستخدم فعلياً في صفحات المكتبة. */
export const LOCALE_PARAM = "lang";

/** عمر الكوكي: سنة. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type Dir = "rtl" | "ltr";

/** تحويل أي قيمة مجهولة إلى لغة صالحة، مع الرجوع للافتراضي. */
export function resolveLocale(value?: string | null): Locale {
  if (!value) return DEFAULT_LOCALE;
  const v = value.trim().toLowerCase().slice(0, 2);
  return (LOCALES as readonly string[]).includes(v)
    ? (v as Locale)
    : DEFAULT_LOCALE;
}

export function dirFor(locale: Locale): Dir {
  return locale === "ar" ? "rtl" : "ltr";
}

export function isRtl(locale: Locale): boolean {
  return dirFor(locale) === "rtl";
}

export function oppositeLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}

/**
 * بناء رابط يحمل اللغة.
 * اللغة الافتراضية (العربية) تُبنى بلا param حتى لا ننشئ نسختين من نفس الرابط
 * ( "/" و "/?lang=ar" ) وهو ما يسبّب duplicate content في الفهرسة.
 */
export function localeHref(
  pathname: string,
  locale: Locale,
  extraParams?: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(extraParams ?? {})) {
    if (value != null && value !== "") params.set(key, value);
  }

  if (locale !== DEFAULT_LOCALE) params.set(LOCALE_PARAM, locale);

  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
