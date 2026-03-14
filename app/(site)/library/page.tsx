 // app/(site)/library/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function LibraryPage() {
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
    { id: "LAW", title: "القوانين والتشريعات", icon: "⚖️", bg: "bg-blue-100", text: "text-blue-600", gradient: "from-blue-600 to-blue-400", description: "قوانين مدنية، تجارية، جزائية، ودستورية", count: law, href: "/library/list?category=LAW" },
    { id: "FIQH", title: "الفقه وأصوله", icon: "📜", bg: "bg-emerald-100", text: "text-emerald-600", gradient: "from-emerald-600 to-emerald-400", description: "فقه مقارن، قواعد فقهية، وأصول الفقه", count: fiqh, href: "/library/list?category=FIQH" },
    { id: "ACADEMIC", title: "الدراسات الأكاديمية", icon: "🎓", bg: "bg-purple-100", text: "text-purple-600", gradient: "from-purple-600 to-purple-400", description: "رسائل ماجستير، دكتوراه، وأبحاث محكمة", count: academic, href: "/library/list?category=ACADEMIC" },
    { id: "CONTRACT", title: "نماذج العقود", icon: "🤝", bg: "bg-amber-100", text: "text-amber-600", gradient: "from-amber-600 to-amber-400", description: "عقود اعتيادية ودولية احترافية", count: contracts, href: "/library/list?category=CONTRACT" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* الهيرو */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              المكتبة القانونية
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              أكثر من {totalItems} مادة قانونية بين قوانين، دراسات، وعقود احترافية.
              مكتبتك الشاملة للعلوم القانونية.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/library/search" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg">
                🔍 بحث متقدم
              </Link>
              <Link href="/library/categories" className="bg-blue-500/30 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-500/40 transition-all">
                📚 تصفح الأقسام
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* الأقسام الرئيسية */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">الأقسام الرئيسية</h2>
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
                    <span className="text-sm text-gray-500">{cat.count.toLocaleString()} مادة</span>
                    <span className="text-blue-600 group-hover:translate-x-2 transition-transform">←</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* أحدث الإضافات */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">🆕 أحدث الإضافات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentItems.map((item) => (
              <Link key={item.id} href={`/library/view/${item.id}`} className="group bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">
                    {item.mainCategory === 'LAW' && '⚖️'}
                    {item.mainCategory === 'FIQH' && '📜'}
                    {item.mainCategory === 'ACADEMIC' && '🎓'}
                    {item.mainCategory === 'CONTRACT' && '🤝'}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{item.titleAr}</h3>
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
            <span className="text-3xl">🌐</span> مكتبة المصادر الخارجية
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "مكتبة الكونجرس", nameEn: "Library of Congress", url: "https://www.loc.gov", icon: "🇺🇸" },
              { name: "Google Scholar", nameEn: "Google Scholar", url: "https://scholar.google.com", icon: "🎓" },
              { name: "المكتبة الرقمية العالمية", nameEn: "World Digital Library", url: "https://www.wdl.org", icon: "🌍" },
              { name: "دار المنظومة", nameEn: "Mandumah", url: "https://www.mandumah.com", icon: "📚" }
            ].map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-4 transition-all duration-300 border border-white/10 hover:border-white/20">
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