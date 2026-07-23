// app/(site)/my-cases/page.tsx — بوابة متابعة الموكّل: قضاياه المرتبطة
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "قضاياي | متابعة القضايا",
  description: "تابع تطوّرات قضاياك والتحديثات الواردة من مكتبك القانوني.",
};

function statusColor(status: string) {
  switch (status) {
    case "مفتوحة": return "bg-emerald-500/10 text-emerald-300 border-emerald-500/40";
    case "قيد المتابعة": return "bg-amber-500/10 text-amber-300 border-amber-500/40";
    case "محجوزة للحكم": return "bg-blue-500/10 text-blue-300 border-blue-500/40";
    case "مغلقة": return "bg-zinc-500/10 text-zinc-200 border-zinc-400/40";
    default: return "bg-zinc-500/10 text-zinc-200 border-zinc-400/40";
  }
}

export default async function MyCasesPage() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;
  if (!user) redirect("/login");

  const uid = Number(user.id);

  const cases = await prisma.case.findMany({
    where: { clientId: uid },
    select: {
      id: true,
      title: true,
      type: true,
      status: true,
      court: true,
      filingDate: true,
      _count: { select: { updates: true } },
      updates: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true, title: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 text-zinc-100" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">قضاياي</h1>
          <p className="text-sm text-zinc-400 mt-1">
            تابع حالة قضاياك وآخر التحديثات الواردة من مكتبك القانوني.
          </p>
        </header>

        {cases.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-8 text-center">
            <div className="text-4xl mb-3">📁</div>
            <h2 className="font-semibold mb-1">لا توجد قضايا مرتبطة بحسابك بعد</h2>
            <p className="text-sm text-zinc-400">
              عندما يربط مكتبك القانوني قضيتك بحسابك، ستظهر هنا مع تحديثاتها.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {cases.map((c) => (
              <Link
                key={c.id}
                href={`/my-cases/${c.id}`}
                className="block rounded-2xl border border-white/10 bg-zinc-900/60 p-4 hover:border-emerald-400/50 transition"
              >
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <h2 className="font-semibold">{c.title || `قضية #${c.id}`}</h2>
                  <span className={"inline-flex items-center rounded-full border px-3 py-0.5 text-[11px] " + statusColor(c.status)}>
                    {c.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-zinc-400">
                  {c.type && <span>النوع: {c.type}</span>}
                  {c.court && <span>المحكمة: {c.court}</span>}
                  <span>عدد التحديثات: {c._count.updates}</span>
                  {c.updates[0] && (
                    <span>
                      آخر تحديث: {new Date(c.updates[0].createdAt).toLocaleDateString("ar-IQ")}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-zinc-500 leading-6">
          تعرض هذه الصفحة التحديثات التي يشاركها مكتبك فقط. للاستفسارات، تواصل مع مكتبك مباشرة.
        </p>
      </div>
    </main>
  );
}
