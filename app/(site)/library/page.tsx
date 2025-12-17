 import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  LAW_CATEGORIES,
  categoryLabel,
  LawCategoryKey,
} from "@/lib/lawCategories";

type RawSearchParams = {
  q?: string | string[];
  c?: string | string[];
  page?: string | string[];
};

type PageProps = {
  searchParams: Promise<RawSearchParams>;
};

const PAGE_SIZE = 12;

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // ✅ تثبيت التشغيل على Node.js حتى يعمل Prisma على Vercel

export default async function LibraryPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const qParam =
    typeof sp.q === "string"
      ? sp.q
      : Array.isArray(sp.q)
      ? sp.q[0]
      : "";
  const cParam =
    typeof sp.c === "string"
      ? sp.c
      : Array.isArray(sp.c)
      ? sp.c[0]
      : "";
  const pageParam =
    typeof sp.page === "string"
      ? sp.page
      : Array.isArray(sp.page)
      ? sp.page[0]
      : "1";

  const q = qParam.trim();
  const c = cParam.toUpperCase();
  const page = Number(pageParam) || 1;

  const where: any = { visibility: "PUBLIC" };

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { jurisdiction: { contains: q } },
      { text: { contains: q } },
    ];
  }

  if (["LAW", "FIQH", "ACADEMIC_STUDY"].includes(c)) {
    where.category = c;
  }

  const [count, docs] = await Promise.all([
    prisma.lawDoc.count({ where }),
    prisma.lawDoc.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-right">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          المكتبة القانونية لمستشاركم الذكي
        </h1>
        <p className="text-sm text-zinc-400">
          تصفح القوانين والكتب الفقهية والدراسات الأكاديمية، وابحث داخلها
          لاستخدامها في الاستشارات والعقود والتحليل القانوني.
        </p>
      </header>

      <SearchBar q={q} c={c as LawCategoryKey | ""} />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {docs.map((doc) => (
          <Link
            key={doc.id}
            href={`/library/${doc.id}`}
            className="block rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-4 hover:border-emerald-500/70 hover:shadow-lg hover:shadow-emerald-500/10 transition"
          >
            <div className="text-[11px] text-zinc-400 mb-1 flex flex-wrap gap-2 justify-end">
                
            </div>
            <div className="text-lg font-semibold mb-2">{doc.title}</div>
             
               
           
          </Link>
        ))}

        {docs.length === 0 && (
          <p className="text-center text-zinc-400 col-span-full">
            لا توجد نتائج مطابقة للبحث الحالي.
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination current={page} total={totalPages} q={q} c={c} />
      )}
    </div>
  );
}

function SearchBar({ q, c }: { q: string; c: LawCategoryKey | "" }) {
  return (
    <form className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
      <input
        name="q"
        defaultValue={q}
        placeholder="ابحث عن قانون أو مادة أو كلمة مفتاحية…"
        className="flex-1 rounded-xl bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <select
        name="c"
        defaultValue={c || ""}
        className="w-full md:w-52 rounded-xl bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <option value="">كل التصنيفات</option>
        {LAW_CATEGORIES.map((cat) => (
          <option key={cat.key} value={cat.key}>
            {cat.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-sm font-medium"
      >
        بحث
      </button>
    </form>
  );
}

function Pagination({
  current,
  total,
  q,
  c,
}: {
  current: number;
  total: number;
  q: string;
  c: string;
}) {
  const items = [];
  for (let p = 1; p <= total; p++) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (c) params.set("c", c);
    if (p !== 1) params.set("page", String(p));

    items.push(
      <a
        key={p}
        href={`/library?${params.toString()}`}
        className={`px-3 py-1 rounded-md text-sm border ${
          p === current
            ? "bg-emerald-600 border-emerald-500"
            : "border-zinc-700 hover:bg-zinc-900"
        }`}
      >
        {p}
      </a>,
    );
  }

  return <div className="mt-6 flex gap-2 justify-center">{items}</div>;
}
