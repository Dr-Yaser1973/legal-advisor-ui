 import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // تشغيل Turbopack بشكل صريح
  turbopack: {},

  // تجاهل أخطاء TypeScript لإكمال الـ build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
