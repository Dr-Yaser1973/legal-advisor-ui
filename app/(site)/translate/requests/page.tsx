 // app/(site)/translate/requests/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AcceptOfferButton from "./AcceptOfferButton";

export const dynamic = "force-dynamic";

function statusLabel(status: string): string {
  switch (status) {
    case "PENDING":
      return "بانتظار قبول مكتب الترجمة";
    case "ACCEPTED":
      return "تم تسعير الطلب – بانتظار موافقتك على عرض المكتب";
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
  // ===============================
  // 1️⃣ الجلسة
  // ===============================
  const session = (await getServerSession(authOptions as any)) as any;

  if (!session?.user?.email) {
    redirect("/login");
  }

  // ===============================
  // 2️⃣ جلب المستخدم الحقيقي من DB
  // ===============================
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!dbUser) {
    redirect("/login");
  }

  const clientId = dbUser.id; // ✅ مضمون 100%

  // ===============================
  // 3️⃣ جلب الطلبات
  // ===============================
  const requests = await prisma.translationRequest.findMany({
    where: { clientId },
    orderBy: { createdAt: "desc" },
    include: {
      sourceDoc: {
        select: {
          id: true,
          title: true,
          filename: true,
        },
      },
      office: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // ===============================
  // 4️⃣ العرض
  // ===============================
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
                {/* المستند */}
                <div className="text-sm">
                  <span className="font-semibold">المستند:</span>{" "}
                  {r.sourceDoc?.title ||
                    r.sourceDoc?.filename ||
                    `#${r.sourceDocId}`}
                </div>

                {/* اللغة */}
                <div className="text-xs text-zinc-400">
                  <span className="font-semibold">اللغة المستهدفة:</span>{" "}
                  {r.targetLang === "EN" ? "الإنجليزية" : "العربية"}
                </div>

                {/* الحالة */}
                <div className="text-xs text-zinc-400">
                  <span className="font-semibold">الحالة:</span>{" "}
                  {statusLabel(r.status)}
                </div>

                {/* المكتب */}
                <div className="text-xs text-zinc-400">
                  <span className="font-semibold">مكتب الترجمة:</span>{" "}
                  {r.office
                    ? r.office.name ||
                      r.office.email ||
                      `مكتب رقم ${r.office.id}`
                    : "لم يُحدَّد بعد"}
                </div>

                {/* السعر */}
                {r.price && (
                  <div className="text-xs text-emerald-400">
                    <span className="font-semibold">سعر العرض:</span>{" "}
                    {r.price} {r.currency || "IQD"}
                  </div>
                )}

                {/* ملاحظات */}
                {r.note && (
                  <div className="text-xs text-zinc-300">
                    <span className="font-semibold">ملاحظات المكتب:</span>{" "}
                    {r.note}
                  </div>
                )}

                {/* قبول العرض */}
                {r.status === "ACCEPTED" && r.price && (
                  <div className="mt-3">
                    <p className="text-[11px] text-zinc-400 mb-1">
                      هذا الطلب بانتظار موافقتك على عرض مكتب الترجمة.
                    </p>
                    <AcceptOfferButton requestId={r.id} />
                  </div>
                )}

                {/* التحميل */}
                {r.status === "COMPLETED" && r.translatedFilePath && (
                  <div className="mt-3">
                    <a
                      href={`/api/translation/requests/${r.id}/download`}
                      target="_blank"
                      className="inline-flex items-center gap-2 text-sm
                                 text-emerald-500 hover:underline"
                    >
                      📥 تحميل الترجمة الرسمية (PDF)
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
