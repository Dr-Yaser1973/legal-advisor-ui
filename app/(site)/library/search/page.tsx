import Link from "next/link";
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

type Props = {
  searchParams?: Promise<{ lang?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const locale = params?.lang === 'en' ? 'en' : 'ar';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const texts = {
    ar: {
      title: "البحث المتقدم",
      description: "ابحث في المكتبة القانونية",
      back: "← العودة للمكتبة"
    },
    en: {
      title: "Advanced Search",
      description: "Search the legal library",
      back: "← Back to Library"
    }
  };

  const t = texts[locale];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir={dir}>
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Legal Advisor
          </Link>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link 
          href={`/library?lang=${locale}`} 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8"
        >
          {t.back}
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.title}</h1>
        <p className="text-gray-600 mb-8">{t.description}</p>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="text-center py-12">
            <p className="text-gray-500">قيد التطوير - سيتم إضافة البحث المتقدم قريباً</p>
          </div>
        </div>
      </div>
    </div>
  );
}
