 import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OfficeRequestCard, {
  OfficeRequestItem,
} from "./OfficeRequestCard";
import OfficeInProgressCard, {
  OfficeInProgressItem,
} from "./OfficeInProgressCard";

export const dynamic = "force-dynamic";

export default async function TranslationOfficeRequestsPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  const user = session?.user as any;

  if (!user) redirect("/login");
  if (user.role !== "TRANSLATION_OFFICE" || !user.status) {
    redirect("/dashboard");
  }

  const officeId = Number(user.id);

  // الطلبات الجديدة التي بانتظار التسعير
  const pending = await prisma.translationRequest.findMany({
    where: {
      officeId,
      status: "PENDING",
    },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { id: true, name: true, email: true } },
      sourceDoc: { select: { id: true, title: true, filename: true } },
    },
  });

  const pendingItems: OfficeRequestItem[] = pending.map((r) => ({
    id: r.id,
    targetLang: r.targetLang as "AR" | "EN",
    sourceDoc: {
      id: r.sourceDoc.id,
      title: r.sourceDoc.title,
      filename: r.sourceDoc.filename,
    },
    client: {
      id: r.client.id,
      name: r.client.name,
      email: r.client.email,
    },
  }));

  // الطلبات قيد التنفيذ بعد موافقة العميل
  const inProgress = await prisma.translationRequest.findMany({
    where: {
      officeId,
      status: "IN_PROGRESS",
    },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { id: true, name: true, email: true } },
      sourceDoc: { select: { id: true, title: true, filename: true } },
    },
  });

  const inProgressItems: OfficeInProgressItem[] = inProgress.map((r) => ({
    id: r.id,
    targetLang: r.targetLang as "AR" | "EN",
    sourceDoc: {
      id: r.sourceDoc.id,
      title: r.sourceDoc.title,
      filename: r.sourceDoc.filename,
    },
    client: {
      id: r.client.id,
      name: r.client.name,
      email: r.client.email,
    },
    price: r.price,
    currency: r.currency ?? undefined,
    note: r.note ?? undefined,
  }));

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-10 text-right space-y-8">
        <section>
          <h1 className="text-2xl font-bold mb-4">
            طلبات الترجمة الرسمية الجديدة
          </h1>

          {pendingItems.length === 0 ? (
            <p className="text-sm text-zinc-400">
              لا توجد طلبات جديدة حاليًا.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingItems.map((r) => (
                <OfficeRequestCard key={r.id} item={r} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">
            طلباتي قيد التنفيذ
          </h2>

          {inProgressItems.length === 0 ? (
            <p className="text-sm text-zinc-400">
              لا توجد طلبات قيد التنفيذ حاليًا.
            </p>
          ) : (
            <div className="space-y-3">
              {inProgressItems.map((r) => (
                <OfficeInProgressCard key={r.id} item={r} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
