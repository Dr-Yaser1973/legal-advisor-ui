import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الاستشارات القانونية | Legal Consultations",
  description: "احصل على استشارة قانونية ذكية فورية أو تواصل مع محامٍ متخصص. Get instant AI legal advice or connect with a specialist lawyer.",
  alternates: { canonical: "/consultations" },
  openGraph: {
    title: "استشارات قانونية ذكية",
    description: "استشارات قانونية فورية بالذكاء الاصطناعي أو مع محامين متخصصين.",
    url: "https://smartlegaladvisor.com/consultations",
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
