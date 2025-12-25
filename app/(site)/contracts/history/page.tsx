// app/(site)/contracts/history/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ContractsHistoryPage() {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) redirect("/login");

  const userId = Number(session.user.id);

  const items = await prisma.generatedContract.findMany({
    where: { createdById: userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, pdfPath: true, createdAt: true },
    take: 50,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">سجل العقود</h1>
      <div className="grid gap-3">
        {items.map((x) => (
          <div key={x.id} className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
            <div className="font-semibold">{x.title}</div>
            <div className="text-sm text-zinc-400">
              #{x.id} — {new Date(x.createdAt).toLocaleString()}
            </div>
            <div className="mt-3 flex gap-2">
              <Link className="rounded-lg border border-zinc-700 px-3 py-2 text-sm" href={`/contracts/generated/${x.id}`}>
                عرض
              </Link>
              <a className="rounded-lg border border-zinc-700 px-3 py-2 text-sm" href={x.pdfPath} target="_blank" rel="noreferrer">
                PDF
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

