 // app/(site)/translation-offices/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export const dynamic = "force-dynamic";

export default async function TranslationOfficesListPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  const user = session?.user as any;

  const offices = await prisma.user.findMany({
    where: {
      role: "TRANSLATION_OFFICE",
      isApproved: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      location: true,
    },
    orderBy: { id: "asc" },
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 text-right space-y-6">
        
        {/* العنوان + زر الإضافة */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">مكاتب الترجمة المعتمدة</h1>
            <p className="text-sm text-zinc-300 mt-1">
              استعرض مكاتب الترجمة المعتمدة واختر المكتب المناسب لك.
            </p>
          </div>

          {/* 🔑 زر إضافة مكتب ترجمة – أدمن فقط */}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin/translation-offices/new"
              className="shrink-0 inline-flex items-center px-4 py-2
                         rounded-lg bg-indigo-600 hover:bg-indigo-500
                         text-sm font-medium"
            >
              + إضافة مكتب ترجمة
            </Link>
          )}
        </div>

        {/* قائمة المكاتب */}
        {offices.length === 0 ? (
          <p className="text-sm text-zinc-400">
            لا توجد مكاتب ترجمة معتمدة حالياً.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offices.map((office) => (
              <Link
                key={office.id}
                href={`/translation-offices/${office.id}`}
                className="group block rounded-2xl border border-white/10
                           bg-zinc-900/40 p-5 transition
                           hover:bg-zinc-900/70 hover:border-emerald-500/40"
              >
                <div className="text-lg font-semibold mb-1">
                  {office.name || `مكتب ترجمة #${office.id}`}
                </div>

                {office.email && (
                  <div className="text-xs text-zinc-400 mb-2">
                    ✉️ {office.email}
                  </div>
                )}

                {office.location && (
                  <div className="text-xs text-zinc-400">
                    📍 {office.location}
                  </div>
                )}

                {office.phone && (
                  <div className="text-xs text-zinc-400">
                    📞 {office.phone}
                  </div>
                )}

                <div className="mt-3 text-sm text-emerald-400 group-hover:underline">
                  عرض تفاصيل المكتب →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
