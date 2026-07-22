 // app/(site)/library/list/components/LibraryListContent.tsx

'use client';

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import LibraryCard from "../../_components/LibraryCard";
import FiltersSidebar from "../../_components/FiltersSidebar";
import { useLocale } from "@/lib/hooks/useLocale";
import { getLibraryTranslations } from "@/lib/i18n/library";
import type { MainCategory, LibraryCardItem } from "@/types/library";

export default function LibraryListContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ✅ قراءة اللغة من URL
  const urlLang = searchParams.get('lang');
  const { locale, setLocale, dir } = useLocale();

  // ✅ تحديث اللغة إذا تغيرت في URL
  useEffect(() => {
    if (urlLang && urlLang !== locale) {
      setLocale(urlLang as 'ar' | 'en');
    }
  }, [urlLang, locale, setLocale]);

  const t = getLibraryTranslations(locale);

  // ✅ قراءة جميع القيم من URL مباشرة كمصدر الحقيقة الوحيد
  const urlCategory = searchParams.get('category') as MainCategory | null;
  const urlPage = Number(searchParams.get('page')) || 1;

  // حالات الفلاتر المحلية فقط (لا تؤثر على URL مباشرة هنا)
  const [selectedCategory, setSelectedCategory] = useState<MainCategory | "ALL">(
    urlCategory || "ALL"
  );
  const [items, setItems] = useState<LibraryCardItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [showExplanations, setShowExplanations] = useState<string>("ALL");
  const [hasPDF, setHasPDF] = useState<boolean>(false);
  const [hasWord, setHasWord] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(urlPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // ✅ مزامنة state مع URL — searchParams هو مصدر الحقيقة
  useEffect(() => {
    const newCategory = searchParams.get('category') as MainCategory | null;
    const newPage = Number(searchParams.get('page')) || 1;

    // تحديث التصنيف فقط إذا تغيّر فعلاً
    setSelectedCategory(newCategory || "ALL");

    // ✅ تحديث الصفحة من URL دائماً — هذا هو الإصلاح الأساسي
    setCurrentPage(newPage);
  }, [searchParams]);

  // ✅ دالة تحديث URL موحّدة — replace بدلاً من push + scroll: false
  const updateUrl = useCallback((params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === 'ALL') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    // التأكد من بقاء اللغة
    if (!newParams.has('lang')) {
      newParams.set('lang', locale);
    }

    // ✅ replace بدلاً من push — يمنع full navigation ومشكلة الداون لود
    // scroll: false — يمنع القفز لأعلى الصفحة عند تغيير الصفحة
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  }, [searchParams, pathname, router, locale]);

  // ✅ دالة الانتقال للصفحة — مباشرة بدون updateUrl لتجنب أي تأخير
  const goToPage = useCallback((page: number) => {
    if (page < 1 || page > totalPages) return;

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('page', page.toString());

    if (!newParams.has('lang')) {
      newParams.set('lang', locale);
    }

    // ✅ تحديث state محلياً فوراً لاستجابة UI سريعة
    setCurrentPage(page);

    // ✅ تحديث URL بدون إعادة تحميل
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  }, [searchParams, pathname, router, locale, totalPages]);

  // دالة إعادة ضبط الفلاتر
  const resetFilters = useCallback(() => {
    setSelectedType("ALL");
    setSelectedYear("ALL");
    setShowExplanations("ALL");
    setHasPDF(false);
    setHasWord(false);
    setSortBy("newest");

    updateUrl({
      type: null,
      year: null,
      explanation: null,
      hasPDF: null,
      hasWord: null,
      sort: 'newest',
      page: '1'
    });
  }, [updateUrl]);

  // جلب البيانات
  useEffect(() => {
    async function loadItems() {
      if (typeof window === 'undefined') return;

      setLoading(true);
      try {
        const params = new URLSearchParams();

        if (selectedCategory !== "ALL") {
          params.append("category", selectedCategory);
        }

        if (selectedType !== "ALL") params.append("type", selectedType);
        if (selectedYear !== "ALL") params.append("year", selectedYear);
        if (showExplanations !== "ALL") params.append("explanation", showExplanations);
        if (hasPDF) params.append("hasPDF", "true");
        if (hasWord) params.append("hasWord", "true");

        params.append("sort", sortBy);
        params.append("page", currentPage.toString());
        params.append("limit", "12");
        params.append("lang", locale);

        const res = await fetch(`/api/library/items?${params.toString()}`);
        const json = await res.json();

        if (json.success) {
          setItems(json.data.items || []);
          setTotalPages(json.data.pagination?.pages || 1);
          setTotalItems(json.data.pagination?.total || 0);
        }
      } catch (error) {
        console.error("Error loading library items:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, [selectedCategory, selectedType, selectedYear, showExplanations, hasPDF, hasWord, sortBy, currentPage, locale]);

  // تبويبات التصنيفات
  const tabs = [
    { key: "ALL", label: t.categories.all, icon: "📚" },
    { key: "LAW", label: t.categories.law, icon: "⚖️" },
    { key: "FIQH", label: t.categories.fiqh, icon: "📜" },
    { key: "ACADEMIC", label: t.categories.academic, icon: "🎓" },
    { key: "CONTRACT", label: t.categories.contract, icon: "🏛️" },
  ];

  return (
    <>
      {/* الهيدر الثابت */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {t.title}
            </h1>
            <Link
              href={`/library?lang=${locale}`}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
            >
              {dir === 'rtl' ? '←' : '→'} {t.backToHome}
            </Link>
          </div>

          {/* التبويبات الأفقية */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => {
              const active = selectedCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(tab.key as MainCategory | "ALL");
                    updateUrl({
                      category: tab.key === "ALL" ? null : tab.key,
                      page: '1'
                    });
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all whitespace-nowrap
                    ${active
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* باقي المحتوى */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* الشريط الجانبي للفلاتر */}
          <aside className="lg:w-80">
            <FiltersSidebar
              selectedType={selectedType}
              setSelectedType={(value) => {
                setSelectedType(value);
                updateUrl({ type: value === "ALL" ? null : value, page: '1' });
              }}
              selectedYear={selectedYear}
              setSelectedYear={(value) => {
                setSelectedYear(value);
                updateUrl({ year: value === "ALL" ? null : value, page: '1' });
              }}
              showExplanations={showExplanations}
              setShowExplanations={(value) => {
                setShowExplanations(value);
                updateUrl({ explanation: value === "ALL" ? null : value, page: '1' });
              }}
              hasPDF={hasPDF}
              setHasPDF={(value) => {
                setHasPDF(value);
                updateUrl({ hasPDF: value ? 'true' : null, page: '1' });
              }}
              hasWord={hasWord}
              setHasWord={(value) => {
                setHasWord(value);
                updateUrl({ hasWord: value ? 'true' : null, page: '1' });
              }}
              sortBy={sortBy}
              setSortBy={(value) => {
                setSortBy(value);
                updateUrl({ sort: value, page: '1' });
              }}
              onReset={resetFilters}
            />
          </aside>

          {/* قسم النتائج */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {loading
                  ? t.loading
                  : `عرض ${items.length} من أصل ${totalItems} نتيجة`}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{t.sortBy}:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    updateUrl({ sort: e.target.value, page: '1' });
                  }}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="newest">{t.newest}</option>
                  <option value="oldest">{t.oldest}</option>
                  <option value="popular">{t.popular}</option>
                  <option value="rated">{t.rated}</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse"
                  >
                    <div className="h-12 w-12 bg-gray-200 rounded-2xl mb-4" />
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-gray-200 rounded-full" />
                      <div className="h-6 w-16 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : items.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <LibraryCard
                      key={item.id}
                      item={item}
                      locale={locale}
                      dir={dir}
                    />
                  ))}
                </div>

                {/* ✅ Pagination المُصلَح */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">

                    {/* زر السابق */}
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      {dir === 'rtl' ? '→' : '←'} {t.previous}
                    </button>

                    {/* أرقام الصفحات */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        // عرض الصفحة الأولى والأخيرة دائماً
                        // وعرض 2 صفحات حول الصفحة الحالية
                        return (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                        );
                      })
                      .reduce<(number | '...')[]>((acc, page, idx, arr) => {
                        // إضافة "..." بين الأرقام المتباعدة
                        if (idx > 0) {
                          const prev = arr[idx - 1];
                          if (page - prev > 1) {
                            acc.push('...');
                          }
                        }
                        acc.push(page);
                        return acc;
                      }, [])
                      .map((page, idx) =>
                        page === '...' ? (
                          <span
                            key={`ellipsis-${idx}`}
                            className="px-2 py-2 text-gray-400 select-none"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            type="button"
                            onClick={() => goToPage(page as number)}
                            className={`min-w-[40px] px-3 py-2 rounded-lg border transition-colors font-medium ${
                              page === currentPage
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}

                    {/* زر التالي */}
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      {t.next} {dir === 'rtl' ? '←' : '→'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t.noItems}
                </h3>
                <p className="text-gray-500">{t.tryDifferentFilters}</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
