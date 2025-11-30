 import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OfficeCard } from "./OfficeCard";
import type { Office } from "./OfficeCard";

export const dynamic = "force-dynamic";

export default async function TranslationOfficesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams; // 👈 الحل السحري

  const session = (await getServerSession(authOptions as any)) as any;
  const user = session?.user as any;

  if (!user) redirect("/login");

  const docParam = params.doc;
  const langParam = params.lang;

  const documentId =
    typeof docParam === "string"
      ? Number(docParam)
      : Array.isArray(docParam)
      ? Number(docParam[0])
      : 0;

  const targetLang: "AR" | "EN" =
    langParam === "AR" || langParam === "EN" ? (langParam as "AR" | "EN") : "EN";

  if (!documentId) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="max-w-2xl mx-auto px-4 py-10 text-right">
          <h1 className="text-2xl font-bold mb-4">طلب ترجمة رسمية</h1>
          <p className="text-sm text-zinc-300 mb-4">
            لا يوجد مستند مرتبط بهذه العملية. قم أولًا برفع الملف من صفحة الترجمة.
          </p>
          <a
            href="/translate"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 rounded-lg text-white"
          >
            العودة إلى صفحة الترجمة
          </a>
        </div>
      </main>
    );
  }

  const offices: Office[] = await prisma.user.findMany({
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
      <div className="max-w-4xl mx-auto px-4 py-10 text-right">
        <h1 className="text-2xl font-bold mb-2">مكاتب الترجمة المعتمدة</h1>
        <p className="text-sm text-zinc-300 mb-6">
          اختر أحد المكاتب لإرسال طلب ترجمة رسمية للمستند رقم {documentId}
        </p>

        <div className="space-y-4">
          {offices.map((office) => (
            <OfficeCard
              key={office.id}
              office={office}
              documentId={documentId}
              targetLang={targetLang}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
