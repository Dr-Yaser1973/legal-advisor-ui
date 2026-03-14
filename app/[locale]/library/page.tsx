 // app/[locale]/library/page.tsx
"use client";

import { useLocale } from "@/lib/hooks/useLocale";
import { getLibraryTranslations } from "@/lib/i18n/library";

export default function LibraryPage() {
  const { locale, dir } = useLocale();
  const t = getLibraryTranslations(locale);  // جلب الترجمة حسب اللغة

  return (
    <div className="min-h-screen" dir={dir}>
      <h1 className="text-3xl font-bold">{t.title}</h1>
      
      <input 
        placeholder={t.searchPlaceholder}  // النص يتغير حسب اللغة
        className="w-full p-3 border rounded-lg"
      />
      
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(t.categories).map(([key, label]) => (
          <button key={key} className="p-4 bg-gray-100 rounded-lg">
            {label}  {/* اسم التصنيف باللغة المناسبة */}
          </button>
        ))}
      </div>
    </div>
  );
}