'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import {
  LOCALE_PARAM,
  oppositeLocale,
  resolveLocale,
  type Locale,
} from '@/lib/i18n/config';

/**
 * مبدّل اللغة المشترك.
 * - رابط <Link> وليس زر onClick: يعمل بلا JS، وقابل للفهرسة والمشاركة وفتحه في تبويب جديد.
 * - ألوان الوضع الداكن (كان سابقاً bg-gray-100 على موقع داكن).
 *
 * `currentLocale`: تمرّره صفحات الخادم بعد حسابه من (?lang ← الكوكي ← الافتراضي).
 * بدونه كان الزر يعتمد على ?lang فقط، فيظنّ اللغة عربية متى غاب الـ param حتى
 * لو كانت الكوكي إنجليزية — فيظهر زر خاطئ ويعكس اللغة عند التنقّل.
 */
export default function LanguageSwitcher({
  className = '',
  currentLocale,
}: {
  className?: string;
  currentLocale?: Locale;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLang = currentLocale ?? resolveLocale(searchParams.get(LOCALE_PARAM));
  const newLang = oppositeLocale(currentLang);

  const params = new URLSearchParams(searchParams.toString());
  // نضبط ?lang صراحةً لكلا اللغتين (بما فيها العربية الافتراضية) حتى يُعيد
  // الـ middleware كتابة الكوكي عند التبديل في الاتجاهين. لو حذفناه للعربية
  // لبقيت الكوكي إنجليزية فلا يعود المستخدم للعربية أبداً.
  params.set(LOCALE_PARAM, newLang);

  const qs = params.toString();
  const href = qs ? `${pathname}?${qs}` : pathname;

  const label = currentLang === 'ar' ? 'English' : 'العربية';
  const title =
    currentLang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية';

  return (
    <Link
      href={href}
      prefetch={false}
      hrefLang={newLang}
      lang={newLang}
      title={title}
      aria-label={title}
      className={`inline-flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900/60 px-3 py-2 text-zinc-200 transition-colors hover:bg-zinc-800 ${className}`}
    >
      <GlobeAltIcon className="h-5 w-5 text-amber-300" aria-hidden="true" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
