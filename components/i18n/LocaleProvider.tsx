"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";

/**
 * يحمل اللغة التي حسبها الخادم (getLocale) وقت التصيير.
 *
 * الغرض: منع "وميض اللغة" (FOUC) في مكوّنات العميل التي تستدعي useLocale.
 * الكوكي لا يمكن قراءته أثناء التصيير على الخادم ولا في أول تصيير على العميل
 * (وإلا حدث عدم تطابق hydration)، لذا نمرّر لغة الخادم عبر هذا الـ context
 * كي تكون البذرة الأولية للهوك مطابقة لِما صيّره الخادم — بلا وميض عربي على
 * الجلسات الإنجليزية التي لا تحمل ?lang في الرابط.
 */
const InitialLocaleContext = createContext<Locale | undefined>(undefined);

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale?: Locale;
  children: ReactNode;
}) {
  return (
    <InitialLocaleContext.Provider value={initialLocale}>
      {children}
    </InitialLocaleContext.Provider>
  );
}

/** يعيد اللغة الأولية القادمة من الخادم (أو undefined خارج المزوّد). */
export function useInitialLocale(): Locale | undefined {
  return useContext(InitialLocaleContext);
}
