import Link from "next/link";

<section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  <Link
    href="/library"
    className="rounded-xl border border-white/10 bg-zinc-900/40 p-5 hover:bg-zinc-900/60 transition"
  >
    <div className="text-lg font-medium mb-1">مكتبة</div>
    <div className="text-sm text-zinc-400">
      أسئلة وأجوبة قانونية جاهزة مع مصادرها
    </div>
  </Link>

  <Link
    href="/translate"
    className="rounded-xl border border-white/10 bg-zinc-900/40 p-5 hover:bg-zinc-900/60 transition"
  >
    <div className="text-lg font-medium mb-1">الترجمة القانونية</div>
    <div className="text-sm text-zinc-400">
      ترجمة النصوص والعقود والمذكرات القانونية بين العربية والإنجليزية.
    </div>
  </Link>
</section>
