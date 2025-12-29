 import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

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
      createdAt: true,
    },
  });

  if (!office) notFound();

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-10 text-right space-y-6">

        {/* رجوع */}
        <Link
          href="/translation-offices"
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← الرجوع إلى قائمة مكاتب الترجمة
        </Link>

        {/* بطاقة تفاصيل المكتب */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-5">
          <div>
            <h1 className="text-2xl font-bold">
              {office.name || `مكتب ترجمة #${office.id}`}
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              مكتب ترجمة قانونية معتمد
            </p>
          </div>

          {/* المعلومات */}
          <div className="grid gap-3 text-sm">
            {office.location && (
              <div>
                <span className="text-zinc-400">العنوان:</span>{" "}
                <span className="text-white">{office.location}</span>
              </div>
            )}

            {office.phone && (
              <div>
                <span className="text-zinc-400">رقم الهاتف:</span>{" "}
                <span className="text-white">{office.phone}</span>
              </div>
            )}

            {office.email && (
              <div>
                <span className="text-zinc-400">البريد الإلكتروني:</span>{" "}
                <span className="text-white">{office.email}</span>
              </div>
            )}
          </div>

          {/* زر طلب ترجمة */}
          <div className="pt-4">
            <Link
              href={`/translate/`}
              className="inline-flex items-center px-4 py-2 rounded-lg
                         bg-emerald-600 hover:bg-emerald-500 text-sm"
            >
              طلب ترجمة من هذا المكتب
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
