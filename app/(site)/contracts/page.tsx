 // app/(site)/contracts/page.tsx
import Link from "next/link";
import { listTemplates } from "@/lib/contracts/catalog";

export default async function ContractsHomePage() {
  const templates = listTemplates();

  const pro = templates.filter((t) => t.group === "PRO");
  const inco = templates.filter((t) => t.group === "INCOTERMS");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">العقود</h1>
        <Link className="text-sm underline" href="/contracts/history">سجل العقود</Link>
      </div>

      <h2 className="mb-3 text-lg font-semibold">PRO (عقود احترافية)</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {pro.map((t) => (
          <Link key={t.slug} href={`/contracts/${t.slug}`} className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 hover:bg-zinc-800">
            <div className="text-sm text-zinc-400">{t.lang.toUpperCase()}</div>
            <div className="font-semibold">{t.title}</div>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 mb-3 text-lg font-semibold">INCOTERMS (11)</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {inco.map((t) => (
          <Link key={t.slug} href={`/contracts/${t.slug}`} className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 hover:bg-zinc-800">
            <div className="text-sm text-zinc-400">{t.lang.toUpperCase()}</div>
            <div className="font-semibold">{t.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
