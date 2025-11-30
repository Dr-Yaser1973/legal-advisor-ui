 // app/admin/users/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import UsersTable from "./UsersTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  // لو ماكو جلسة → رجّعه للّوگن
  if (!user) {
    redirect("/login");
  }

  // لو مو أدمن → ممنوع
  if (user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  // جلب المستخدمين من قاعدة البيانات
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      subscriptionEndsAt: true,
      createdAt: true,
    },
  });

  // تحويل التواريخ إلى نصوص (JSON-safe)
  const safeUsers = users.map((u) => ({
    id: u.id,
    email: u.email ?? "",
    name: u.name ?? "",
    role: u.role,
    status: u.status,
    subscriptionEndsAt: u.subscriptionEndsAt
      ? u.subscriptionEndsAt.toISOString()
      : "",
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <header className="flex flex-col gap-2 text-right">
          <h1 className="text-3xl font-bold mb-1">إدارة المستخدمين</h1>
          <p className="text-sm text-zinc-400">
            من هذه الصفحة يمكنك تفعيل أو إيقاف الحسابات، وتغيير الأدوار بين
            عميل ومحامٍ وشركة ومكتب ترجمة، وضبط تاريخ انتهاء الاشتراك.
          </p>
        </header>

        {/* 👇 هنا نعرض الجدول فعليًا */}
        <UsersTable initialUsers={safeUsers} />
      </div>
    </main>
  );
}
