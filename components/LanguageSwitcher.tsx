// components/LanguageSwitcher.tsx
"use client";

import { useLocale } from "@/lib/hooks/useLocale";
import { usePathname, useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    // تبديل اللغة في المسار
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <button
      onClick={switchLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50"
    >
      {locale === 'ar' ? (
        <>
          <span>🇬🇧</span>
          <span>English</span>
        </>
      ) : (
        <>
          <span>🇸🇦</span>
          <span>العربية</span>
        </>
      )}
    </button>
  );
}
