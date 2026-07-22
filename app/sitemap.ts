 //sitemap.ts
import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";
import { listTemplates } from "@/lib/contracts/catalog";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://smartlegaladvisor.com";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // ============================================
  // 1. الصفحات الثابتة
  // ============================================
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                          priority: 1.0, changeFrequency: "daily",   lastModified: new Date() },
    { url: `${baseUrl}/library`,             priority: 0.9, changeFrequency: "daily",   lastModified: new Date() },
    {
      url: `${baseUrl}/how-to-use`,
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: new Date(),
      alternates: {
        languages: {
          ar: `${baseUrl}/how-to-use?lang=ar`,
          en: `${baseUrl}/how-to-use?lang=en`,
        },
      },
    },
    { url: `${baseUrl}/consultations`,       priority: 0.9, changeFrequency: "daily",   lastModified: new Date() },
    { url: `${baseUrl}/contracts`,           priority: 0.8, changeFrequency: "weekly",  lastModified: new Date() },
    { url: `${baseUrl}/translate`,         priority: 0.8, changeFrequency: "weekly",  lastModified: new Date() },
    { url: `${baseUrl}/translation-offices`, priority: 0.8, changeFrequency: "daily",   lastModified: new Date() },
    { url: `${baseUrl}/smart-lawyer`,        priority: 0.8, changeFrequency: "weekly",  lastModified: new Date() },
    { url: `${baseUrl}/lawyers`,             priority: 0.8, changeFrequency: "daily",   lastModified: new Date() },
    { url: `${baseUrl}/blog`,                priority: 0.8, changeFrequency: "daily",   lastModified: new Date() },
    { url: `${baseUrl}/pricing`,             priority: 0.7, changeFrequency: "weekly",  lastModified: new Date() },
    { url: `${baseUrl}/about`,               priority: 0.6, changeFrequency: "monthly", lastModified: new Date() },
    { url: `${baseUrl}/privacy`,             priority: 0.4, changeFrequency: "monthly", lastModified: new Date() },
    { url: `${baseUrl}/terms`,               priority: 0.4, changeFrequency: "monthly", lastModified: new Date() },
  ];

  // ============================================
  // 2. مواد المكتبة الديناميكية
  // ============================================
  const items = await prisma.libraryItem.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const libraryPages: MetadataRoute.Sitemap = items.map((item) => ({
    url: `${baseUrl}/library/view/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
    alternates: {
      languages: {
        ar: `${baseUrl}/library/view/${item.slug}?lang=ar`,
        en: `${baseUrl}/library/view/${item.slug}?lang=en`,
      },
    },
  }));

  // ============================================
  // 3. صفحات المحامين
  // ============================================
  const lawyers = await prisma.user.findMany({
    where: { role: "LAWYER", isApproved: true },
    select: { id: true, updatedAt: true },
  });

  const lawyerPages: MetadataRoute.Sitemap = lawyers.map((lawyer) => ({
    url: `${baseUrl}/lawyers/${lawyer.id}`,
    lastModified: lawyer.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // ============================================
  // 4. صفحات مكاتب الترجمة المعتمدة
  // ============================================
  const translationOffices = await prisma.user.findMany({
    where: { role: "TRANSLATION_OFFICE", isApproved: true },
    select: { id: true, updatedAt: true },
  });

  const translationOfficePages: MetadataRoute.Sitemap = translationOffices.map((office) => ({
    url: `${baseUrl}/translation-offices/${office.id}`,
    lastModified: office.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // ============================================
  // 5. مقالات المدونة المنشورة
  // ============================================
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
  });

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // ============================================
  // 6. نماذج العقود (كتالوج ثابت)
  // ============================================
  const contractPages: MetadataRoute.Sitemap = listTemplates().map((t) => ({
    url: `${baseUrl}/contracts/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...libraryPages,
    ...lawyerPages,
    ...translationOfficePages,
    ...blogPages,
    ...contractPages,
  ];
}