 // app/(site)/library/list/components/LibraryListContent.tsx

'use client';

import { useEffect, useState } from "react";
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
  
  // قراءة category من URL
  const urlCategory = searchParams.get('category') as MainCategory | null;
  
  // حالة التصنيف المختار
  const [selectedCategory, setSelectedCategory] = useState<MainCategory | "ALL">(
    urlCategory || "ALL"
  );
  
  // باقي حالات الفلاتر
  const [items, setItems] = useState<LibraryCardItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [showExplanations, setShowExplanations] = useState<string>("ALL");
  const [hasPDF, setHasPDF] = useState<boolean>(false);
  const [hasWord, setHasWord] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // تحديث selectedCategory عندما يتغير URL
  useEffect(() => {
    const newCategory = searchParams.get('category') as MainCategory | null;
    if (newCategory) {
      setSelectedCategory(newCategory);
      setCurrentPage(1);
    }
  }, [searchParams]);

  // دالة تحديث URL مع الحفاظ على اللغة
  const updateUrl = (params: Record<string, string | null>) => {
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
    
    router.push(`${pathname}?${newParams.toString()}`);
  };

  // دالة إعادة ضبط الفلاتر
  const resetFilters = () => {
    setSelectedType("ALL");
    setSelectedYear("ALL");
    setShowExplanations("ALL");
    setHasPDF(false);
    setHasWord(false);
    setSortBy("newest");
    setCurrentPage(1);
    
    // تحديث URL مع الحفاظ على اللغة والتصنيف
    updateUrl({
      type: null,
      year: null,
      explanation: null,
      hasPDF: null,
      hasWord: null,
      sort: 'newest',
      page: '1'
    });
  };

  // جلب البيانات
  useEffect(() => {
    async function loadItems() {
      if (typeof window === 'undefined') return;
      
      setLoading(true);
      try {
        const params = new URLSearchParams();
        
        // إضافة التصنيف
        if (selectedCategory !== "ALL") {
          params.append("category", selectedCategory);
        }
        
        // إضافة باقي الفلاتر
        if (selectedType !== "ALL") params.append("type", selectedType);
        if (selectedYear !== "ALL") params.append("year", selectedYear);
        if (showExplanations !== "ALL") params.append("explanation", showExplanations);
        if (hasPDF) params.append("hasPDF", "true");
        if (hasWord) params.append("hasWord", "true");
        
        params.append("sort", sortBy);
        params.append("page", currentPage.toString());
        params.append("limit", "12");
        
        // ✅ إضافة اللغة إلى الطلب (اختياري)
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
    { key: "CONTRACT", label: t.categories.contract, icon: "🤝" },
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
                  onClick={() => {
                    setSelectedCategory(tab.key as any);
                    setCurrentPage(1);
                    // ✅ تحديث URL مع الحفاظ على اللغة
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
                setCurrentPage(1);
                updateUrl({ type: value === "ALL" ? null : value, page: '1' });
              }}
              selectedYear={selectedYear}
              setSelectedYear={(value) => {
                setSelectedYear(value);
                setCurrentPage(1);
                updateUrl({ year: value === "ALL" ? null : value, page: '1' });
              }}
              showExplanations={showExplanations}
              setShowExplanations={(value) => {
                setShowExplanations(value);
                setCurrentPage(1);
                updateUrl({ explanation: value === "ALL" ? null : value, page: '1' });
              }}
              hasPDF={hasPDF}
              setHasPDF={(value) => {
                setHasPDF(value);
                setCurrentPage(1);
                updateUrl({ hasPDF: value ? 'true' : null, page: '1' });
              }}
              hasWord={hasWord}
              setHasWord={(value) => {
                setHasWord(value);
                setCurrentPage(1);
                updateUrl({ hasWord: value ? 'true' : null, page: '1' });
              }}
              sortBy={sortBy}
              setSortBy={(value) => {
                setSortBy(value);
                setCurrentPage(1);
                updateUrl({ sort: value, page: '1' });
              }}
              onReset={resetFilters}
            />
          </aside>

          {/* قسم النتائج */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {loading ? t.loading : `عرض ${items.length} من أصل ${totalItems} نتيجة`}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{t.sortBy}:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
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
                  <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
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

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    <button
                      onClick={() => {
                        const newPage = Math.max(1, currentPage - 1);
                        setCurrentPage(newPage);
                        updateUrl({ page: newPage.toString() });
                      }}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                      {dir === 'rtl' ? '→' : '←'} {t.previous}
                    </button>
                    
                    <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                      {currentPage} / {totalPages}
                    </span>
                    
                    <button
                      onClick={() => {
                        const newPage = Math.min(totalPages, currentPage + 1);
                        setCurrentPage(newPage);
                        updateUrl({ page: newPage.toString() });
                      }}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
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
                <p className="text-gray-500">
                  {t.tryDifferentFilters}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}