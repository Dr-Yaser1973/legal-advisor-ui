// app/robots.ts
 import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://smartlegaladvisor.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/auth/",
          "/_next/",
          "/login",
          "/register",
          "/dashboard/",
          "/cases/",
          "/client/",
          "/company/",
          "/lawyer/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}