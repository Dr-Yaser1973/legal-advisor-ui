// app/robots.ts
import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://smartlegaladvisor.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",      // منع زحف لوحة التحكم
        "/api/",        // منع زحف الـ API
        "/auth/",       // منع زحف صفحات المصادقة
        "/_next/",      // منع زحف ملفات Next.js
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
