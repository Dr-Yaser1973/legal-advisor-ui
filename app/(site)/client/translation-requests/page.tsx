// app/(site)/client/translation-requests/page.tsx
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type TranslationRequestItem = {
  id: number;
  status: string;
  createdAt: string;
  targetLang: string;
  price: number | null;
  currency: string | null;
  note: string | null;
  sourceDoc: {
    id: number;
    title: string;
    filename: string;
  };
  office: {
    id: number;
    name: string | null;
    email: string | null;
  } | null;
};

export default async function ClientTranslationRequestsPage() {
  const session = (await getServerSession(authOptions as any)) as any;
const user = session?.user as any;


  if (!user) redirect("/login");
  if (user.role !== "CLIENT" && user.role !== "COMPANY") {
    redirect("/dashboard");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/client/translation-requests`,
    { cache: "no-store" }
  );
  const data = await res.json();

  const items: TranslationRequestItem[] = data.items || [];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-10 text-right">
        <h1 className="text-2xl font-bold mb-4">طلبات الترجمة الرسمية</h1>

        {items.length === 0 ? (
          <p className="text-sm text-zinc-400">
            لا توجد طلبات ترجمة رسمية حتى الآن.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((r) => (
              <div
                key={r.id}
                className="border border-white/10 rounded-xl bg-zinc-900/40 p-4 space-y-2"
              >
                <div className="text-sm text-zinc-300">
                  <span className="font-semibold">الملف:</span>{" "}
                  {r.sourceDoc?.title || r.sourceDoc?.filename}
                </div>
                <div className="text-xs text-zinc-400">
                  <span className="font-semibold">الحالة:</span>{" "}
                  {r.status}
                </div>
                <div className="text-xs text-zinc-400">
                  <span className="font-semibold">اللغة المستهدفة:</span>{" "}
                  {r.targetLang === "EN" ? "الإنجليزية" : "العربية"}
                </div>

                {r.office ? (
                  <div className="text-xs text-zinc-200 space-y-1">
                    <div className="font-semibold">
                      مكتب الترجمة المعتمد:
                    </div>
                    <div>الاسم: {r.office.name || "—"}</div>
                    <div>البريد: {r.office.email || "—"}</div>
                    {r.price && (
                      <div>
                        السعر: {r.price}{" "}
                        {r.currency || "IQD"}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-yellow-400">
                    لم يتم قبول الطلب من أي مكتب ترجمة بعد.
                  </div>
                )}

                {/* هنا يمكن لاحقًا إضافة زر لرفع/إعادة رفع الملف أو مرفقات أخرى */}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

