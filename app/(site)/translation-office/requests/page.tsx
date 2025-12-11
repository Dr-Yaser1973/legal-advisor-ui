 // app/(site)/translation-office/requests/page.tsx
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OfficeRequestCard, {
  OfficeRequestItem,
} from "./OfficeRequestCard";

export const dynamic = "force-dynamic";

export default async function TranslationOfficeRequestsPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  const user = session?.user as any;

  if (!user) redirect("/login");

  if (user.role !== "TRANSLATION_OFFICE" && user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const officeId = Number(user.id);

  const requests = await prisma.translationRequest.findMany({
    where: {
      officeId,
      status: "PENDING", // الذي بانتظار تسعير هذا المكتب
    },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { id: true, name: true, email: true } },
      sourceDoc: { select: { id: true, title: true, filename: true } },
    },
  });

  const items: OfficeRequestItem[] = requests.map((r) => ({
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

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-10 text-right">
        <h1 className="text-2xl font-bold mb-4">
          طلبات الترجمة الرسمية المتاحة
        </h1>

        {items.length === 0 ? (
          <p className="text-sm text-zinc-400">
            لا توجد طلبات جديدة حاليًا.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((r) => (
              <OfficeRequestCard key={r.id} item={r} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
