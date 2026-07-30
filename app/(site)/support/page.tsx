// app/(site)/support/page.tsx
// صفحة «تواصل مع الإدارة» — متاحة لأي مستخدم مسجّل (عميل/محامٍ/شركة/مكتب محاماة/مكتب ترجمة).
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import SupportChat from "@/components/SupportChat";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  const user = session?.user as any;
  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-10 text-right">
        <h1 className="text-2xl font-bold mb-1">تواصل مع الإدارة</h1>
        <p className="text-sm text-zinc-400 mb-5">
          أرسل استفسارك أو ملاحظتك مباشرة لفريق إدارة المنصة، وستصلك الردود هنا.
        </p>
        <SupportChat endpoint="/api/support/messages" viewerIsAdmin={false} />
      </div>
    </main>
  );
}
