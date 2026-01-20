 // app/admin/library/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { categoryLabel } from "@/lib/lawCategories";
import Link from "next/link";

import NewLawDocForm from "./NewLawDocForm";
import DeleteDocButton from "./DeleteDocButton";
import ReindexButton from "./ReindexButton";
import UploadPdfCard from "./UploadPdfCard";

// مهم جداً عشان Prisma يشتغل على Vercel
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminLibraryPage() {
  const session: any = await getServerSession(authOptions as any);
  const role = session?.user?.role ?? "LAWYER";

  // هذه الصفحة للأدمن فقط
  if (!session || role !== "ADMIN") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-right">
        <h1 className="text-2xl font-bold mb-4">إدارة المكتبة القانونية</h1>
        <p className="text-sm text-red-400">
          هذه الصفحة متاحة لمدير النظام (ADMIN) فقط.
        </p>
      </div>
    );
  }

  /**
   * ✅ النظام الجديد
   * نعرض المواد القانونية (LawUnit) بدل LawDoc القديم
   */
  const units = await prisma.lawUnit.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      title: true,
      category: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-right">
      <h1 className="text-3xl font-bold mb-6">
        إدارة المكتبة القانونية (النظام الجديد)
      </h1>

      {/* 🔵 رفع ملفات PDF وربطها بالمواد */}
      <div className="mb-8">
        <UploadPdfCard />
      </div>

      {/* 🟢 إضافة مادة قانونية جديدة */}
      <NewLawDocForm />

      <h2 className="mt-10 mb-4 text-xl font-semibold">
        أحدث المواد القانونية
      </h2>

      <div className="space-y-3">
        {units.map((unit) => (
          <div
            key={unit.id}
            className="flex items-center justify-between gap-3 border border-zinc-800 rounded-2xl bg-zinc-900/70 p-3"
          >
            <div className="flex-1">
              <div className="text-xs text-zinc-400 mb-1 flex flex-wrap gap-2 justify-end">
                <span>{categoryLabel(unit.category)}</span>
                <span>· {unit.status}</span>
                <span>
                  ·{" "}
                  {new Date(unit.createdAt).toLocaleDateString("ar-IQ")}
                </span>
              </div>

              <Link
                href={`/library/${unit.id}`}
                className="font-medium hover:underline"
              >
                {unit.title}
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {/* زر إعادة فهرسة المادة */}
              <ReindexButton docId={unit.id} />

              {/* زر الحذف / الأرشفة */}
              <DeleteDocButton id={unit.id} />
            </div>
          </div>
        ))}

        {units.length === 0 && (
          <p className="text-sm text-zinc-400">
            لا توجد مواد قانونية بعد.
          </p>
        )}
      </div>
    </div>
  );
}
