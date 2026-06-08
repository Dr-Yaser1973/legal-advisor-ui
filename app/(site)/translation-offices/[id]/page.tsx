 // app/(site)/translation-offices/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

function initials(name: string | null, id: number) {
  if (!name) return `#${id}`;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return `#${id}`;
  if (parts.length === 1) return parts[0].slice(0, 2);
  return parts[0][0] + parts[1][0];
}

export default async function TranslationOfficeDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;
  const officeId = Number(id);
  if (Number.isNaN(officeId)) notFound();

  const office = await prisma.user.findFirst({
    where: {
      id: officeId,
      role: "TRANSLATION_OFFICE",
      isApproved: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      location: true,
      image: true,
      createdAt: true,
    },
  });

  if (!office) notFound();

  const joined = new Intl.DateTimeFormat("ar", {
    year: "numeric",
    month: "long",
  }).format(office.createdAt);

  return (
    <main className="min-h-screen bg-[#0a0a12] text-white">
      <div className="max-w-4xl mx-auto px-4 py-10 text-right space-y-6">
        {/* رجوع */}
        <Link
          href="/translation-offices"
          className="inline-flex items-center gap-1 text-sm text-purple-300 transition hover:text-white"
        >
          <span>→</span>
          الرجوع إلى قائمة مكاتب الترجمة
        </Link>

        {/* بطاقة التفاصيل */}
        <div className="overflow-hidden rounded-3xl border border-purple-500/25 bg-[#1e1133]/35">
          {/* ترويسة gradient */}
          <div className="relative overflow-hidden bg-gradient-to-bl from-[#1e1133] via-[#15101f] to-[#120e1a] p-8">
            <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="absolute -right-6 -bottom-10 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl" />
            <div className="relative flex items-center gap-5">
              {office.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={office.image}
                  alt={office.name || "مكتب ترجمة"}
                  className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-2 ring-amber-400/40"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 text-2xl font-bold text-white ring-2 ring-amber-400/40">
                  {initials(office.name, office.id)}
                </div>
              )}
              <div className="min-w-0">
                <h1 className="text-2xl font-bold">
                  {office.name || `مكتب ترجمة #${office.id}`}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-3 py-1 text-xs text-amber-300">
                    ✓ مكتب ترجمة قانونية معتمد
                  </span>
                  <span className="text-xs text-purple-200/80">
                    عضو منذ {joined}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* معلومات التواصل */}
          <div className="p-6 sm:p-8 space-y-5">
            <h2 className="text-sm font-semibold text-purple-100">
              معلومات التواصل
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {office.location && (
                <InfoRow icon="📍" label="العنوان" value={office.location} />
              )}
              {office.phone && (
                <InfoRow icon="📞" label="رقم الهاتف" value={office.phone} ltr />
              )}
              {office.email && (
                <InfoRow
                  icon="✉️"
                  label="البريد الإلكتروني"
                  value={office.email}
                  ltr
                />
              )}
            </div>

            {/* زر طلب ترجمة */}
            <div className="pt-4 border-t border-purple-500/15">
              <Link
                href={`/translate?officeId=${office.id}`}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-amber-700 to-amber-500 px-5 py-2.5 text-sm font-medium text-amber-950 transition hover:from-amber-600 hover:to-amber-400"
              >
                طلب ترجمة من هذا المكتب
                <span>←</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoRow({
  icon,
  label,
  value,
  ltr = false,
}: {
  icon: string;
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="rounded-xl border border-purple-500/15 bg-[#1e1133]/40 p-4">
      <div className="mb-1 text-xs text-purple-300">
        {icon} {label}
      </div>
      <div className="text-sm text-white" dir={ltr ? "ltr" : "rtl"}>
        {value}
      </div>
    </div>
  );
}