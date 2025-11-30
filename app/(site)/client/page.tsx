// app/(site)/client/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export default async function ClientDashboardPage() {
  const session = (await getServerSession(authOptions as any)) as any;
const user = session?.user as any;


  if (!user) redirect("/login");
  if (user.role !== "CLIENT") {
    // لو شخص بدور آخر حاول الدخول يدويًا
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6 text-right">
          لوحة المستخدم
        </h1>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/library"
            className="rounded-xl border border-white/10 bg-zinc-900/40 p-5 hover:bg-zinc-900/60 transition block text-right"
          >
            <div className="text-lg font-medium mb-1">📚 المكتبة القانونية</div>
            <div className="text-sm text-zinc-400">
              تصفح القوانين والدراسات القانونية والأسئلة والأجوبة الجاهزة.
            </div>
          </Link>

          <Link
            href="/consultations"
            className="rounded-xl border border-white/10 bg-zinc-900/40 p-5 hover:bg-zinc-900/60 transition block text-right"
          >
            <div className="text-lg font-medium mb-1">الاستشارات ة</div>
            <div className="text-sm text-zinc-400">
              اطرح استفسارك القانوني لتحصل على إجابة أولية من النظام الذكي.
            </div>
          </Link>

          <Link
            href="/contracts"
            className="rounded-xl border border-white/10 bg-zinc-900/40 p-5 hover:bg-zinc-900/60 transition block text-right"
          >
            <div className="text-lg font-medium mb-1">📄 توليد العقود</div>
            <div className="text-sm text-zinc-400">
              إنشاء عقود قانونية مخصصة بصيغة PDF بالاستناد إلى القوالب الجاهزة.
            </div>
          </Link>

          <Link
            href="/translation"
            className="rounded-xl border border-white/10 bg-zinc-900/40 p-5 hover:bg-zinc-900/60 transition block text-right"
          >
            <div className="text-lg font-medium mb-1">🌐 الترجمة القانونية</div>
            <div className="text-sm text-zinc-400">
              ترجمة المستندات القانونية بين العربية والإنجليزية، مع خيار إحالتها
              لمكتب ترجمة رسمي لاحقًا.
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}

