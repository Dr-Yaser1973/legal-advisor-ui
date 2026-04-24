 // app/sitemap.ts
import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

// الرابط الأساسي للموقع
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://smartlegaladvisor.com";
// في أعلى ملف app/sitemap.ts
export const dynamic = "force-dynamic";
export const revalidate = 3600; // إعادة إنشاء كل ساعة

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ============================================
  // 1. الصفحات الثابتة (Static Pages)
  // ============================================
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/library`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/library/list`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/library/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/library/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // ============================================
  // 2. المواد القانونية (Dynamic Pages)
  // ============================================
  // جلب جميع المواد المنشورة
  const items = await prisma.libraryItem.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      slug: true,
      updatedAt: true,
      createdAt: true,
      mainCategory: true,
      itemType: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  // صفحات المواد (باستخدام slug أو id)
  const libraryItemsPages: MetadataRoute.Sitemap = items.map((item) => ({
    url: `${baseUrl}/library/view/${item.slug || item.id}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // ============================================
  // 3. صفحات الأقسام (Categories)
  // ============================================
  const categories = ["LAW", "FIQH", "ACADEMIC", "CONTRACT"];
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/library/list?category=${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // ============================================
  // 4. إضافة إصدارات اللغة (hreflang ضمن sitemap)
  // ============================================
  // نضيف صفحات المواد مع اللغة
  const multilingualPages: MetadataRoute.Sitemap = items.flatMap((item) => [
    {
      url: `${baseUrl}/library/view/${item.slug || item.id}?lang=ar`,
      lastModified: item.updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          ar: `${baseUrl}/library/view/${item.slug || item.id}?lang=ar`,
          en: `${baseUrl}/library/view/${item.slug || item.id}?lang=en`,
        },
      },
    },
    {
      url: `${baseUrl}/library/view/${item.slug || item.id}?lang=en`,
      lastModified: item.updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          ar: `${baseUrl}/library/view/${item.slug || item.id}?lang=ar`,
          en: `${baseUrl}/library/view/${item.slug || item.id}?lang=en`,
        },
      },
    },
  ]);

  // ============================================
  // دمج جميع الصفحات (مع تجنب التكرار)
  // ============================================
  const allPages = [
    ...staticPages,
    ...libraryItemsPages,
    ...categoryPages,
    ...multilingualPages,
  ];

  // إزالة التكرار (حسب url)
  const uniquePages = allPages.filter(
    (page, index, self) => index === self.findIndex((p) => p.url === page.url)
  );

  return uniquePages;
}