 // app/(site)/translation-office/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

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
  const session = (await getServerSession(authOptions as any)) as any;
  const user = session?.user as any;

  if (!user) redirect("/login");
  if (user.role !== "TRANSLATION_OFFICE" || !user.isApproved) {
    redirect("/dashboard");
  }

  const officeId = Number(user.id);

  const acceptedAndInProgress = await prisma.translationRequest.findMany({
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

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-10 text-right space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">لوحة مكتب الترجمة</h1>
          <p className="text-sm text-zinc-300 mb-3">
            يمكنك من هنا متابعة طلبات الترجمة الرسمية التي قبلتها، ومعرفة حالة كل طلب.
          </p>

          <a
            href="/translation-office/requests"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm"
          >
            عرض الطلبات الجديدة المتاحة للقبول
          </a>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-3">الطلبات الجارية</h2>
          {acceptedAndInProgress.length === 0 ? (
            <p className="text-sm text-zinc-400">
              لا توجد طلبات جارية حاليًا.
            </p>
          ) : (
            <div className="space-y-3">
              {acceptedAndInProgress.map((r) => (
                <div
                  key={r.id}
                  className="border border-white/10 rounded-xl bg-zinc-900/40 p-4 space-y-2"
                >
                  <div className="text-sm">
                    <span className="font-semibold">المستند:</span>{" "}
                    {r.sourceDoc?.title || r.sourceDoc?.filename || `#${r.sourceDocId}`}
                  </div>
                  <div className="text-xs text-zinc-400">
                    <span className="font-semibold">العميل:</span>{" "}
                    {r.client?.name || r.client?.email || `مستخدم رقم ${r.clientId}`}
                  </div>
                  <div className="text-xs text-zinc-400">
                    <span className="font-semibold">الحالة:</span>{" "}
                    {statusLabel(r.status)}
                  </div>
                  <div className="text-xs text-zinc-400">
                    <span className="font-semibold">اللغة المستهدفة:</span>{" "}
                    {r.targetLang === "EN" ? "الإنجليزية" : "العربية"}
                  </div>

                  {/* هنا في المستقبل يمكن إضافة أزرار:
                      - بدء الترجمة (تغيير الحالة إلى IN_PROGRESS)
                      - إنهاء الترجمة (تغيير الحالة إلى COMPLETED + رفع الملف)
                  */}
                </div>
              ))}
            </div>
          )}
        </section>

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
                    <span className="font-semibold">المستند:</span>{" "}
                    {r.sourceDoc?.title || r.sourceDoc?.filename || `#${r.sourceDocId}`}
                  </div>
                  <div className="text-xs text-zinc-400">
                    <span className="font-semibold">العميل:</span>{" "}
                    {r.client?.name || r.client?.email || `مستخدم رقم ${r.clientId}`}
                  </div>
                  <div className="text-xs text-zinc-400">
                    <span className="font-semibold">الحالة:</span>{" "}
                    {statusLabel(r.status)}
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
