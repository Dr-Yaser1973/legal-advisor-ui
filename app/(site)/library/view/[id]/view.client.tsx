 "use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
 import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import LibraryTabs from '@/components/library/LibraryTabs';
import { useLocale } from '@/lib/hooks/useLocale';
import LibraryAIExplainPanel from '@/components/ai/LibraryAIExplainPanel';
import { 
  DocumentTextIcon, 
  ArrowDownTrayIcon, 
  StarIcon as StarOutline,
  HeartIcon as HeartOutline,
  BookmarkIcon as BookmarkOutline,
  ChevronRightIcon,
  ChevronLeftIcon,
  ShareIcon,
  PrinterIcon,
  EyeIcon,
  CloudArrowDownIcon,
  BookmarkIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";
import { 
  StarIcon as StarSolid, 
  HeartIcon as HeartSolid,
  BookmarkIcon as BookmarkSolid,
} from "@heroicons/react/24/solid";

// تعريف الأنواع
type LibraryItem = {
  id: string;
  titleAr: string;
  titleEn?: string | null;
  abstractAr?: string | null;
  abstractEn?: string | null;
  basicExplanation?: string | null;
  professionalExplanation?: string | null;
  commercialExplanation?: string | null;
  mainCategory: string;
  subCategory?: string | null;
  itemType: string;
  hasPDF: boolean;
  hasWord: boolean;
  pdfUrl?: string | null;
  wordUrl?: string | null;
  jurisdiction?: string | null;
  year?: number | null;
  author?: string | null;
  university?: string | null;
  keywords?: string[];
  views: number;
  downloads: number;
  saves: number;
  rating?: number;
  totalRatings?: number;
  tags?: string[];
  documents?: Array<{
    id: number;
    title: string;
    filename?: string | null;
    mimetype: string;
    size?: number;
    url?: string | null;
    createdAt?: string;
  }>;
  createdBy?: {
    id: number;
    name?: string | null;
    email?: string | null;
  } | null;
  createdAt?: string;
};

type RelatedItem = {
  id: string;
  titleAr: string;
  titleEn?: string | null;
  mainCategory: string;
  itemType?: string;
  relationType?: string;
};

type Props = {
  item: LibraryItem;
  relatedItems: RelatedItem[];
  stats?: {
    views: number;
    downloads: number;
    saves: number;
  };
  canEdit: boolean;
  isAuthenticated: boolean;
  userRole: string;
  userId?: number;
  isFavorited?: boolean;
};

export default function LibraryItemViewClient({
  item,
  relatedItems,
  stats,
  canEdit,
  isAuthenticated,
  userRole,
  userId,
  isFavorited: initialFavorited = false,
}: Props) {
  const router = useRouter();
  const { locale, dir } = useLocale(); // ✅ إضافة دعم اللغة
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isSaved, setIsSaved] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);
  const [pdfError, setPdfError] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [notes, setNotes] = useState<any[]>([]);

  // التحقق من وجود PDF صالح
  const validPdfUrl = item.pdfUrl && !pdfError ? item.pdfUrl : null;

  // جلب الملاحظات السابقة
  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchNotes();
    }
  }, [isAuthenticated, userId, item.id]);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`/api/library/items/${item.id}/notes`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // تبديل المفضلة
  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error(locale === 'ar' ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/library/items/${item.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'favorite' })
      });

      if (res.ok) {
        setIsFavorited(!isFavorited);
        toast.success(isFavorited 
          ? (locale === 'ar' ? 'تمت الإزالة من المفضلة' : 'Removed from favorites')
          : (locale === 'ar' ? 'تمت الإضافة للمفضلة' : 'Added to favorites')
        );
      } else {
        const data = await res.json();
        toast.error(data.error || (locale === 'ar' ? 'حدث خطأ' : 'An error occurred'));
      }
    } catch (error) {
      toast.error(locale === 'ar' ? 'فشل الاتصال بالخادم' : 'Connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  // تسجيل تقييم
  const rateItem = async (rating: number) => {
    if (!isAuthenticated) {
      toast.error(locale === 'ar' ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      return;
    }

    try {
      const res = await fetch(`/api/library/items/${item.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'rating',
          rating,
          review: ''
        })
      });

      if (res.ok) {
        setUserRating(rating);
        toast.success(locale === 'ar' ? 'تم تسجيل تقييمك' : 'Rating saved');
      }
    } catch (error) {
      toast.error(locale === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  };

  // إضافة ملاحظة
  const addNote = async () => {
    if (!noteContent.trim()) return;

    try {
      const res = await fetch(`/api/library/items/${item.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'note',
          content: noteContent,
          page: selectedDocument
        })
      });

      if (res.ok) {
        setNoteContent('');
        setShowNotes(false);
        fetchNotes();
        toast.success(locale === 'ar' ? 'تم إضافة الملاحظة' : 'Note added');
      }
    } catch (error) {
      toast.error(locale === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  };

  // تسجيل تحميل
  const handleDownload = async (url: string, filename: string, type: string) => {
    try {
      await fetch(`/api/library/items/${item.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'download' })
      });

      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `document.${type === 'pdf' ? 'pdf' : 'docx'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(locale === 'ar' ? 'جاري تحميل الملف' : 'Downloading file');
    } catch (error) {
      toast.error(locale === 'ar' ? 'حدث خطأ في التحميل' : 'Download failed');
    }
  };

  // مشاركة الرابط
  const shareItem = () => {
    const shareTitle = locale === 'ar' ? item.titleAr : (item.titleEn || item.titleAr);
    const shareText = locale === 'ar' 
      ? (item.abstractAr || `مادة قانونية: ${item.titleAr}`)
      : (item.abstractEn || `Legal item: ${item.titleAr}`);
    
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(locale === 'ar' ? 'تم نسخ الرابط' : 'Link copied');
    }
  };

  // طباعة المستند
  const printDocument = () => {
    window.print();
  };

  // ترجمة التصنيفات
  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      'LAW': locale === 'ar' ? 'قانون' : 'Law',
      'FIQH': locale === 'ar' ? 'فقه' : 'Fiqh',
      'ACADEMIC': locale === 'ar' ? 'أكاديمي' : 'Academic',
      'CONTRACT': locale === 'ar' ? 'عقد' : 'Contract'
    };
    return categories[category] || category;
  };

  const getItemTypeName = (type: string) => {
    const types: Record<string, string> = {
      'STATUTE': locale === 'ar' ? 'قانون' : 'Statute',
      'REGULATION': locale === 'ar' ? 'لائحة' : 'Regulation',
      'PHD_THESIS': locale === 'ar' ? 'أطروحة دكتوراه' : 'PhD Thesis',
      'MASTER_THESIS': locale === 'ar' ? 'رسالة ماجستير' : 'Master Thesis',
      'RESEARCH_PAPER': locale === 'ar' ? 'بحث علمي' : 'Research Paper',
      'CONSTITUTION': locale === 'ar' ? 'دستور' : 'Constitution',
      'CONTRACT': locale === 'ar' ? 'عقد' : 'Contract',
      'COURT_RULING': locale === 'ar' ? 'حكم قضائي' : 'Court Ruling'
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir={dir}>
      {/* شريط التنقل العلوي */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all hover:scale-105"
                aria-label={locale === 'ar' ? 'رجوع' : 'Back'}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
              <nav className="text-sm text-gray-500">
                <span 
                  onClick={() => router.push('/library')}
                  className="hover:text-gray-900 cursor-pointer transition-colors"
                >
                  {locale === 'ar' ? 'المكتبة القانونية' : 'Legal Library'}
                </span>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">
                  {getCategoryName(item.mainCategory)}
                </span>
              </nav>
            </div>
            <div className="flex items-center gap-2">
               <LanguageSwitcher />
              <button
                onClick={shareItem}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all hover:scale-105"
                title={locale === 'ar' ? 'مشاركة' : 'Share'}
              >
                <ShareIcon className="h-5 w-5" />
              </button>
              <button
                onClick={printDocument}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all hover:scale-105"
                title={locale === 'ar' ? 'طباعة' : 'Print'}
              >
                <PrinterIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* العمود الرئيسي */}
          <div className="lg:col-span-2 space-y-6">
            {/* بطاقة العنوان */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              {/* شارة التصنيف */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {getItemTypeName(item.itemType)}
                </span>
                {item.year && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {item.year}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {locale === 'ar' ? item.titleAr : (item.titleEn || item.titleAr)}
              </h1>
              
              {locale === 'en' && item.titleEn && (
                <h2 className="text-lg text-gray-600 mb-6 border-b pb-4 font-light">
                  {item.titleAr}
                </h2>
              )}
              
              {/* المعلومات الأساسية */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                {item.author && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">{locale === 'ar' ? 'المؤلف' : 'Author'}</div>
                    <div className="font-medium text-gray-900">{item.author}</div>
                  </div>
                )}
                {item.jurisdiction && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">{locale === 'ar' ? 'الاختصاص' : 'Jurisdiction'}</div>
                    <div className="font-medium text-gray-900">{item.jurisdiction}</div>
                  </div>
                )}
                {item.university && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">{locale === 'ar' ? 'الجامعة' : 'University'}</div>
                    <div className="font-medium text-gray-900">{item.university}</div>
                  </div>
                )}
                {item.subCategory && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">{locale === 'ar' ? 'التصنيف الفرعي' : 'Subcategory'}</div>
                    <div className="font-medium text-gray-900">{item.subCategory}</div>
                  </div>
                )}
              </div>

              {/* الكلمات المفتاحية */}
              {item.keywords && item.keywords.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {item.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-4 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm hover:from-blue-100 hover:to-indigo-100 transition-all cursor-pointer border border-blue-200/50"
                      onClick={() => router.push(`/library?keyword=${encodeURIComponent(keyword)}`)}
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>

             {/* التبويبات */}
<LibraryTabs
  abstractAr={item.abstractAr}
  abstractEn={item.abstractEn}
  basicExplanation={item.basicExplanation}
  professionalExplanation={item.professionalExplanation}
  commercialExplanation={item.commercialExplanation}
/>

{/* ✅  الشرح */}
<LibraryAIExplainPanel
  itemId={item.id}
  title={item.titleAr}
  initialExplanations={{
    basic: item.basicExplanation,
    pro: item.professionalExplanation,
    business: item.commercialExplanation,
  }}
/>

{/* عرض المستندات */}
{item.documents && item.documents.length > 0 && (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-white">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <DocumentTextIcon className="h-5 w-5 text-blue-600" />
        {locale === 'ar' ? 'المستندات المتاحة' : 'Available Documents'}
      </h3>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {item.documents.map((doc) => (
          <div
            key={doc.id}
            className="group relative bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all cursor-pointer"
            onClick={() => {
              setSelectedDocument(doc.id);
              if (doc.url && doc.mimetype.includes('pdf')) {
                window.open(doc.url, '_blank');
              }
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">
                    {doc.title || doc.filename || (locale === 'ar' ? 'مستند' : 'Document')}
                  </div>
                  {doc.size && (
                    <div className="text-xs text-gray-500">
                      {Math.round(doc.size / 1024)} KB
                    </div>
                  )}
                  {doc.createdAt && (
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(doc.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-IQ' : 'en-US')}
                    </div>
                  )}
                </div>
              </div>
              {doc.url && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const type = doc.mimetype.includes('pdf') ? 'pdf' : 'word';
                    handleDownload(doc.url!, doc.filename || 'document', type);
                  }}
                  className="p-2 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  title={locale === 'ar' ? 'تحميل' : 'Download'}
                >
                  <ArrowDownTrayIcon className="h-5 w-5 text-gray-600" />
                </button>
              )}
            </div>
            <div className="mt-3 text-xs text-gray-500">
              {doc.mimetype.includes('pdf') ? 'PDF' : 'Word'}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

{/* عارض PDF */}
{validPdfUrl && (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-100 rounded-lg">
          <DocumentTextIcon className="h-5 w-5 text-red-600" />
        </div>
        <h3 className="font-semibold text-gray-900">{locale === 'ar' ? 'عرض المستند' : 'Document Viewer'}</h3>
      </div>
      <button
        onClick={() => handleDownload(validPdfUrl, `${item.titleAr}.pdf`, 'pdf')}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
      >
        <CloudArrowDownIcon className="h-4 w-4" />
        {locale === 'ar' ? 'تحميل PDF' : 'Download PDF'}
      </button>
    </div>
    <div className="relative bg-gray-100" style={{ height: '600px' }}>
      <iframe
        src={`${validPdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
        className="w-full h-full"
        title={item.titleAr}
        onError={() => setPdfError(true)}
      />
      {pdfError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{locale === 'ar' ? 'تعذر عرض PDF' : 'Unable to display PDF'}</p>
            <button
              onClick={() => handleDownload(validPdfUrl, `${item.titleAr}.pdf`, 'pdf')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {locale === 'ar' ? 'تحميل الملف' : 'Download file'}
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
)}

            {/* بطاقة التقييم */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-amber-600 rounded-full"></span>
                {locale === 'ar' ? 'التقييم' : 'Rating'}
              </h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => rateItem(star)}
                    className="focus:outline-none hover:scale-110 transition-transform"
                    disabled={!isAuthenticated}
                  >
                    {star <= (userRating || item.rating || 0) ? (
                      <StarSolid className="h-8 w-8 text-amber-400 drop-shadow-md" />
                    ) : (
                      <StarOutline className="h-8 w-8 text-gray-300 hover:text-amber-200" />
                    )}
                  </button>
                ))}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {(item.rating || 0).toFixed(1)}
                </div>
                <div className="text-sm text-gray-500">
                  {item.totalRatings || 0} {locale === 'ar' ? 'تقييم' : 'ratings'}
                </div>
                {userRating && (
                  <div className="mt-2 text-xs text-green-600 bg-green-50 py-1 px-2 rounded-full inline-block">
                    {locale === 'ar' ? `تقييمك: ${userRating} نجوم` : `Your rating: ${userRating} stars`}
                  </div>
                )}
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="space-y-3">
                <button
                  onClick={toggleFavorite}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all transform hover:scale-[1.02]
                    ${isFavorited 
                      ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 border border-red-200 shadow-sm' 
                      : 'bg-gradient-to-r from-gray-50 to-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  {isFavorited ? <HeartSolid className="h-5 w-5" /> : <HeartOutline className="h-5 w-5" />}
                  <span className="font-medium">
                    {isFavorited 
                      ? (locale === 'ar' ? 'إزالة من المفضلة' : 'Remove from favorites')
                      : (locale === 'ar' ? 'أضف إلى المفضلة' : 'Add to favorites')
                    }
                  </span>
                </button>

                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all transform hover:scale-[1.02]
                    ${isSaved 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 border border-blue-200 shadow-sm' 
                      : 'bg-gradient-to-r from-gray-50 to-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  {isSaved ? <BookmarkSolid className="h-5 w-5" /> : <BookmarkOutline className="h-5 w-5" />}
                  <span className="font-medium">
                    {isSaved 
                      ? (locale === 'ar' ? 'تم الحفظ' : 'Saved')
                      : (locale === 'ar' ? 'احفظ للقراءة لاحقاً' : 'Save for later')
                    }
                  </span>
                </button>

                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-50 to-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all transform hover:scale-[1.02]"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  <span className="font-medium">{locale === 'ar' ? 'أضف ملاحظة' : 'Add note'}</span>
                </button>
              </div>

              {showNotes && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder={locale === 'ar' ? 'اكتب ملاحظتك هنا...' : 'Write your note here...'}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={addNote} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      {locale === 'ar' ? 'حفظ' : 'Save'}
                    </button>
                    <button onClick={() => setShowNotes(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                      {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>
                </div>
              )}

              {notes.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">{locale === 'ar' ? 'ملاحظاتك السابقة' : 'Your previous notes'}</h4>
                  <div className="space-y-2">
                    {notes.map((note, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                        <p className="text-gray-700">{note.content}</p>
                        {note.page && (
                          <span className="text-xs text-gray-500 mt-1 block">
                            {locale === 'ar' ? `صفحة: ${note.page}` : `Page: ${note.page}`}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {canEdit && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button onClick={() => router.push(`/admin/library/${item.id}/edit`)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-600 border border-amber-200 rounded-xl hover:from-amber-100 hover:to-amber-200 transition-all">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="font-medium">{locale === 'ar' ? 'تعديل المادة' : 'Edit item'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* المواد المرتبطة */}
            {relatedItems.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-600 rounded-full"></span>
                  {locale === 'ar' ? 'مواد مرتبطة' : 'Related Items'}
                </h3>
                <div className="space-y-3">
                  {relatedItems.map((related) => (
                    <div
                      key={related.id}
                      onClick={() => router.push(`/library/view/${related.id}`)}
                      className="group p-4 bg-gradient-to-l from-gray-50 to-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <DocumentTextIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {locale === 'ar' ? related.titleAr : (related.titleEn || related.titleAr)}
                          </div>
                          {related.relationType && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                {related.relationType === 'SAME_CATEGORY' && (locale === 'ar' ? 'نفس التصنيف' : 'Same category')}
                                {related.relationType === 'AMENDS' && (locale === 'ar' ? 'يعدل' : 'Amends')}
                                {related.relationType === 'REPEALS' && (locale === 'ar' ? 'يلغي' : 'Repeals')}
                                {related.relationType === 'INTERPRETS' && (locale === 'ar' ? 'يفسر' : 'Interprets')}
                                {related.relationType === 'REFERENCES' && (locale === 'ar' ? 'يشير إلى' : 'References')}
                              </span>
                            </div>
                          )}
                        </div>
                        <ChevronLeftIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* تذييل الصفحة */}
      {item.createdBy && (
        <div className="bg-white border-t mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>
                {locale === 'ar' ? 'تمت الإضافة بواسطة:' : 'Added by:'}{' '}
                <span className="font-medium text-gray-700">{item.createdBy.name || item.createdBy.email}</span>
              </div>
              {item.createdAt && (
                <div>
                  {new Date(item.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-IQ' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}