 // app/admin/library/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { Suspense } from "react";

// استيراد المكونات الجديدة
import NewLibraryItemForm from "./NewLibraryItemForm";
 import DeleteLibraryItemButton from "@/components/admin/DeleteLibraryItemButton";
 import UploadPDFNew from "@/components/admin/UploadPDFNew";
import EditLibraryItemButton from "@/components/admin/EditLibraryItemButton";
import LibraryStats from "./LibraryStats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// دوال مساعدة للتصنيفات
// ملاحظة: أصناف Tailwind ثابتة (لا تُبنى ديناميكياً) حتى يولّدها المُجمّع
const categoryLabels = {
  LAW:      { ar: "قانون",           icon: "⚖️", iconCls: "bg-blue-500/15 text-blue-300",     badgeCls: "bg-blue-500/10 text-blue-300 border border-blue-500/20" },
  FIQH:     { ar: "فقه",             icon: "📜", iconCls: "bg-emerald-500/15 text-emerald-300", badgeCls: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" },
  ACADEMIC: { ar: "دراسة أكاديمية",  icon: "🎓", iconCls: "bg-purple-500/15 text-purple-300", badgeCls: "bg-purple-500/10 text-purple-300 border border-purple-500/20" },
  CONTRACT: { ar: "قرار دستوري",     icon: "🏛️", iconCls: "bg-amber-500/15 text-amber-300",    badgeCls: "bg-amber-500/10 text-amber-300 border border-amber-500/20" },
} as const;

const FALLBACK_CATEGORY = {
  ar: "أخرى", icon: "📁",
  iconCls: "bg-zinc-700 text-zinc-300",
  badgeCls: "bg-zinc-700/40 text-zinc-300 border border-zinc-600",
};

const itemTypeLabels = {
  CONSTITUTION: "دستور",
  STATUTE: "قانون",
  REGULATION: "لائحة",
  PHD_THESIS: "رسالة دكتوراه",
  MASTER_THESIS: "رسالة ماجستير",
  RESEARCH_PAPER: "بحث",
  LOCAL_CONTRACT: "عقد محلي",
  INTERNATIONAL_CONTRACT: "عقد دولي",
  COURT_RULING: "حكم قضائي"
};

export default async function AdminLibraryPage() {
  const session: any = await getServerSession(authOptions as any);
  const role = session?.user?.role ?? "LAWYER";

  // التحقق من الصلاحية
  if (!session || role !== "ADMIN") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-right" dir="rtl">
        <h1 className="text-2xl font-bold mb-4 text-white">إدارة المكتبة القانونية</h1>
        <p className="text-sm text-red-400">
          هذه الصفحة متاحة لمدير النظام (ADMIN) فقط.
        </p>
      </div>
    );
  }

  // جلب المواد من النظام الجديد
  const items = await prisma.libraryItem.findMany({
  orderBy: { createdAt: "desc" },
  take: 100,
  include: {
    // ✅ ربط المستندات بشكل صحيح
    itemDocuments: {
      include: {
        document: true
      }
    },
      createdBy: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  // إحصائيات سريعة
  const stats = await prisma.$transaction([
    prisma.libraryItem.count(),
    prisma.libraryItem.count({ where: { hasPDF: true } }),
    prisma.libraryItem.count({ where: { hasWord: true } }),
    prisma.libraryItem.aggregate({ _sum: { views: true } })
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-right" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">
          إدارة المكتبة القانونية (النظام الجديد)
        </h1>
        <Link
          href="/library"
          className="px-4 py-2 rounded-lg border border-white/10 text-zinc-300 hover:bg-zinc-800 transition-colors"
          target="_blank"
        >
          معاينة المكتبة ←
        </Link>
      </div>

      {/* إحصائيات سريعة */}
      <Suspense fallback={<div>جاري التحميل...</div>}>
        <LibraryStats stats={{
          total: stats[0],
          withPDF: stats[1],
          withWord: stats[2],
          views: stats[3]._sum.views || 0
        }} />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* رفع PDF */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
            <span className="text-red-400">📄</span> رفع ملف PDF جديد
          </h2>
          <UploadPDFNew />
        </div>

        {/* إضافة نص */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
            <span className="text-blue-400">📝</span> إضافة ملف وورد
          </h2>
          <NewLibraryItemForm />
        </div>
      </div>

      {/* قائمة المواد */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-zinc-900/80">
          <h2 className="text-xl font-bold text-white">
            أحدث المواد القانونية ({items.length})
          </h2>
        </div>

        <div className="divide-y divide-white/5">
          {items.map((item) => {
            const category = categoryLabels[item.mainCategory as keyof typeof categoryLabels] || FALLBACK_CATEGORY;
            const itemType = itemTypeLabels[item.itemType as keyof typeof itemTypeLabels] || item.itemType;

            return (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 hover:bg-zinc-800/40 transition-colors"
              >
                {/* أيقونة */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${category.iconCls}`}>
                  {category.icon}
                </div>

                {/* المحتوى */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full ${category.badgeCls}`}>
                      {category.ar}
                    </span>
                    <span className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded-full text-zinc-300">
                      {itemType}
                    </span>
                    {item.hasPDF && <span className="text-red-400">📄 PDF</span>}
                    {item.hasWord && <span className="text-blue-400">📝 Word</span>}
                    <span>· {new Date(item.createdAt).toLocaleDateString("ar-IQ")}</span>
                  </div>

                  <Link
                    href={`/library/view/${item.id}`}
                    className="font-medium text-zinc-100 hover:text-emerald-400 transition-colors block mb-1"
                    target="_blank"
                  >
                    {item.titleAr}
                  </Link>

                  {item.titleEn && (
                    <p className="text-sm text-zinc-500">{item.titleEn}</p>
                  )}

                  {/* إحصائيات */}
                  <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                    <span>👁️ {item.views}</span>
                    <span>⬇️ {item.downloads}</span>
                    <span>⭐ {item.rating.toFixed(1)}</span>
                    {item.createdBy && (
                      <span>👤 {item.createdBy.name || item.createdBy.email}</span>
                    )}
                  </div>

                  {/* مؤشرات الشروحات */}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {item.basicExplanation && (
                      <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        📘 شرح مبسط
                      </span>
                    )}
                    {item.professionalExplanation && (
                      <span className="text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full">
                        📚 شرح احترافي
                      </span>
                    )}
                    {item.commercialExplanation && (
                      <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-full">
                        💼 شرح تجاري
                      </span>
                    )}
                  </div>
                </div>

                {/* أزرار التحكم */}
                <div className="flex items-center gap-2">
                  <EditLibraryItemButton item={item} />
                  <DeleteLibraryItemButton
                    id={item.id}
                    title={item.titleAr}
                    hasPDF={item.hasPDF}
                    pdfUrl={item.pdfUrl}
                  />
                </div>
              </div>
            );
          })}

          {items.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              لا توجد مواد في المكتبة بعد. أضف أول مادة الآن!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}