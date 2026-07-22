 // app/(site)/contracts/[slug]/page.tsx
import { Metadata } from "next";
import { getTemplateBySlug } from "@/lib/contracts/catalog";
import ContractForm from "../_components/ContractForm";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tpl = getTemplateBySlug(slug);

  if (!tpl) {
    return { title: "قالب غير موجود | العقود", robots: { index: false, follow: false } };
  }

  const url = `https://smartlegaladvisor.com/contracts/${slug}`;
  const langLabel = tpl.lang === "ar" ? "عربي" : "إنجليزي";
  const description = `نموذج «${tpl.title}» احترافي جاهز للتعبئة والمعاينة الفورية وتنزيل PDF، مصاغ وفق القانون العراقي. ${langLabel}.`;

  return {
    title: `${tpl.title} — نموذج عقد جاهز (${tpl.lang.toUpperCase()}) | صياغة عقود`,
    description,
    keywords: [tpl.title, "نموذج عقد", "صياغة عقد", "عقد جاهز", tpl.group],
    alternates: { canonical: url },
    openGraph: {
      title: `${tpl.title} — نموذج عقد جاهز`,
      description,
      url,
      type: "article",
    },
  };
}

export default async function ContractSlugPage({ params }: PageProps) {
  const { slug } = await params;   // ✅ الحل هنا

  const tpl = getTemplateBySlug(slug);
  if (!tpl) return <div className="p-6">Template not found</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{tpl.title}</h1>
      <div className="text-sm text-zinc-400 mb-6">
        {tpl.group} • {tpl.lang.toUpperCase()}
      </div>
      <ContractForm templateSlug={tpl.slug} />
    </div>
  );
}
