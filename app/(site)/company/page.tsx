// app/(site)/company/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export default async function CompanyDashboardPage() {
  const session = await getServerSession(authOptions as any);
  const user: any = session?.user;

  if (!user) redirect("/login");
  if (user.role !== "COMPANY") redirect("/dashboard");

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-10 text-right">
        <h1 className="text-2xl font-bold mb-4">لوحة الشركة</h1>
        <p className="text-sm text-zinc-300">
          هنا يمكن لاحقًا إدارة القضايا والعقود الخاصة بالشركة، وطلبات الاستشارة، إلخ.
        </p>
      </div>
    </main>
  );
}

