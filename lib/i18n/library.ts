 // lib/i18n/library.ts

export const libraryTranslations = {
  ar: {
    title: "المكتبة القانونية",
    backToHome: "العودة للرئيسية",
    backToLibrary: "العودة للمكتبة",
    searchPlaceholder: "ابحث عن قانون أو وثيقة...",
    loading: "جاري التحميل...",
    noItems: "لا توجد مواد",
    tryDifferentFilters: "جرب تغيير معايير البحث",
    previous: "السابق",
    next: "التالي",
    sortBy: "ترتيب حسب",
    newest: "الأحدث",
    oldest: "الأقدم",
    popular: "الأكثر مشاهدة",
    rated: "الأعلى تقييماً",
    
    categories: {
      all: "الكل",
      law: "القوانين",
      fiqh: "الفقه",
      academic: "دراسات أكاديمية",
      contract: "العقود",
      other: "أخرى"
    },
    
     tabs: {
  pdf: "PDF",
  content: "المحتوى",
  basic: "شرح مبسط",
  professional: "شرح مهني",
  commercial: "شرح تجاري",
  related: "مواد مرتبطة",
},
    
    explanations: {
      basicTitle: "📘 شرح مبسط",
      basicDesc: "هذا الشرح موجه للجمهور العام والمبتدئين",
      professionalTitle: "📚 شرح احترافي",
      professionalDesc: "هذا الشرح موجه للمحامين والمتخصصين",
      commercialTitle: "💼 شرح تجاري",
      commercialDesc: "هذا الشرح موجه لرجال الأعمال والمستثمرين"
    },
    
    info: {
      year: "السنة",
      author: "المؤلف",
      jurisdiction: "الاختصاص",
      university: "الجامعة"
    },
    
    actions: {
      addToFavorites: "أضف إلى المفضلة",
      removeFromFavorites: "إزالة من المفضلة",
      share: "مشاركة",
      print: "طباعة",
      edit: "تعديل",
      download: "تحميل"
    }
  },
  
  en: {
    title: "Legal Library",
    backToHome: "Back to Home",
    backToLibrary: "Back to Library",
    searchPlaceholder: "Search laws or documents...", // ✅ أضف هذ
    loading: "Loading...",
    noItems: "No items found",
    tryDifferentFilters: "Try different search criteria",
    previous: "Previous",
    next: "Next",
    sortBy: "Sort by",
    newest: "Newest",
    oldest: "Oldest",
    popular: "Most Popular",
    rated: "Top Rated",
    
    categories: {
      all: "All",
      law: "Laws",
      fiqh: "Jurisprudence",
      academic: "Academic Studies",
      contract: "Contracts",
      other: "Other"
    },
    
    tabs: {
      pdf: "PDF",
      content: "Content",
      basic: "Basic Explanation",
      professional: "Professional",
      commercial: "Commercial",
      related: "Related"
    },
    
    explanations: {
      basicTitle: "📘 Basic Explanation",
      basicDesc: "For general audience and beginners",
      professionalTitle: "📚 Professional Explanation",
      professionalDesc: "For lawyers and legal professionals",
      commercialTitle: "💼 Commercial Explanation",
      commercialDesc: "For businessmen and investors"
    },
    
    info: {
      year: "Year",
      author: "Author",
      jurisdiction: "Jurisdiction",
      university: "University"
    },
    
    actions: {
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
      share: "Share",
      print: "Print",
      edit: "Edit",
      download: "Download"
    }
  }
};

export function getLibraryTranslations(locale: string) {
  return locale === 'ar' ? libraryTranslations.ar : libraryTranslations.en;
}