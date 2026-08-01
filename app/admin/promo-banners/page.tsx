// app/admin/promo-banners/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import PromoBannersClient from "./PromoBannersClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "إدارة الإعلانات",
};

export default async function AdminPromoBannersPage() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">
          📣 إدارة الشريط الإعلاني
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          تحكّم بالإعلانات الظاهرة في الصفحة الرئيسية وصفحة المكتبة —
          أضف، عدّل، فعّل/أوقف، رتّب، أو احذف.
        </p>
      </div>

      <PromoBannersClient />
    </div>
  );
}
