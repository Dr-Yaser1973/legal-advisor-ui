// app/(site)/my-cases/[id]/page.tsx — تفاصيل قضية الموكّل (حالة + تحديثات فقط)
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

function statusColor(status: string) {
  switch (status) {
    case "مفتوحة": return "bg-emerald-500/10 text-emerald-300 border-emerald-500/40";
    case "قيد المتابعة": return "bg-amber-500/10 text-amber-300 border-amber-500/40";
    case "محجوزة للحكم": return "bg-blue-500/10 text-blue-300 border-blue-500/40";
    case "مغلقة": return "bg-zinc-500/10 text-zinc-200 border-zinc-400/40";
    default: return "bg-zinc-500/10 text-zinc-200 border-zinc-400/40";
  }
}

export default async function MyCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;
  if (!user) redirect("/login");

  const uid = Number(user.id);
  const { id } = await params;
  const caseId = Number(id);
  if (Number.isNaN(caseId)) notFound();

  // مقيّد: العميل يرى فقط قضيته (clientId = هويته) — وحقولاً محدودة (لا داخلي/AI/فريق)
  const c = await prisma.case.findFirst({
    where: { id: caseId, clientId: uid },
    select: {
      id: true,
      title: true,
      type: true,
      status: true,
      court: true,
      filingDate: true,
      updates: {
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, content: true, createdAt: true },
      },
    },
  });

  if (!c) notFound();

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 text-zinc-100" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link href="/my-cases" className="text-xs text-zinc-400 hover:text-zinc-200 underline">
          ← الرجوع إلى قضاياي
        </Link>

        <header className="mt-3 mb-6 flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">{c.title || `قضية #${c.id}`}</h1>
            <div className="text-sm text-zinc-400 mt-1 flex flex-wrap gap-x-4">
              {c.type && <span>النوع: {c.type}</span>}
              {c.court && <span>المحكمة: {c.court}</span>}
            </div>
          </div>
          <span className={"inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium " + statusColor(c.status)}>
            {c.status}
          </span>
        </header>

        <h2 className="text-sm font-semibold mb-3">📌 تحديثات سير القضية</h2>

        {c.updates.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 text-center text-sm text-zinc-400">
            لا توجد تحديثات منشورة بعد. سيصلك إشعار عند نشر مكتبك أي تحديث.
          </div>
        ) : (
          <ol className="relative border-r border-white/10 pr-4 space-y-4">
            {c.updates.map((u) => (
              <li key={u.id} className="relative">
                <span className="absolute -right-[22px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-zinc-950" />
                <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
                  <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                    {u.title ? (
                      <span className="font-semibold text-sm">{u.title}</span>
                    ) : (
                      <span className="text-zinc-500 text-sm">تحديث</span>
                    )}
                    <span className="text-[11px] text-zinc-500">
                      {new Date(u.createdAt).toLocaleString("ar-IQ", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-200 whitespace-pre-wrap leading-7">{u.content}</p>
                </div>
              </li>
            ))}
          </ol>
        )}

        <p className="mt-8 text-center text-xs text-zinc-500 leading-6">
          هذه التحديثات مقدّمة من مكتبك القانوني. للاستفسار، تواصل مع مكتبك مباشرة.
        </p>
      </div>
    </main>
  );
}
