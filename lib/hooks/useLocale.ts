// lib/hooks/useLocale.ts
'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_PARAM,
  dirFor,
  resolveLocale,
  type Dir,
  type Locale,
} from '@/lib/i18n/config';
import { useInitialLocale } from '@/components/i18n/LocaleProvider';

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name + '=([^;]*)'),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
}

/**
 * واجهة الهوك: { locale, dir, setLocale }
 * مصدر الحقيقة نفسه المستخدم في الخادم و middleware:
 *   ?lang=  →  cookie  →  الافتراضي
 *
 * `initialLocale` (اختياري): اللغة المحسوبة على الخادم عبر getLocale. يمكن
 * تمريرها صراحةً كـ prop، أو تُلتقط تلقائياً من <LocaleProvider> المثبَّت في
 * الجذر (app/layout.tsx). الكوكي لا يمكن قراءته أثناء التصيير على الخادم ولا في
 * أول تصيير على العميل (وإلا حدث عدم تطابق hydration)، لذا نستعمل لغة الخادم
 * كقيمة أولية تمنع وميض اللغة الافتراضية (العربية) على الجلسات الإنجليزية بلا
 * ?lang. الأولوية: الـ prop الصريح ثم قيمة المزوّد ثم الافتراضي.
 */
export function useLocale(initialLocale?: Locale) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const providedLocale = useInitialLocale();

  const fromUrl = searchParams.get(LOCALE_PARAM);
  const seedLocale = initialLocale ?? providedLocale ?? DEFAULT_LOCALE;

  // التصيير الأول يطابق الخادم: ?lang إن وُجد، وإلا لغة الخادم (prop/مزوّد)،
  // وإلا الافتراضي. لا نقرأ الكوكي هنا تجنّباً لعدم تطابق hydration.
  const [locale, setLocaleState] = useState<Locale>(() =>
    fromUrl ? resolveLocale(fromUrl) : seedLocale,
  );

  useEffect(() => {
    const next = resolveLocale(fromUrl ?? readCookie(LOCALE_COOKIE));
    setLocaleState(next);
    writeCookie(LOCALE_COOKIE, next);
  }, [fromUrl]);

  const setLocale = useCallback(
    (newLocale: Locale) => {
      const next = resolveLocale(newLocale);
      setLocaleState(next);
      writeCookie(LOCALE_COOKIE, next);

      // نعكس الاختيار في الرابط ليكون قابلاً للمشاركة والفهرسة،
      // ويعيد الخادم تصيير <html lang dir> بالقيمة الصحيحة.
      const params = new URLSearchParams(searchParams.toString());
      if (next === DEFAULT_LOCALE) params.delete(LOCALE_PARAM);
      else params.set(LOCALE_PARAM, next);

      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const dir: Dir = dirFor(locale);

  return { locale, dir, setLocale };
}
