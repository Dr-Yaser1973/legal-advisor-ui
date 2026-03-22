'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLang = searchParams.get('lang') === 'en' ? 'en' : 'ar';
  const newLang = currentLang === 'ar' ? 'en' : 'ar';

  const switchLanguage = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', newLang);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <button
      onClick={switchLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
      title={currentLang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <GlobeAltIcon className="h-5 w-5 text-gray-700" />
      <span className="text-sm font-medium text-gray-700">
        {currentLang === 'ar' ? 'English' : 'العربية'}
      </span>
    </button>
  );
}
