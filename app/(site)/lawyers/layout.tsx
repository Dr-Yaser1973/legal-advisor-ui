import { Metadata } from "next";

export const metadata: Metadata = {
  title: "المحامون | Lawyers Directory",
  description: "تصفح قائمة المحامين العراقيين المعتمدين على المنصة. Browse certified Iraqi lawyers on the platform.",
  alternates: { canonical: "/lawyers" },
  openGraph: {
    title: "دليل المحامين العراقيين",
    description: "تواصل مع أفضل المحامين العراقيين المتخصصين.",
    url: "https://smartlegaladvisor.com/lawyers",
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}