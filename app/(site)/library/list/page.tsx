 // app/(site)/library/list/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';  // ✅ أضف هذا الاستيراد
import LibraryListContent from './components/LibraryListContent';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

// هذه الصفحة هي Server Component (بدون "use client")
export default function LibraryListPage() {
  return (
    <Suspense fallback={<LibraryListSkeleton />}>
      <LibraryListContent />
    </Suspense>
  );
}

// مكون Skeleton للتحميل
function LibraryListSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir="rtl">
      {/* شريط التنقل العلوي */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Legal Advisor
          </Link>
          <LanguageSwitcher />  {/* ✅ زر اللغة في مكانه الصحيح */}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80">
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </aside>
          
          <main className="flex-1">
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
          </main>
        </div>
      </div>
    </div>
  );
}