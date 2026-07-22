// app/(site)/library/search/SearchContent.tsx
'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import LibraryCard from "../_components/LibraryCard";
import { useLocale } from "@/lib/hooks/useLocale";
import { getLibraryTranslations } from "@/lib/i18n/library";
import type { MainCategory, LibraryCardItem } from "@/types/library";

const TABS: { key: MainCategory | "ALL"; icon: string }[] = [
  { key: "ALL", icon: "📚" },
  { key: "LAW", icon: "⚖️" },
  { key: "FIQH", icon: "📜" },
  { key: "ACADEMIC", icon: "🎓" },
  { key: "CONTRACT", icon: "🤝" },
];

export default function SearchContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlLang = searchParams.get('lang');
  const { locale, setLocale, dir } = useLocale();

  useEffect(() => {
    if (urlLang && urlLang !== locale) {
      setLocale(urlLang as 'ar' | 'en');
    }
  }, [urlLang, locale, setLocale]);

  const t = getLibraryTranslations(locale);

  const urlQuery = searchParams.get('q') || '';
  const urlCategory = (searchParams.get('category') as MainCategory | null) || 'ALL';

  const [query, setQuery] = useState(urlQuery);
  const [category, setCategory] = useState<MainCategory | "ALL">(urlCategory);
  const [items, setItems] = useState<LibraryCardItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!urlQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // مزامنة الحقول مع الـURL (زر الرجوع/الأمام)
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setCategory((searchParams.get('category') as MainCategory | null) || 'ALL');
  }, [searchParams]);

  // كتابة معايير البحث في الـURL
  const pushToUrl = useCallback((q: string, cat: MainCategory | "ALL") => {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (cat !== 'ALL') params.set('category', cat);
    params.set('lang', locale);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, locale]);

  // جلب النتائج عند تغيّر الاستعلام أو التصنيف (مع debounce بسيط)
  useEffect(() => {
    const q = urlQuery.trim();
    if (!q) {
      setItems([]);
      setTotal(0);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    setLoading(true);
    const controller = new AbortController();

    (async () => {
      try {
        const params = new URLSearchParams();
        params.set('q', q);
        if (urlCategory !== 'ALL') params.set('category', urlCategory);
        params.set('limit', '24');
        params.set('lang', locale);

        const res = await fetch(`/api/library/items?${params.toString()}`, {
          signal: controller.signal,
        });
        const json = await res.json();
        if (json.success) {
          setItems(json.data.items || []);
          setTotal(json.data.pagination?.total || 0);
        } else {
          setItems([]);
          setTotal(0);
        }
      } catch (err) {
        if ((err as any)?.name !== 'AbortError') {
          console.error('Search error:', err);
          setItems([]);
          setTotal(0);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [urlQuery, urlCategory, locale]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    pushToUrl(query, category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir={dir}>
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {locale === 'ar' ? 'البحث في المكتبة' : 'Search the Library'}
            </h1>
            <Link
              href={`/library?lang=${locale}`}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
            >
              {dir === 'rtl' ? '←' : '→'} {t.backToLibrary}
            </Link>
          </div>

          {/* حقل البحث */}
          <form onSubmit={onSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 flex items-center text-gray-400 start-4 pointer-events-none">
                🔍
              </span>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full ps-11 pe-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              {locale === 'ar' ? 'بحث' : 'Search'}
            </button>
          </form>

          {/* تبويبات التصنيف */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            {TABS.map((tab) => {
              const active = category === tab.key;
              const label =
                tab.key === 'ALL' ? t.categories.all :
                tab.key === 'LAW' ? t.categories.law :
                tab.key === 'FIQH' ? t.categories.fiqh :
                tab.key === 'ACADEMIC' ? t.categories.academic :
                t.categories.contract;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setCategory(tab.key);
                    pushToUrl(query, tab.key);
                  }}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                    ${active
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  <span>{tab.icon}</span>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-2xl mb-4" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : !hasSearched ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔎</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {locale === 'ar' ? 'ابحث في آلاف المواد القانونية' : 'Search thousands of legal materials'}
            </h3>
            <p className="text-gray-500">
              {locale === 'ar'
                ? 'اكتب اسم قانون أو موضوعاً أو كلمة مفتاحية ثم اضغط بحث'
                : 'Type a law name, topic, or keyword and press Search'}
            </p>
          </div>
        ) : items.length > 0 ? (
          <>
            <p className="text-gray-600 mb-6">
              {locale === 'ar'
                ? `${total} نتيجة لـ «${urlQuery}»`
                : `${total} results for "${urlQuery}"`}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <LibraryCard key={item.id} item={item} locale={locale} dir={dir} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t.noItems}</h3>
            <p className="text-gray-500">
              {locale === 'ar'
                ? `لا توجد نتائج لـ «${urlQuery}». جرّب كلمات أخرى.`
                : `No results for "${urlQuery}". Try different words.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
