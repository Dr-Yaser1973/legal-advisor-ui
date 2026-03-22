import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

type Props = {
  searchParams?: Promise<{ lang?: string }>;
};

export default async function CategoriesPage({ searchParams }: Props) {
  const params = await searchParams;
  const locale = params?.lang === 'en' ? 'en' : 'ar';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // جلب إحصائيات الأقسام
  const [law, fiqh, academic, contracts] = await Promise.all([
    prisma.libraryItem.count({ where: { mainCategory: "LAW", isPublished: true } }),
    prisma.libraryItem.count({ where: { mainCategory: "FIQH", isPublished: true } }),
    prisma.libraryItem.count({ where: { mainCategory: "ACADEMIC", isPublished: true } }),
    prisma.libraryItem.count({ where: { mainCategory: "CONTRACT", isPublished: true } }),
  ]);

  const texts = {
    ar: {
      title: "تصفح الأقسام",
      description: "اختر القسم الذي تريد تصفحه",
      back: "← العودة للمكتبة",
      categories: [
        { id: "LAW", name: "القوانين والتشريعات", icon: "⚖️", count: law, desc: "قوانين مدنية، تجارية، جزائية، ودستورية" },
        { id: "FIQH", name: "الفقه وأصوله", icon: "📜", count: fiqh, desc: "فقه مقارن، قواعد فقهية، وأصول الفقه" },
        { id: "ACADEMIC", name: "الدراسات الأكاديمية", icon: "🎓", count: academic, desc: "رسائل ماجستير، دكتوراه، وأبحاث محكمة" },
        { id: "CONTRACT", name: "نماذج العقود", icon: "🤝", count: contracts, desc: "عقود اعتيادية ودولية احترافية" }
      ]
    },
    en: {
      title: "Browse Categories",
      description: "Select the category you want to browse",
      back: "← Back to Library",
      categories: [
        { id: "LAW", name: "Laws & Legislation", icon: "⚖️", count: law, desc: "Civil, commercial, criminal, and constitutional laws" },
        { id: "FIQH", name: "Fiqh & Its Principles", icon: "📜", count: fiqh, desc: "Comparative fiqh, legal rules, and principles of fiqh" },
        { id: "ACADEMIC", name: "Academic Studies", icon: "🎓", count: academic, desc: "Master's theses, doctoral dissertations, and peer-reviewed research" },
        { id: "CONTRACT", name: "Contract Templates", icon: "🤝", count: contracts, desc: "Standard and international professional contracts" }
      ]
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

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link 
          href={`/library?lang=${locale}`} 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8"
        >
          {t.back}
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.title}</h1>
        <p className="text-gray-600 mb-8">{t.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/library/list?category=${cat.id}&lang=${locale}`}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-2"
            >
              <div className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-3xl text-blue-600">{cat.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{cat.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{cat.count} {locale === 'ar' ? 'مادة' : 'items'}</span>
                  <span className="text-blue-600 group-hover:translate-x-2 transition-transform">
                    {dir === 'rtl' ? '←' : '→'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
