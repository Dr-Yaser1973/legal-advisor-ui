 // app/admin/users/page.tsx
import AdminSidebar from "@/components/admin/AdminSidebar";
import { prisma } from "@/lib/prisma";

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

  return (
    <div className="flex gap-0">
      <AdminSidebar />

      <section className="flex-1 p-6 space-y-4">
        <header className="border-b border-white/10 pb-4 mb-2">
          <h1 className="text-xl font-semibold">إدارة المستخدمين والأدوار</h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            من هذه الصفحة يمكنك متابعة حسابات المستخدمين، أدوارهم في المنصة،
            وحالة الموافقة على الحساب.
          </p>
        </header>

        {users.length === 0 ? (
          <p className="text-sm text-zinc-400">لا يوجد مستخدمون مسجلون بعد.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-zinc-900/60">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900/80">
                <tr className="text-zinc-300 border-b border-zinc-800">
                  <th className="p-2 text-right">ID</th>
                  <th className="p-2 text-right">الاسم</th>
                  <th className="p-2 text-right">البريد الإلكتروني</th>
                  <th className="p-2 text-right">الدور</th>
                  <th className="p-2 text-right">الحالة</th>
                  <th className="p-2 text-right">مُفعّل؟</th>
                  <th className="p-2 text-right">تاريخ الإنشاء</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/60"
                  >
                    <td className="p-2">{u.id}</td>
                    <td className="p-2">{u.name ?? "-"}</td>
                    <td className="p-2">{u.email ?? "-"}</td>
                    <td className="p-2 text-xs">{u.role}</td>
                    <td className="p-2 text-xs">{u.status}</td>
                    <td className="p-2 text-xs">
                      {u.isApproved ? "نعم" : "لا"}
                    </td>
                    <td className="p-2 text-xs">
                      {u.createdAt
                        ? new Intl.DateTimeFormat("ar-IQ", {
                            dateStyle: "short",
                            timeStyle: "short",
                          }).format(u.createdAt)
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
