 // app/(site)/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ClientDashboardPage() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "CLIENT") {
    redirect("/unauthorized");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* رأس الصفحة */}
        <header className="text-right space-y-1">
          <h1 className="text-3xl font-bold">لوحة المستفيد</h1>
          <p className="text-sm text-zinc-400">
            من هنا يمكنك إدارة استشاراتك القانونية، العقود الذكية، وطلبات الترجمة
            القانونية، ومتابعة ما قدّمته المنصّة لك من خدمات.
          </p>
          <p className="text-xs text-zinc-500">
            مرحباً، {user?.name || user?.email || "مستخدم"}
          </p>
        </header>

        {/* روابط الخدمات الرئيسية للمستخدم العادي */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-right">
            خدماتك في منصة المستشار القانوني
          </h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <DashboardCard
              href="/consultations"
              title="الاستشارات القانونية"
              description="طلب استشارة قانونية ذكية أو استشارة من محامين معتمدين، ومتابعة الاستشارات السابقة."
            />
            <DashboardCard
              href="/contracts"
              title="العقود الذكية"
              description="إنشاء عقود قانونية ذكية، تعبئة قوالب جاهزة، وتحميلها بصيغة PDF."
            />
            <DashboardCard
              href="/translate"
              title="الترجمة القانونية"
              description="طلب ترجمة قانونية للنصوص والعقود بين العربية والإنجليزية، ومتابعة طلبات الترجمة."
            />
            <DashboardCard
              href="/library"
              title="المكتبة القانونية"
              description="الاطلاع على النصوص القانونية، الفقهية، والدراسات الأكاديمية الموجودة في مكتبة المنصّة."
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function DashboardCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 hover:border-emerald-500/70 hover:bg-zinc-900 transition text-right"
    >
      <h3 className="font-semibold text-zinc-50 mb-1">{title}</h3>
      <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
      <div className="mt-3 text-[11px] text-emerald-300">
        فتح الخدمة ↗
      </div>
    </Link>
  );
}
