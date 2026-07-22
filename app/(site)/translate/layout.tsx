import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ترجمة قانونية معتمدة | Certified Legal Translation",
  description: "ترجمة قانونية معتمدة ومصدّقة من مكاتب ترجمة متخصصة — للمحاكم والسفارات والدوائر الرسمية والجامعات، أو ترجمة ذكية فورية بالذكاء الاصطناعي. Certified legal translation by accredited offices.",
  keywords: [
    "ترجمة قانونية معتمدة",
    "ترجمة قانونية",
    "مكتب ترجمة قانونية",
    "ترجمة قانونية مصدقة",
    "ترجمة قانونية معتمدة عربي انجليزي",
    "certified legal translation",
  ],
  alternates: { canonical: "/translation" },
  openGraph: {
    title: "ترجمة قانونية معتمدة",
    description: "ترجمة رسمية مصدّقة للمستندات القانونية من مكاتب معتمدة، معترف بها أمام الجهات الرسمية.",
    url: "https://smartlegaladvisor.com/translation",
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
