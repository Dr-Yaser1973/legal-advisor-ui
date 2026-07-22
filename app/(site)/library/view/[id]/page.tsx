 //app/(site)/library/view/[id]/page.tsx
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Metadata } from "next";
import LibraryItemViewClient from "./view.client";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getLibraryItemView } from "@/lib/library-item";

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

// فك ترميز المعرّف بأمان (الروابط العربية تصل مُرمّزة %D9%82...)
function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}


// جلب المادة مباشرة من قاعدة البيانات لـ generateMetadata
async function getLibraryItemByIdentifier(identifier: string) {
  // فك الترميز أولًا حتى يطابق slug العربي المخزّن في القاعدة
  const decoded = safeDecode(identifier);

  // يمكن البحث إما بالـ id أو بالـ slug
  const item = await prisma.libraryItem.findFirst({
    where: {
      OR: [
        { id: decoded },
        { slug: decoded }
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
  CONTRACT: { ar: "قرار دستوري", en: "Constitutional Ruling" }
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
  // canonical موحّد دائمًا على الـ slug — يطابق ما يولّده sitemap
  const canonicalUrl = `${baseUrl}/library/view/${item.slug || item.id}`;

  return {
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

  const session = await getServerSession(authOptions as any) as any;
  const user = session?.user;
  const canEdit = user ? ["ADMIN", "LAWYER"].includes(user?.role) : false;

  // استدعاء مباشر لدالة الخادم — بلا self-fetch عبر HTTP
  const data = await getLibraryItemView(id, user?.id ? Number(user.id) : null);
  if (!data?.doc) return notFound();

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
        item={data.doc as any}
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
