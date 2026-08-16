// lib/i18n/dictionaries/common.ts
// النصوص المشتركة: التنقّل، التذييل، الإجراءات، تسميات إمكانية الوصول.

import type { Locale } from "../config";

const ar = {
  brand: "منصة المستشار القانوني الذكي",
  portal: "البوابة الرقمية للخدمات القانونية",
  portalAlt: "Digital Legal Services Portal",
  topNote: "واجهة رسمية • ثنائية اللغة • محسّنة للموبايل",

  nav: {
    library: "المكتبة",
    contracts: "العقود",
    translate: "الترجمة",
    consultations: "الاستشارات",
    howToUse: "كيف تستخدم المنصة",
    pricing: "الأسعار",
  },

  footer: {
    rights: "جميع الحقوق محفوظة",
    about: "من نحن",
    howToUse: "كيف تستخدم المنصة",
    pricing: "الأسعار",
    privacy: "الخصوصية",
    terms: "الشروط",
    disclaimer: "إخلاء المسؤولية",
  },

  actions: {
    signIn: "تسجيل الدخول",
    signInShort: "دخول",
    register: "إنشاء حساب",
    explore: "استكشف",
    openService: "الدخول للخدمة",
    loading: "جارٍ التحميل...",
  },

  a11y: {
    language: "اللغة",
    switchToArabic: "التبديل إلى العربية",
    switchToEnglish: "Switch to English",
    mainNav: "التنقّل الرئيسي",
    footerNav: "روابط التذييل",
    skipToContent: "تخطّي إلى المحتوى",
    languageSwitcher: "اختيار اللغة",
  },
};

export type CommonDict = typeof ar;

const en: CommonDict = {
  brand: "Smart Legal Advisor Platform",
  portal: "Digital Legal Services Portal",
  portalAlt: "البوابة الرقمية للخدمات القانونية",
  topNote: "Official • Bilingual • Mobile-Optimized",

  nav: {
    library: "Library",
    contracts: "Contracts",
    translate: "Translation",
    consultations: "Consultations",
    howToUse: "How to Use",
    pricing: "Pricing",
  },

  footer: {
    rights: "All rights reserved",
    about: "About",
    howToUse: "How to Use",
    pricing: "Pricing",
    privacy: "Privacy",
    terms: "Terms",
    disclaimer: "Disclaimer",
  },

  actions: {
    signIn: "Sign In",
    signInShort: "Sign In",
    register: "Create Account",
    explore: "Explore",
    openService: "Open service",
    loading: "Loading...",
  },

  a11y: {
    language: "Language",
    switchToArabic: "التبديل إلى العربية",
    switchToEnglish: "Switch to English",
    mainNav: "Main navigation",
    footerNav: "Footer links",
    skipToContent: "Skip to content",
    languageSwitcher: "Language selection",
  },
};

export const common: Record<Locale, CommonDict> = { ar, en };
