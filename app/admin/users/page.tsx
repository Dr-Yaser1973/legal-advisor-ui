 // app/admin/users/page.tsx
import AdminSidebar from "@/components/admin/AdminSidebar";
import { prisma } from "@/lib/prisma";
import AdminUsersTable from "@/components/admin/AdminUsersTable";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session: any = await getServerSession(authOptions as any);
  const user = session?.user as any;

  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/unauthorized");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      isApproved: true,
      subscriptionEndsAt: true,
      createdAt: true,
    },
  });

  // تحويل التواريخ إلى string لأن الكلاينت لا يستقبل Date
  const plainUsers = users.map((u) => ({
    ...u,
    createdAt: u.createdAt?.toISOString() ?? null,
    subscriptionEndsAt: u.subscriptionEndsAt
      ? u.subscriptionEndsAt.toISOString()
      : null,
  }));

  return (
    <div className="flex gap-0">
      <AdminSidebar />

      <section className="flex-1 p-6 space-y-4">
        <header className="border-b border-white/10 pb-4 mb-2">
          <h1 className="text-xl font-semibold">إدارة المستخدمين والأدوار</h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            من هذه الصفحة يمكنك إدارة حسابات المستخدمين، تعيين الأدوار،
            التحكم بالحالة، وتحديد تاريخ انتهاء الاشتراك.
          </p>
        </header>

        <AdminUsersTable initialUsers={plainUsers} />
      </section>
    </div>
  );
}
