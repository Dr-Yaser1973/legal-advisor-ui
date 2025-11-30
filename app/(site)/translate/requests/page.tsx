// app/(site)/translate/requests/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function statusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "بانتظار قبول مكتب الترجمة";
    case "ACCEPTED":
      return "تم القبول – بانتظار التنفيذ";
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

export default async function MyTranslationRequestsPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  const user = session?.user as any;

  if (!user) redirect("/login");

  const clientId = Number(user.id);

  const requests = await prisma.translationRequest.findMany({
    where: { clientId },
    orderBy: { createdAt: "desc" },
    include: {
      sourceDoc: { select: { id: true, title: true, filename: true } },
      office: { select: { id: true, name: true, email: true } },
    },
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-10 text-right">
        <h1 className="text-2xl font-bold mb-4">طلباتي في الترجمة الرسمية</h1>

        {requests.length === 0 ? (
          <p className="text-sm text-zinc-400">
            لم تقم بطلب أي ترجمة رسمية حتى الآن.
          </p>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <div
                key={r.id}
                className="border border-white/10 rounded-xl bg-zinc-900/40 p-4 space-y-2"
              >
                <div className="text-sm">
                  <span className="font-semibold">المستند:</span>{" "}
                  {r.sourceDoc?.title || r.sourceDoc?.filename || `#${r.sourceDocId}`}
                </div>
                <div className="text-xs text-zinc-400">
                  <span className="font-semibold">اللغة المستهدفة:</span>{" "}
                  {r.targetLang === "EN" ? "الإنجليزية" : "العربية"}
                </div>
                <div className="text-xs text-zinc-400">
                  <span className="font-semibold">الحالة:</span>{" "}
                  {statusLabel(r.status)}
                </div>
                <div className="text-xs text-zinc-400">
                  <span className="font-semibold">مكتب الترجمة:</span>{" "}
                  {r.office
                    ? r.office.name || r.office.email || `مكتب رقم ${r.office.id}`
                    : "لم يُحدَّد بعد"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

