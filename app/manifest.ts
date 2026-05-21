 import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "المستشار القانوني الذكي",
    short_name: "المستشار",
    description: "بوابة رقمية للخدمات القانونية",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1220",
    theme_color: "#0b1220",
    lang: "ar",
    dir: "rtl",
    icons: [
      {
        src: "/icons/icon-192x192.png", // ← صحّحنا الاسم
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png", // ← صحّحنا الاسم
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}