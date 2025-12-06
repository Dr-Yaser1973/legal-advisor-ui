 // app/admin/users/page.tsx
import AdminSidebar from "@/components/admin/AdminSidebar";
import { prisma } from "@/lib/prisma";
import AdminUsersClient from "@/components/admin/AdminUsersClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      isApproved: true,
      createdAt: true,
    },
  });

  // نحول createdAt إلى string لأن الكلاينت يستلم JSON
  const plainUsers = users.map((u) => ({
    ...u,
    createdAt: u.createdAt?.toISOString() ?? "",
  }));

  return (
    <div className="flex gap-0">
      <AdminSidebar />

      <section className="flex-1 p-6 space-y-4">
        <header className="border-b border-white/10 pb-4 mb-2">
          <h1 className="text-xl font-semibold">إدارة المستخدمين والأدوار</h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            من هذه الصفحة يمكنك متابعة حسابات المستخدمين، أدوارهم في المنصة،
            وحالة الموافقة على الحساب، مع إمكانية تغيير الدور والحالة وتفعيل
            الحسابات أو تعليقها.
          </p>
        </header>

        <AdminUsersClient initialUsers={plainUsers} />
      </section>
    </div>
  );
}
