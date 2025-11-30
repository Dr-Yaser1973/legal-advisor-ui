 // app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "المستشار القانوني",
  description: "منصة عربية ذكية لتوليد العقود وإدارة العمل القانوني",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="font-sans antialiased bg-[#0b1220] text-gray-200">
        {children}
      </body>
    </html>
  );
}
