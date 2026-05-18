 // app/(site)/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PLAN_PERMISSIONS, PLAN_CONFIG } from "@/lib/plans";
import Link from "next/link";
import { UserPlan } from "@prisma/client";

export const dynamic = "force-dynamic";

// ── مكوّن البطاقة ─────────────────────────────────────────────
function ServiceCard({
  href, title, description, emoji, locked, lockMsg,
}: {
  href: string; title: string; description: string;
  emoji: string; locked?: boolean; lockMsg?: string;
}) {
  if (locked) {
    return (
      <div className="block rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-right opacity-60 relative">
        <div className="absolute top-3 left-3 text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
          🔒 مقفل
        </div>
        <div className="text-2xl mb-2">{emoji}</div>
        <h3 className="font-semibold text-zinc-400 mb-1">{title}</h3>
        <p className="text-xs text-zinc-600 leading-relaxed">{description}</p>
        {lockMsg && (
          <div className="mt-3 text-[11px] text-amber-400">{lockMsg}</div>
        )}
      </div>
    );
  }
  return (
    <Link href={href} className="block rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 hover:border-emerald-500/70 hover:bg-zinc-900 transition text-right">
      <div className="text-2xl mb-2">{emoji}</div>
      <h3 className="font-semibold text-zinc-50 mb-1">{title}</h3>
      <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
      <div className="mt-3 text-[11px] text-emerald-300">فتح الخدمة ↗</div>
    </Link>
  );
}

// ── مكوّن بطاقة النقاط ────────────────────────────────────────
function PointsCard({ points, plan, subscriptionEndsAt }: {
  points: number; plan: UserPlan; subscriptionEndsAt: string | null;
}) {
  const config = PLAN_CONFIG[plan];
  const isExpired = subscriptionEndsAt && new Date(subscriptionEndsAt) < new Date();
  const isUnlimited = plan === "BUSINESS";

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900/60 p-4 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <div className="text-3xl">💎</div>
        <div>
          <div className="text-xs text-zinc-400">رصيد النقاط</div>
          <div className="text-xl font-bold text-emerald-400">
            {isUnlimited ? "غير محدود" : `${points} نقطة`}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-zinc-400">الباقة الحالية</div>
        <div className={`text-sm font-semibold ${isExpired ? "text-red-400" : "text-amber-300"}`}>
          {config.label} {isExpired ? "— منتهية ⚠️" : ""}
        </div>
        {subscriptionEndsAt && !isExpired && (
          <div className="text-[10px] text-zinc-500">
            تنتهي: {new Date(subscriptionEndsAt).toLocaleDateString("ar-IQ")}
          </div>
        )}
      </div>
      {(plan === "FREE" || isExpired) && (
        <Link href="/pricing" className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition">
          ترقية الباقة ↗
        </Link>
      )}
    </div>
  );
}

