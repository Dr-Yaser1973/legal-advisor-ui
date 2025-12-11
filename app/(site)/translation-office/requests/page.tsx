 import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import OfficeRequestCard, {
  OfficeRequestItem,
} from "./OfficeRequestCard";

export const dynamic = "force-dynamic";

export default async function TranslationOfficeRequestsPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  const user = session?.user as any;

  if (!user) redirect("/login");
  if (user.role !== "TRANSLATION_OFFICE") {
    redirect("/dashboard");
  }

  const officeId = Number(user.id);

  const requests = await prisma.translationRequest.findMany({
    where: {
      officeId,
      status: {
        in: ["PENDING", "ACCEPTED", "IN_PROGRESS"],
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { id: true, name: true, email: true } },
      sourceDoc: { select: { id: true, title: true, filename: true } },
    },
  });

  const items: OfficeRequestItem[] = requests.map((r) => ({
    id: r.id,
    status: r.status as any,
    hasPrice: r.price != null,
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

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-10 text-right">
        <h1 className="text-2xl font-bold mb-4">
          طلبات الترجمة الرسمية موجهة إلى مكتبك
        </h1>

        {items.length === 0 ? (
          <p className="text-sm text-zinc-400">
            لا توجد طلبات حالية موجهة لهذا المكتب.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <OfficeRequestCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
