 // app/(site)/library/_components/LibraryCard.tsx
import Link from "next/link";
import type { LibraryCardItem } from "@/types/library";

interface LibraryCardProps {
  item: LibraryCardItem;
  locale?: string;
  dir?: string;
}

export default function LibraryCard({ item, locale = 'ar', dir = 'rtl' }: LibraryCardProps) {
  
  const title = locale === 'ar' ? item.titleAr : (item.titleEn || item.titleAr);
  
  const getIcon = () => {
    switch(item.mainCategory) {
      case "LAW": return "⚖️";
      case "FIQH": return "📜";
      case "ACADEMIC": return "🎓";
      case "CONTRACT": return "🤝";
      default: return "📄";
    }
  };

  const getCategoryColor = () => {
    switch(item.mainCategory) {
      case "LAW": return "blue";
      case "FIQH": return "emerald";
      case "ACADEMIC": return "purple";
      case "CONTRACT": return "amber";
      default: return "gray";
    }
  };

  const color = getCategoryColor();
  const icon = getIcon();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Link
      href={`/library/view/${item.id}`}
      className="group bg-white rounded-2xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden block"
      dir={dir}
    >
      <div className={`h-2 w-full bg-${color}-500`} />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 bg-${color}-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          
          <div className="flex gap-1">
            {item.basicExplanation && (
              <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full" title={locale === 'ar' ? "شرح مبسط" : "Basic Explanation"}>
                📘
              </span>
            )}
            {item.professionalExplanation && (
              <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full" title={locale === 'ar' ? "شرح احترافي" : "Professional Explanation"}>
                📚
              </span>
            )}
            {item.commercialExplanation && (
              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full" title={locale === 'ar' ? "شرح تجاري" : "Commercial Explanation"}>
                💼
              </span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-${color}-600 transition-colors`}>
            {title}
          </h3>
          
          {locale === 'ar' && item.titleEn && (
            <p className="text-sm text-gray-400 line-clamp-1 mb-2" dir="ltr">
              {item.titleEn}
            </p>
          )}
          {locale === 'en' && item.titleAr && (
            <p className="text-sm text-gray-400 line-clamp-1 mb-2" dir="rtl">
              {item.titleAr}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500">
            {item.year && (
              <span className="flex items-center gap-1">
                📅 {item.year}
              </span>
            )}
            {item.author && (
              <span className="flex items-center gap-1">
                ✍️ {item.author.length > 15 ? item.author.substring(0, 15) + '...' : item.author}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {item.hasPDF && (
              <span className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full border border-red-100">
                📄 PDF
              </span>
            )}
            {item.hasWord && (
              <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full border border-blue-100">
                📝 Word
              </span>
            )}
          </div>

          <span className="text-xs text-gray-400">
            {formatDate(item.createdAt)}
          </span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            👁️ {item.views.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')}
          </span>
          <span className="flex items-center gap-1">
            ⬇️ {item.downloads.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')}
          </span>
          <span className="flex items-center gap-1">
            ⭐ {item.rating.toFixed(1)}
          </span>
        </div>

        {/* ✅ إذا أردت إضافة علامة تمييز بناءً على المشاهدات */}
        {item.views > 100 && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full shadow-lg">
            ⭐ {locale === 'ar' ? 'الأكثر مشاهدة' : 'Popular'}
          </div>
        )}

      </div>
    </Link>
  );
}