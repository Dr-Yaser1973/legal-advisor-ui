 // app/(site)/translation-offices/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ResendInviteButton from "./_components/ResendInviteButton";
import OfficesList from "./_components/OfficesList";

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
      image: true,
    },
    orderBy: { id: "asc" },
  });

  return (
    <main className="min-h-screen bg-[#0a0a12] text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 text-right space-y-8">
        {/* الترويسة */}
        <div className="relative overflow-hidden rounded-3xl border border-purple-500/25 bg-gradient-to-bl from-[#1e1133] via-[#15101f] to-[#120e1a] p-8">
          <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute -right-8 -bottom-12 h-36 w-36 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/35 bg-amber-400/10 px-3 py-1 text-xs text-amber-300 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                خدمة الترجمة القانونية المعتمدة
              </div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-l from-white to-purple-200 bg-clip-text text-transparent">
                مكاتب الترجمة المعتمدة
              </h1>
              <p className="text-sm text-purple-200/90 mt-2 max-w-xl leading-relaxed">
                استعرض مكاتب الترجمة القانونية المعتمدة على المنصة، واختر المكتب
                الأنسب لك لتقديم طلب ترجمة موثّق.
              </p>
            </div>

            {/* أزرار الأدمن */}
            {user?.role === "ADMIN" && (
              <div className="shrink-0 inline-flex items-center gap-2">
                <Link
                  href="/admin/translation-offices/new"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-br from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-sm font-medium transition"
                >
                  + إضافة مكتب ترجمة
                </Link>
                <ResendInviteButton />
              </div>
            )}
          </div>
        </div>

        {/* قائمة المكاتب (بحث + عرض) */}
        <OfficesList offices={offices} />
      </div>
    </main>
  );
}