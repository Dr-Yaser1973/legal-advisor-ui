 import { prisma } from "@/lib/prisma";
import Link from "next/link";
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

type Props = {
  searchParams?: Promise<{ lang?: string }>;
};

export default async function LibraryPage({ searchParams }: Props) {
  // قراءة اللغة من searchParams
  const params = await searchParams;
  const locale = params?.lang === 'en' ? 'en' : 'ar';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // الترجمات الكاملة
  const t = {
    ar: {
      siteName: "Legal Advisor",
      title: "المكتبة القانونية",
      description: "مكتبتك الشاملة للعلوم القانونية",
      totalItems: "أكثر من {count} مادة قانونية بين قوانين، دراسات، وعقود احترافية.",
      search: "🔍 بحث متقدم",
      browse: "📚 تصفح الأقسام",
      sections: "الأقسام الرئيسية",
      recent: "🆕 أحدث الإضافات",
      external: "🌐 مكتبة المصادر الخارجية",
      item: "مادة",
      law: "القوانين والتشريعات",
      lawDesc: "قوانين مدنية، تجارية، جزائية، ودستورية",
      fiqh: "الفقه وأصوله",
      fiqhDesc: "فقه مقارن، قواعد فقهية، وأصول الفقه",
      academic: "الدراسات الأكاديمية",
      academicDesc: "رسائل ماجستير، دكتوراه، وأبحاث محكمة",
      contract: "نماذج العقود",
      contractDesc: "عقود اعتيادية ودولية احترافية",
      sources: [
        { name: "مكتبة الكونجرس", nameEn: "Library of Congress", icon: "🇺🇸" },
        { name: "Google Scholar", nameEn: "Google Scholar", icon: "🎓" },
        { name: "المكتبة الرقمية العالمية", nameEn: "World Digital Library", icon: "🌍" },
        { name: "دار المنظومة", nameEn: "Mandumah", icon: "📚" }
      ]
    },
    en: {
      siteName: "Legal Advisor",
      title: "Legal Library",
      description: "Your comprehensive legal library",
      totalItems: "Over {count} legal materials including laws, studies, and professional contracts.",
      search: "🔍 Advanced Search",
      browse: "📚 Browse Sections",
      sections: "Main Sections",
      recent: "🆕 Recent Additions",
      external: "🌐 External Resources Library",
      item: "item",
      law: "Laws & Legislation",
      lawDesc: "Civil, commercial, criminal, and constitutional laws",
      fiqh: "Fiqh & Its Principles",
      fiqhDesc: "Comparative fiqh, legal rules, and principles of fiqh",
      academic: "Academic Studies",
      academicDesc: "Master's theses, doctoral dissertations, and peer-reviewed research",
      contract: "Contract Templates",
      contractDesc: "Standard and international professional contracts",
      sources: [
        { name: "Library of Congress", nameEn: "Library of Congress", icon: "🇺🇸" },
        { name: "Google Scholar", nameEn: "Google Scholar", icon: "🎓" },
        { name: "World Digital Library", nameEn: "World Digital Library", icon: "🌍" },
        { name: "Mandumah", nameEn: "Mandumah", icon: "📚" }
      ]
    }
  };

  const texts = t[locale];

  // جلب إحصائيات الأقسام
  const [law, fiqh, academic, contracts] = await Promise.all([
    prisma.libraryItem.count({ where: { mainCategory: "LAW", isPublished: true } }),
    prisma.libraryItem.count({ where: { mainCategory: "FIQH", isPublished: true } }),
    prisma.libraryItem.count({ where: { mainCategory: "ACADEMIC", isPublished: true } }),
    prisma.libraryItem.count({ where: { mainCategory: "CONTRACT", isPublished: true } }),
  ]);

  // جلب آخر الإضافات
  const recentItems = await prisma.libraryItem.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
    select: {
      id: true,
      titleAr: true,
      titleEn: true,
      mainCategory: true,
      views: true,
      hasPDF: true,
      hasWord: true,
      createdAt: true
    }
  });

  // جلب الإحصائيات الكلية
  const totalItems = await prisma.libraryItem.count({ where: { isPublished: true } });

  const categories = [
    { id: "LAW", title: texts.law, description: texts.lawDesc, icon: "⚖️", bg: "bg-blue-100", text: "text-blue-600", gradient: "from-blue-600 to-blue-400", count: law, href: `/library/list?category=LAW&lang=${locale}` },
    { id: "FIQH", title: texts.fiqh, description: texts.fiqhDesc, icon: "📜", bg: "bg-emerald-100", text: "text-emerald-600", gradient: "from-emerald-600 to-emerald-400", count: fiqh, href: `/library/list?category=FIQH&lang=${locale}` },
    { id: "ACADEMIC", title: texts.academic, description: texts.academicDesc, icon: "🎓", bg: "bg-purple-100", text: "text-purple-600", gradient: "from-purple-600 to-purple-400", count: academic, href: `/library/list?category=ACADEMIC&lang=${locale}` },
    { id: "CONTRACT", title: texts.contract, description: texts.contractDesc, icon: "🤝", bg: "bg-amber-100", text: "text-amber-600", gradient: "from-amber-600 to-amber-400", count: contracts, href: `/library/list?category=CONTRACT&lang=${locale}` }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir={dir}>
      {/* شريط التنقل العلوي مع زر اللغة */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            {texts.siteName}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>

      {/* الهيرو */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {texts.title}
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              {texts.totalItems.replace('{count}', totalItems.toLocaleString())}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href={`/library/search?lang=${locale}`} className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg">
                {texts.search}
              </Link>
              <Link href={`/library/categories?lang=${locale}`} className="bg-blue-500/30 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-500/40 transition-all">
                {texts.browse}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* الأقسام الرئيسية */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{texts.sections}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link key={cat.id} href={cat.href} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-2">
                <div className={`h-2 w-full bg-gradient-to-r ${cat.gradient}`} />
                <div className="p-6">
                  <div className={`w-16 h-16 ${cat.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <span className={`text-3xl ${cat.text}`}>{cat.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{cat.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{cat.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{cat.count.toLocaleString()} {texts.item}</span>
                    <span className="text-blue-600 group-hover:translate-x-2 transition-transform">{dir === 'rtl' ? '←' : '→'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* أحدث الإضافات */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{texts.recent}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentItems.map((item) => (
              <Link key={item.id} href={`/library/view/${item.id}?lang=${locale}`} className="group bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">
                    {item.mainCategory === 'LAW' && '⚖️'}
                    {item.mainCategory === 'FIQH' && '📜'}
                    {item.mainCategory === 'ACADEMIC' && '🎓'}
                    {item.mainCategory === 'CONTRACT' && '🤝'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {locale === 'ar' ? item.titleAr : (item.titleEn || item.titleAr)}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-3">
                  <span>👁️ {item.views}</span>
                  {item.hasPDF && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full">PDF</span>}
                  {item.hasWord && <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Word</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* المصادر الخارجية */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 text-white">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="text-3xl">🌐</span> {texts.external}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {texts.sources.map((link, index) => (
              <a 
                key={link.name} 
                href={[
                  "https://www.loc.gov",
                  "https://scholar.google.com",
                  "https://www.wdl.org",
                  "https://www.mandumah.com"
                ][index]} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-4 transition-all duration-300 border border-white/10 hover:border-white/20"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{link.icon}</span>
                  <div>
                    <div className="font-medium">{link.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{link.nameEn}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}