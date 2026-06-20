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
  register: true,
  disable: process.env.NODE_ENV === "development",

  workboxOptions: {
    // التفعيل الفوري للـ SW الجديد محل القديم
    skipWaiting: true,
    clientsClaim: true,

    // استثناء المصادقة من التنقّل المخزّن
    navigateFallbackDenylist: [
      /^\/api\/auth/,
      /^\/login/,
      /^\/api\//,
    ],

    // لا تخزين إطلاقاً لنطاقات OAuth الخارجية
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/(accounts\.google\.com|oauth2\.googleapis\.com)/,
        handler: "NetworkOnly",
      },
    ],
  },
})(nextConfig);
// Sentry يلفّ النتيجة (الطبقة الخارجية)
export default withSentryConfig(configWithPWA, {
  org: "smartlegal",
  project: "smartlegal-web",

  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,

  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});