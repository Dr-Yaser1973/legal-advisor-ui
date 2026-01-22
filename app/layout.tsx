 // app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://legal-advisor.ui-vercel.app"; // غيّر إلى دومينك الحقيقي

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "منصة المستشار القانوني الذكي | بوابة رقمية للخدمات القانونية",
    template: "%s | المستشار القانوني الذكي",
  },

  description:
    "بوابة قانونية رقمية ثنائية اللغة تقدم مكتبة قانونية ذكية، توليد عقود PDF، ترجمة قانونية، واستشارات مهنية للمستخدمين والمحامين والشركات.",

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

  alternates: {
    canonical: "/",
    languages: {
      ar: "/?lang=ar",
      en: "/?lang=en",
    },
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Smart Legal Advisor Platform",
    description:
      "Digital legal services portal offering a smart legal library, contract generation, legal translation, and professional consultations.",
    siteName: "المستشار القانوني الذكي",
    images: [
      {
        url: "/brand/og-cover.png",
        width: 1200,
        height: 630,
        alt: "Smart Legal Advisor Platform — Digital Legal Services Portal",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "المستشار القانوني الذكي",
    description:
      "بوابة رقمية للخدمات القانونية: مكتبة ذكية، عقود PDF، ترجمة قانونية، واستشارات مهنية.",
    images: ["/brand/og-cover.png"],
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

  icons: {
    icon: "/favicon.ico",
    apple: "/brand/icon.png",
  },

  applicationName: "المستشار القانوني الذكي",
  category: "legal services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        {/* Hreflang */}
        <link rel="alternate" hrefLang="ar" href={`${SITE_URL}/?lang=ar`} />
        <link rel="alternate" hrefLang="en" href={`${SITE_URL}/?lang=en`} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />

        {/* PWA / Mobile */}
        <meta name="theme-color" content="#0b1220" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="المستشار القانوني الذكي" />

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
        {children}
      </body>
    </html>
  );
}
