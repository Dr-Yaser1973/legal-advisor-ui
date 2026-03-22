'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/hooks/useLocale';

interface LibraryTabsProps {
  abstractAr?: string | null;
  abstractEn?: string | null;
  basicExplanation?: string | null;
  professionalExplanation?: string | null;
  commercialExplanation?: string | null;
}

export default function LibraryTabs({
  abstractAr,
  abstractEn,
  basicExplanation,
  professionalExplanation,
  commercialExplanation,
}: LibraryTabsProps) {
  const { locale, dir } = useLocale();
  const [activeTab, setActiveTab] = useState<'abstract' | 'basic' | 'professional' | 'commercial'>('abstract');

  // ترجمة عناوين التبويبات حسب اللغة
  const tabLabels = {
    abstract: locale === 'ar' ? 'الملخص' : 'Abstract',
    basic: locale === 'ar' ? 'شرح مبسط' : 'Simplified',
    professional: locale === 'ar' ? 'شرح متخصص' : 'Professional',
    commercial: locale === 'ar' ? 'شرح تجاري' : 'Commercial',
  };

  const tabs = [
    { id: 'abstract', label: tabLabels.abstract, hasContent: locale === 'ar' ? !!abstractAr : !!abstractEn },
    { id: 'basic', label: tabLabels.basic, hasContent: !!basicExplanation },
    { id: 'professional', label: tabLabels.professional, hasContent: !!professionalExplanation },
    { id: 'commercial', label: tabLabels.commercial, hasContent: !!commercialExplanation },
  ].filter(tab => tab.hasContent);

  // اختيار المحتوى حسب اللغة
  const getContent = () => {
    if (activeTab === 'abstract') {
      return locale === 'ar' ? abstractAr : abstractEn;
    }
    if (activeTab === 'basic') return basicExplanation;
    if (activeTab === 'professional') return professionalExplanation;
    if (activeTab === 'commercial') return commercialExplanation;
    return null;
  };

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* رأس التبويبات */}
      <div className="border-b border-gray-200 overflow-x-auto scrollbar-hide">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 font-medium text-sm transition-all whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/30' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              style={{ fontFamily: locale === 'ar' ? 'inherit' : 'system-ui' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* محتوى التبويب النشط */}
      <div className="p-8">
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-line text-lg leading-relaxed"
             dir={activeTab === 'abstract' && locale === 'en' ? 'ltr' : dir}>
            {getContent()}
          </p>
        </div>
      </div>
    </div>
  );
}
