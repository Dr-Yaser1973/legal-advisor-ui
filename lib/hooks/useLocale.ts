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
 * واجهة الهوك لم تتغيّر: { locale, dir, setLocale }
 * ما تغيّر هو مصدر الحقيقة — صار نفس مصدر الخادم و middleware:
 *   ?lang=  →  cookie  →  الافتراضي
 *
 * سابقاً كان يقرأ من localStorage ولغة المتصفح فقط، فينتج عنه اختلاف
 * بين ما يصيّره الخادم وما يعرضه العميل.
 */
export function useLocale() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fromUrl = searchParams.get(LOCALE_PARAM);

  // التصيير الأول يطابق الخادم عند وجود الـ param، وإلا الافتراضي.
  const [locale, setLocaleState] = useState<Locale>(() =>
    fromUrl ? resolveLocale(fromUrl) : DEFAULT_LOCALE,
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
