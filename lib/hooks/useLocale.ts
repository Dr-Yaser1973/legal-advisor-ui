// lib/hooks/useLocale.ts
"use client";

import { useParams } from "next/navigation";

export function useLocale() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  
  return {
    locale,
    dir: locale === 'ar' ? 'rtl' : 'ltr',
    isRTL: locale === 'ar'
  };
}
