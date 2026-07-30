 // app/(site)/translation-office/requests/page.tsx
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OfficeRequestCard, {
  OfficeRequestItem,
} from "./OfficeRequestCard";
import TranslationChat from "@/components/TranslationChat";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  ACCEPTED: "بانتظار موافقة العميل على السعر",
  IN_PROGRESS: "قيد التنفيذ",
  COMPLETED: "مكتمل",
};

export default async function TranslationOfficeRequestsPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  const user = session?.user as any;

  if (!user || !user.email) redirect("/login");

  if (user.role !== "TRANSLATION_OFFICE" && user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // ✅ جلب officeId الحقيقي من DB
  const dbOffice = await prisma.user.findUnique({
    where: { email: user.email },
    select: { id: true },
  });

  if (!dbOffice) {
    redirect("/login");
  }

  const officeId = dbOffice.id; // ✅ هذا هو المفتاح

  const requests = await prisma.translationRequest.findMany({
    where: {
      officeId,
      status: "PENDING", // بانتظار تسعير هذا المكتب
    },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { id: true, name: true, email: true } },
      sourceDoc: {
        select: {
          id: true,
          title: true,
          filename: true,
          filePath: true,
        },
      },
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

  // الطلبات النشطة (تم تسعيرها/قبولها) — هنا تُفتح المراسلة مع العميل
  const activeRequests = await prisma.translationRequest.findMany({
    where: {
      officeId,
      status: { in: ["ACCEPTED", "IN_PROGRESS", "COMPLETED"] },
    },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { id: true, name: true, email: true } },
      sourceDoc: { select: { id: true, title: true, filename: true } },
    },
  });

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

        <h2 className="text-xl font-bold mt-10 mb-4">
          الطلبات النشطة (التفاوض والتنفيذ)
        </h2>
        {activeRequests.length === 0 ? (
          <p className="text-sm text-zinc-400">
            لا توجد طلبات نشطة حاليًا.
          </p>
        ) : (
          <div className="space-y-3">
            {activeRequests.map((r) => (
              <div
                key={r.id}
                className="border border-white/10 rounded-xl bg-zinc-900/40 p-4 space-y-2"
              >
                <div className="text-sm text-zinc-300 font-semibold">
                  الملف: {r.sourceDoc.title || r.sourceDoc.filename}
                </div>
                <div className="text-xs text-zinc-400">
                  العميل: {r.client.name || r.client.email}
                </div>
                <div className="text-xs text-zinc-400">
                  الحالة: {STATUS_LABEL[r.status] || r.status}
                  {r.price ? ` — السعر: ${r.price} ${r.currency || "IQD"}` : ""}
                </div>
                <TranslationChat
                  requestId={r.id}
                  meId={officeId}
                  counterpartLabel={r.client.name || "العميل"}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