// ── الصفحة الرئيسية ───────────────────────────────────────────
export default async function DashboardPage() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  if (!user) redirect("/login");

  const role     = user.role as string;
  const branchId = user.branchId as number | null;

  // ── توجيه حسب الدور ────────────────────────────────────────
  if (role === "ADMIN")               redirect("/admin");
  if (role === "TRANSLATION_OFFICE")  redirect("/translation-office");
  if (role === "LAWYER" && branchId)  redirect("/firm-dashboard");
  if (role === "LAWYER" && !branchId) redirect("/lawyers");

  // ── جلب بيانات المستخدم من DB ──────────────────────────────
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: {
      id: true, plan: true, points: true,
      subscriptionEndsAt: true, name: true,
      _count: {
        select: {
          consultations: true,
          cases: true,
        },
      },
    },
  });

  if (!dbUser) redirect("/login");

  const plan        = dbUser.plan as UserPlan;
  const perms       = PLAN_PERMISSIONS[plan];
  const isExpired   = dbUser.subscriptionEndsAt && new Date(dbUser.subscriptionEndsAt) < new Date();
  const effectivePlan: UserPlan = isExpired ? "FREE" : plan;
  const effectivePerms = PLAN_PERMISSIONS[effectivePlan];

  const lockMsg = "قم بترقية باقتك للوصول إلى هذه الخدمة";

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* الهيدر */}
        <header className="text-right space-y-1">
          <h1 className="text-2xl font-bold">
            مرحباً، {dbUser.name || user.email} 👋
          </h1>
          <p className="text-sm text-zinc-400">
            لوحة التحكم الخاصة بك في منصة المستشار القانوني الذكي.
          </p>
        </header>

        {/* بطاقة النقاط والباقة */}
        <PointsCard
          points={dbUser.points}
          plan={plan}
          subscriptionEndsAt={dbUser.subscriptionEndsAt?.toISOString() ?? null}
        />

        {/* إحصاءات سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center">
            <div className="text-xl font-bold text-emerald-400">{dbUser._count.consultations}</div>
            <div className="text-xs text-zinc-400 mt-1">استشارة</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center">
            <div className="text-xl font-bold text-blue-400">{dbUser._count.cases}</div>
            <div className="text-xs text-zinc-400 mt-1">قضية</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center">
            <div className="text-xl font-bold text-amber-400">{dbUser.points}</div>
            <div className="text-xs text-zinc-400 mt-1">نقطة</div>
          </div>
        </div>

        {/* الخدمات */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-right text-zinc-300">
            خدماتك المتاحة
          </h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

            {/* الاستشارات — متاح للجميع بحدود */}
            <ServiceCard
              href="/consultations"
              emoji="⚖️"
              title="الاستشارات القانونية"
              description="استشارة فورية بالذكاء الاصطناعي أو من محامٍ بشري أو مكتب معتمد."
            />

            {/* العقود */}
            <ServiceCard
              href="/contracts"
              emoji="📄"
              title="العقود الذكية"
              description="إنشاء عقود قانونية ذكية وتحميلها بصيغة PDF."
              locked={!effectivePerms.contracts}
              lockMsg={lockMsg}
            />

            {/* الترجمة */}
            <ServiceCard
              href="/translate"
              emoji="🌐"
              title="الترجمة القانونية"
              description="ترجمة قانونية احترافية بين العربية والإنجليزية."
              locked={!effectivePerms.humanTranslation && !effectivePerms.aiTranslation}
              lockMsg={lockMsg}
            />

            {/* المكتبة — للجميع */}
            <ServiceCard
              href="/library"
              emoji="📚"
              title="المكتبة القانونية"
              description="الاطلاع على النصوص القانونية والدراسات الأكاديمية."
            />

            {/* إدارة القضايا */}
            <ServiceCard
              href="/cases"
              emoji="📁"
              title="إدارة القضايا"
              description="متابعة قضاياك القانونية وجلسات المحكمة والمستندات."
              locked={!effectivePerms.caseManagement}
              lockMsg={lockMsg}
            />

            {/* المحامون والمكاتب */}
            <ServiceCard
              href="/lawyers"
              emoji="🏛️"
              title="المحامون والمكاتب"
              description="تصفح المحامين المعتمدين والمكاتب القانونية وطلب استشارة."
              locked={!effectivePerms.viewLawyers && !effectivePerms.humanConsult}
              lockMsg={lockMsg}
            />

            {/* المحامي الذكي — BUSINESS فقط */}
            <ServiceCard
              href="/smart-lawyer"
              emoji="🤖"
              title="المحامي الذكي"
              description="تحليل القضايا والمستندات القانونية بالذكاء الاصطناعي — متاح لباقة الشركات فقط."
              locked={!effectivePerms.smartLawyer}
              lockMsg="متاح لباقة الشركات (BUSINESS) فقط"
            />

          </div>
        </section>

        {/* رسالة الترقية لباقة FREE */}
        {effectivePlan === "FREE" && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-right">
            <div className="text-sm font-semibold text-amber-300 mb-1">
              🚀 افتح كامل إمكانيات المنصة
            </div>
            <p className="text-xs text-zinc-400 mb-3">
              أنت على الباقة المجانية — ترقيتك إلى باقة الأفراد تمنحك 50 نقطة شهرياً
              والوصول لكل الخدمات.
            </p>
            <Link
              href="/pricing"
              className="inline-block px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition"
            >
              عرض الباقات ↗
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}
