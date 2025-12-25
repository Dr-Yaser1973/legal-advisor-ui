 // app/(site)/contracts/[slug]/page.tsx
import { getTemplateBySlug } from "@/lib/contracts/catalog";
import ContractForm from "../_components/ContractForm";

type PageProps = {
  params: Promise<{ slug: string }>;
};

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
