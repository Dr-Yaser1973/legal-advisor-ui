 import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Metadata } from "next";
import LibraryItemViewClient from "./view.client";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// تعريف نوع المواد مع slug
type LibraryItemWithSlug = {
  id: string;
  slug: string;
  titleAr: string;
  titleEn?: string | null;
  abstractAr?: string | null;
  abstractEn?: string | null;
  mainCategory: string;
  itemType: string;
  keywords?: string[];
  views: number;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

// جلب البيانات من API
async function fetchLibraryItem(identifier: string) {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    
  const res = await fetch(`${baseUrl}/api/library/items/${identifier}`, { 
    cache: "no-store",
  });
  
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

// جلب المادة مباشرة من قاعدة البيانات لـ generateMetadata
async function getLibraryItemByIdentifier(identifier: string) {
  // يمكن البحث إما بالـ id أو بالـ slug
  const item = await prisma.libraryItem.findFirst({
    where: {
      OR: [
        { id: identifier },
        { slug: identifier }
      ],
      isPublished: true
    },
    select: {
      id: true,
      slug: true,
      titleAr: true,
      titleEn: true,
      abstractAr: true,
      abstractEn: true,
      mainCategory: true,
      itemType: true,
      keywords: true,
      views: true,
      rating: true,
      createdAt: true,
      updatedAt: true,
    }
  });
  
  return item;
}

// أسماء التصنيفات للـ SEO
const categoryNames = {
  LAW: { ar: "قانون", en: "Law" },
  FIQH: { ar: "فقه", en: "Fiqh" },
  ACADEMIC: { ar: "دراسة أكاديمية", en: "Academic Study" },
  CONTRACT: { ar: "عقد", en: "Contract" }
};

// أنواع المواد للـ SEO
const itemTypeNames = {
  CONSTITUTION: { ar: "دستور", en: "Constitution" },
  STATUTE: { ar: "قانون", en: "Statute" },
  REGULATION: { ar: "لائحة", en: "Regulation" },
  PHD_THESIS: { ar: "أطروحة دكتوراه", en: "PhD Thesis" },
  MASTER_THESIS: { ar: "رسالة ماجستير", en: "Master Thesis" },
  RESEARCH_PAPER: { ar: "بحث علمي", en: "Research Paper" },
  LOCAL_CONTRACT: { ar: "عقد محلي", en: "Local Contract" },
  INTERNATIONAL_CONTRACT: { ar: "عقد دولي", en: "International Contract" },
  COURT_RULING: { ar: "حكم قضائي", en: "Court Ruling" }
};

// دالة لتوليد slug من العنوان (للاستخدام في حالة عدم وجود slug)
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ============================================
// generateMetadata المحسن
// ============================================
 export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params;
  
  const item = await getLibraryItemByIdentifier(id);
  
  if (!item) {
    return {
      title: "المادة غير موجودة - المكتبة القانونية",
      robots: { index: false, follow: false },
    };
  }

  const category = categoryNames[item.mainCategory as keyof typeof categoryNames] || { ar: "", en: "" };
  const itemType = itemTypeNames[item.itemType as keyof typeof itemTypeNames] || { ar: "", en: "" };
  
  // ✅ تعريف المتغيرات بشكل صحيح
  const seoTitleAr = `${item.titleAr} - ${category.ar} | المكتبة القانونية`;
  const seoTitleEn = `${item.titleEn || item.titleAr} - ${category.en} | Legal Library`;
  
  const descriptionAr = item.abstractAr 
    ? (item.abstractAr.length > 157 
        ? item.abstractAr.slice(0, 157) + "..." 
        : item.abstractAr)
    : `تصفح ${item.titleAr} في المكتبة القانونية. ${category.ar} ${itemType.ar} مع شرح مفصل وتحليل قانوني.`;
  
  const descriptionEn = item.abstractEn 
    ? (item.abstractEn.length > 157 
        ? item.abstractEn.slice(0, 157) + "..." 
        : item.abstractEn)
    : `Browse ${item.titleAr} in the Legal Library. ${category.en} ${itemType.en} with detailed explanation and legal analysis.`;

  const keywords = [
    ...(item.keywords || []),
    item.titleAr,
    category.ar,
    itemType.ar,
    "قانون",
    "قوانين",
    "مكتبة قانونية",
    "شرح قانوني"
  ].slice(0, 10).join(", ");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://smartlegaladvisor.com";
  const canonicalUrl = `${baseUrl}/library/view/${item.slug || item.id}`;

  return {
    // ✅ استخدام المتغيرات الصحيحة
    title: seoTitleAr,
    description: descriptionAr,
    keywords,
    
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: `${canonicalUrl}?lang=ar`,
        en: `${canonicalUrl}?lang=en`,
      },
    },
    
    openGraph: {
      title: seoTitleAr,
      description: descriptionAr,
      type: "article",
      locale: "ar_IQ",
      alternateLocale: "en_US",
      siteName: "المكتبة القانونية",
      url: canonicalUrl,
      publishedTime: item.createdAt?.toISOString(),
      modifiedTime: item.updatedAt?.toISOString(),
      authors: ["المكتبة القانونية"],
      section: category.ar,
      tags: item.keywords || [],
    },
    
    twitter: {
      card: "summary_large_image",
      title: seoTitleAr,
      description: descriptionAr,
      site: "@LegalAdvisor",
    },
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    
    other: {
      "rating:views": item.views?.toString(),
      "rating:value": item.rating?.toString(),
      "rating:best": "5",
      "rating:worst": "1",
    },
  };
}

// ============================================
// الصفحة الرئيسية
// ============================================
export default async function LibraryItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  if (!id) return notFound();

  const data = await fetchLibraryItem(id);
  if (!data?.doc) return notFound();

  const session = await getServerSession(authOptions as any) as any;
  const user = session?.user;
  const canEdit = user ? ["ADMIN", "LAWYER"].includes(user?.role) : false;

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المستند...</p>
        </div>
      </div>
    }>
      <LibraryItemViewClient
        item={data.doc}
        relatedItems={data.related || []}
        stats={data.stats || { views: 0, downloads: 0, saves: 0 }}
        canEdit={canEdit}
        isAuthenticated={!!user}
        userRole={user?.role || "GUEST"}
        userId={user?.id}
        isFavorited={data.isFavorited || false}
      />
    </Suspense>
  );
}