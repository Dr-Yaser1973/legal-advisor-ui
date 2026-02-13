 // app/(site)/translation-office/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import OfficeInProgressCard, {
  OfficeInProgressItem,
} from "./OfficeInProgressCard";

export const dynamic = "force-dynamic";

function statusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "بانتظار قبول مكتب الترجمة";
    case "ACCEPTED":
      return "تم القبول – بانتظار البدء";
    case "IN_PROGRESS":
      return "قيد الترجمة";
    case "COMPLETED":
      return "منجزة";
    case "CANCELED":
      return "ملغاة";
    default:
      return status;
  }
}

export default async function TranslationOfficeDashboardPage() {
  // ===============================
  // 1️⃣ الجلسة
  // ===============================
  const session = (await getServerSession(authOptions as any)) as any;
  const user = session?.user as any;

  if (!user || !user.email) redirect("/login");

  if (user.role !== "TRANSLATION_OFFICE" || !user.isApproved) {
    redirect("/dashboard");
  }

  // ===============================
  // 2️⃣ officeId الحقيقي من DB (🔥 هذا هو الإصلاح)
  // ===============================
  const dbOffice = await prisma.user.findUnique({
    where: { email: user.email },
    select: { id: true },
  });

  if (!dbOffice) redirect("/login");

  const officeId = dbOffice.id;

  // ===============================
  // 3️⃣ الطلبات المقبولة + الجارية
  // ===============================
  const active = await prisma.translationRequest.findMany({
    where: {
      officeId,
      status: { in: ["ACCEPTED", "IN_PROGRESS"] },
    },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { id: true, name: true, email: true } },
      sourceDoc: { select: { id: true, title: true, filename: true } },
    },
  });

  // ===============================
  // 4️⃣ الطلبات المكتملة
  // ===============================
  const completed = await prisma.translationRequest.findMany({
    where: {
      officeId,
      status: "COMPLETED",
    },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { id: true, name: true, email: true } },
      sourceDoc: { select: { id: true, title: true, filename: true } },
    },
  });

  // ===============================
  // 5️⃣ تقسيم الحالات
  // ===============================
  const acceptedOnly = active.filter((r) => r.status === "ACCEPTED");

  const inProgressItems: OfficeInProgressItem[] = active
    .filter((r) => r.status === "IN_PROGRESS")
    .map((r) => ({
      id: r.id,
      targetLang: r.targetLang as "AR" | "EN",
      sourceDoc: {
        id: r.sourceDoc!.id,
        title: r.sourceDoc!.title,
        filename: r.sourceDoc!.filename,
      },
      client: {
        id: r.client!.id,
        name: r.client!.name,
        email: r.client!.email,
      },
      price: r.price,
      currency: r.currency ?? undefined,
      note: r.note ?? undefined,
    }));

  // ===============================
  // 6️⃣ العرض
  // ===============================
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-10 text-right space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">لوحة مكتب الترجمة</h1>
          <p className="text-sm text-zinc-300 mb-3">
            متابعة طلبات الترجمة الرسمية المقبولة والجارية.
          </p>

          <a
            href="/translation-office/requests"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm"
          >
            عرض الطلبات الجديدة
          </a>
        </div>

        {/* المقبولة */}
        <section>
          <h2 className="text-xl font-semibold mb-3">
            الطلبات المقبولة – بانتظار البدء
          </h2>

          {acceptedOnly.length === 0 ? (
            <p className="text-sm text-zinc-400">
              لا توجد طلبات مقبولة حاليًا.
            </p>
          ) : (
            <div className="space-y-3">
              {acceptedOnly.map((r) => (
                <div
                  key={r.id}
                  className="border border-white/10 rounded-xl bg-zinc-900/40 p-4 space-y-2"
                >
                  <div className="text-sm">
                    <b>المستند:</b>{" "}
                    {r.sourceDoc?.title || r.sourceDoc?.filename}
                  </div>
                  <div className="text-xs text-zinc-400">
                    <b>العميل:</b> {r.client?.name || r.client?.email}
                  </div>
                  <div className="text-xs text-zinc-400">
                    <b>الحالة:</b> {statusLabel(r.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* الجارية */}
        <section>
          <h2 className="text-xl font-semibold mb-3">الطلبات الجارية</h2>

          {inProgressItems.length === 0 ? (
            <p className="text-sm text-zinc-400">
              لا توجد طلبات قيد الترجمة حاليًا.
            </p>
          ) : (
            <div className="space-y-3">
              {inProgressItems.map((item) => (
                <OfficeInProgressCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* المكتملة */}
        <section>
          <h2 className="text-xl font-semibold mb-3">الطلبات المكتملة</h2>

          {completed.length === 0 ? (
            <p className="text-sm text-zinc-400">
              لا توجد طلبات مكتملة بعد.
            </p>
          ) : (
            <div className="space-y-3">
              {completed.map((r) => (
                <div
                  key={r.id}
                  className="border border-white/10 rounded-xl bg-zinc-900/40 p-4 space-y-2"
                >
                  <div className="text-sm">
                    <b>المستند:</b>{" "}
                    {r.sourceDoc?.title || r.sourceDoc?.filename}
                  </div>
                  <div className="text-xs text-zinc-400">
                    <b>العميل:</b> {r.client?.name || r.client?.email}
                  </div>
                  <div className="text-xs text-zinc-400">
                    <b>الحالة:</b> {statusLabel(r.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
