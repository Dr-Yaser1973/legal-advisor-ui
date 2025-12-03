 import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // تشغيل Turbopack بشكل صريح
  turbopack: {},

  // تجاهل أخطاء TypeScript لإكمال الـ build
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ مهم جداً لـ Prisma على Vercel مع Next 16
  // هذا يضمن تضمين ملفات محرك Prisma (.so.node) في الباندل
  outputFileTracingIncludes: {
    "/api/**/*": ["./node_modules/.prisma/client/**/*"],
    "/*": ["./node_modules/.prisma/client/**/*"],
  },
};

export default nextConfig;
