 import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  turbopack: {},

  

  outputFileTracingIncludes: {
    "/api/**/*": ["./node_modules/.prisma/client/**/*"],
    "/*": ["./node_modules/.prisma/client/**/*"],
  },

  experimental: {
    middlewareClientMaxBodySize: "200mb",
  },
};

// PWA يلفّ nextConfig
const configWithPWA = withPWA({
  dest: "public",
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);

// Sentry يلفّ النتيجة (الطبقة الخارجية)
 export default withSentryConfig(configWithPWA, {
  org: "smartlegal",      // ضع slug مؤسستك
  project: "smartlegal-web",   // ضع اسم مشروع الويب

  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,

  // يحذف ملفات .map من bundle بعد رفعها إلى Sentry
  // (المستخدم لا يراها، وحجم النشر أصغر)
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});