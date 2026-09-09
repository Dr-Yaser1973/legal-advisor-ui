// app/(site)/translation-office/profile/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import OfficeProfileForm from "./OfficeProfileForm";

export const dynamic = "force-dynamic";

export default async function OfficeProfilePage() {
  const session = (await getServerSession(authOptions as any)) as any;
  const user = session?.user as any;

  if (!user?.email) redirect("/login");
  if (user.role !== "TRANSLATION_OFFICE") redirect("/dashboard");

  const office = await prisma.user.findUnique({
    where: { email: user.email },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      location: true,
      image: true,
      bio: true,
      isApproved: true,
    },
  });

  if (!office) redirect("/login");

  return (
    <main className="min-h-screen bg-[#0a0a12] text-white">
      <div className="max-w-3xl mx-auto px-4 py-10 text-right space-y-6">
        {/* رجوع */}
        <Link
          href="/translation-office"
          className="inline-flex items-center gap-1 text-sm text-purple-300 transition hover:text-white"
        >
          <span>→</span>
          الرجوع إلى لوحة المكتب
        </Link>

        {/* الترويسة */}
        <div className="relative overflow-hidden rounded-3xl border border-purple-500/25 bg-gradient-to-bl from-[#1e1133] via-[#15101f] to-[#120e1a] p-8">
          <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="relative">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-l from-white to-purple-200 bg-clip-text text-transparent">
              الملف التعريفي للمكتب
            </h1>
            <p className="text-sm text-purple-200/90 mt-2 max-w-xl leading-relaxed">
              أضف شعار مكتبك ونبذة مختصرة تُعرّف العملاء بخدماتك. تظهر هذه
              المعلومات في صفحة مكتبك ضمن قائمة مكاتب الترجمة المعتمدة.
            </p>
            {!office.isApproved && (
              <p className="mt-3 inline-block rounded-lg bg-amber-400/12 px-3 py-1.5 text-xs text-amber-300">
                حسابك قيد المراجعة — يمكنك تجهيز ملفك الآن وسيظهر للعملاء بعد
                اعتماد المكتب.
              </p>
            )}
          </div>
        </div>

        <OfficeProfileForm
          initial={{
            name: office.name ?? "",
            phone: office.phone ?? "",
            location: office.location ?? "",
            bio: office.bio ?? "",
            image: office.image ?? null,
          }}
          publicHref={`/translation-offices/${office.id}`}
        />
      </div>
    </main>
  );
}
