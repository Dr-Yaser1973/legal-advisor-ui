 // app/(site)/lawyers/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function LawyerDetailsPage({ params }: PageProps) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    notFound();
  }

  // نقرأ من User + LawyerProfile حسب السكيمة النهائية
  const lawyer = await prisma.user.findUnique({
    where: { id },
    include: {
      lawyerProfile: true,
    },
  });

  // إذا لم يوجد أو ليس دوره LAWYER نرجع 404
  if (!lawyer || lawyer.role !== "LAWYER") {
    notFound();
  }

  const profile = lawyer.lawyerProfile;

  const fullName = lawyer.name ?? "محامٍ";
  const email = lawyer.email ?? "";
  const avatarUrl = lawyer.image || "/default-lawyer.png";
  const city = profile?.city ?? "غير محدد";
  const specialties = profile?.specialties ?? "غير محدد";
  const rating = profile?.rating ?? 0;
  const phone = profile?.phone ?? "";
  const bio = profile?.bio ?? "";
  const experience = profile?.consultFee ?? null; // أو عدّلها لحقل مناسب لسنوات الخبرة
  const isAvailable = lawyer.isApproved; // يمكنك تغييره لاحقًا حسب منطقك

  return (
    <main
      className="p-6 max-w-3xl mx-auto space-y-6 text-right"
      dir="rtl"
    >
      {/* رأس الصفحة */}
      <header className="flex items-center gap-4">
        <img
          src={avatarUrl}
          alt={fullName}
          className="w-24 h-24 rounded-full object-cover border border-zinc-700/60"
        />
        <div>
          <h1 className="text-2xl font-bold">{fullName}</h1>
          <div className="text-sm text-zinc-300">
            {specialties} • {city}
          </div>
          <div className="text-sm text-yellow-400 mt-1">
            ⭐ {rating.toFixed(1)}
          </div>
          <div className="text-xs mt-1">
            {isAvailable ? "متاح للاستشارة عبر المنصة" : "غير متاح حاليًا"}
          </div>
        </div>
      </header>

      {/* نبذة عن المحامي */}
      {bio && (
        <section className="space-y-2">
          <h2 className="font-semibold text-lg">نبذة عن المحامي</h2>
          <p className="whitespace-pre-wrap text-sm text-zinc-100">
            {bio}
          </p>
        </section>
      )}

      {/* معلومات إضافية */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-900/40">
          <div className="text-zinc-400">سنوات الخبرة (أو أجر الاستشارة)</div>
          <div className="font-semibold text-zinc-100">
            {experience ?? "غير محدد"}
          </div>
        </div>

        <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-900/40">
          <div className="text-zinc-400">البريد الإلكتروني</div>
          <div className="font-semibold text-zinc-100 break-words">
            {email || "غير متوفر"}
          </div>
        </div>

        {phone && (
          <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-900/40">
            <div className="text-zinc-400">رقم الهاتف</div>
            <div className="font-semibold text-zinc-100">{phone}</div>
          </div>
        )}
      </section>

      {/* تنبيه عن طريقة الاستشارة */}
      <section className="border border-blue-500/40 rounded-lg p-4 bg-blue-500/5 text-sm text-zinc-100">
        <p>
          يتم طلب الاستشارة من هذا المحامي عبر نظام الاستشارات البشرية في
          صفحة{" "}
          <Link
            href="/consultations"
            className="underline text-blue-300 hover:text-blue-200"
          >
            الاستشارات القانونية
          </Link>{" "}
          وليس عبر تواصل مباشر، لضمان توثيق الطلب وفتح غرفة محادثة رسمية عبر
          المنصة.
        </p>
      </section>

      {/* أزرار تنقل */}
      <section className="space-y-2">
        <h2 className="font-semibold text-lg">التنقل</h2>
        <div className="flex flex-wrap gap-2 justify-end">
          <Link
            href="/lawyers"
            className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-100 hover:bg-zinc-900"
          >
            العودة لقائمة المحامين
          </Link>
          <Link
            href="/consultations"
            className="px-4 py-2 rounded-lg bg-blue-600 text-sm text-white hover:bg-blue-700"
          >
            طلب استشارة قانونية
          </Link>
        </div>
      </section>
    </main>
  );
}
