 import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // تشغيل Turbopack
  turbopack: {},

  // تجاهل أخطاء TypeScript أثناء build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Prisma on Vercel (صحيح عندك)
  outputFileTracingIncludes: {
    "/api/**/*": ["./node_modules/.prisma/client/**/*"],
    "/*": ["./node_modules/.prisma/client/**/*"],
  },

  // ✅ هذا هو المفتاح الحاسم
  experimental: {
    middlewareClientMaxBodySize: "200mb",
  },
};

export default nextConfig;
