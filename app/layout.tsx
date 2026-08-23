 // app/layout.tsx
 import Providers from "./providers";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import { getLocale } from "@/lib/i18n/server";
import { dirFor } from "@/lib/i18n/config";
import HtmlLangSync from "@/components/i18n/HtmlLangSync";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import VisitTracker from "@/components/VisitTracker";
import "./globals.css";

const SITE_URL = "https://smartlegaladvisor.com";

// روابط اللغة: العربية على المسار النظيف، والإنجليزية على ?lang=en
// (تجنّب إنشاء "/" و "/?lang=ar" كنسختين من نفس الصفحة)
const HREFLANG = {
  ar: "/",
  en: "/?lang=en",
  "x-default": "/",
} as const;

const META = {
  ar: {
    title: "منصة المستشار القانوني الذكي | بوابة رقمية للخدمات القانونية",
    template: "%s | المستشار القانوني الذكي",
    description:
      "بوابة قانونية رقمية ثنائية اللغة تقدم مكتبة قانونية ذكية، توليد عقود PDF، ترجمة قانونية، واستشارات مهنية للمستخدمين والمحامين والشركات.",
    canonical: "/",
  },
  en: {
    title: "Smart Legal Advisor Platform | Digital Legal Services Portal",
    template: "%s | Smart Legal Advisor",
    description:
      "A bilingual digital legal portal offering a smart legal library, PDF contract generation, legal translation, and professional consultations for individuals, lawyers, and companies.",
    canonical: "/?lang=en",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const m = META[locale];

  return {
  metadataBase: new URL(SITE_URL),

  title: {
    default: m.title,
    template: m.template,
  },

  description: m.description,

  keywords: [
    "مكتبة قانونية",
    "عقود قانونية",
    "ترجمة قانونية",
    "استشارات قانونية",
    "محامي",
    "منصة قانونية",
    "Legal Library",
    "Legal Contracts",
    "Legal Translation",
    "Legal Consultations",
  ],

  applicationName: "المستشار القانوني الذكي",
  category: "legal services",

  alternates: {
    canonical: m.canonical,
    languages: HREFLANG,
  },


  icons: {
    icon: "/favicon-32.png",
    apple: "/icons/icon-192x192.png",
  },

  verification: {
    google: "yikvI_aIDpTIfA-B5ZfTIyPSBP6ljVOrWOecx-YbjWA",
  },

  openGraph: {
    type: "website",
    url: locale === "ar" ? SITE_URL : `${SITE_URL}/?lang=en`,
    locale: locale === "ar" ? "ar_AR" : "en_US",
    alternateLocale: locale === "ar" ? "en_US" : "ar_AR",
    title: m.title,
    description: m.description,
    siteName: locale === "ar" ? "المستشار القانوني الذكي" : "Smart Legal Advisor",
    images: [
      {
        url: "/icons/og-cover.png",
        width: 1200,
        height: 630,
        alt: "Smart Legal Advisor Platform — Digital Legal Services Portal",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: m.title,
    description: m.description,
    images: ["/icons/og-cover.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dir = dirFor(locale);

  return (
    <html lang={locale} dir={dir} className="dark">
      <head>
        {/*
          hreflang تُولَّد تلقائياً من alternates.languages في generateMetadata.
          الوسوم اليدوية هنا كانت تُنتج نسخة مكرّرة من نفس الروابط، فحُذفت.
        */}

        {/* PWA / Mobile */}
        <meta name="theme-color" content="#0b1220" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-title"
          content="المستشار القانوني الذكي"
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Smart Legal Advisor Platform",
              url: SITE_URL,
              inLanguage: ["ar", "en"],
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/library?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>

         <body className="font-sans antialiased bg-[#0b1220] text-gray-200">
        {/* ✅ التحديث التلقائي عند deploy جديد */}
        <ServiceWorkerUpdater />
        {/* يصحّح <html lang dir> بعد التنقّل الناعم — الـ layout لا يُعاد تصييره حينها */}
        <Suspense fallback={null}>
          <HtmlLangSync />
        </Suspense>
        {/* تتبّع مصادر الزوّار (First-party) + تحليلات Vercel */}
        <Suspense fallback={null}>
          <VisitTracker />
        </Suspense>
        <Analytics />
        {/*
          يمرّر لغة الخادم لكل شجرة العميل كبذرة أولية لـ useLocale،
          فيختفي وميض اللغة العربية على الجلسات الإنجليزية بلا ?lang.
        */}
        <LocaleProvider initialLocale={locale}>
          <Providers>{children}</Providers>
        </LocaleProvider>
      </body>
    </html>
  );
}

// ✅ مكوّن منفصل للتحديث التلقائي
function ServiceWorkerUpdater() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', function() {
              window.location.reload();
            });
          }
        `,
      }}
    />
  );
}