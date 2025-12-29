// components/admin/AdminUsersClient.tsx
"use client";

import { useState } from "react";

type UserStatusValue = "ACTIVE" | "PENDING" | "SUSPENDED" | "EXPIRED";

type UserRoleValue =
  | "ADMIN"
  | "CLIENT"
  | "LAWYER"
  | "COMPANY"
  | "TRANSLATION_OFFICE";

type AdminUser = {
  id: number;
  name: string | null;
  email: string | null;
  role: UserRoleValue;
  status: UserStatusValue;
  isApproved: boolean;
  createdAt: string; // جاي من السيرفر كسلسلة
};

export default function AdminUsersClient({
  initialUsers,
}: {
  initialUsers: AdminUser[];
}) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [savingId, setSavingId] = useState<number | null>(null);

  async function handleApprove(userId: number) {
    if (!confirm("هل أنت متأكد من اعتماد وتفعيل هذا المستخدم؟")) return;

    try {
      setSavingId(userId);
      const res = await fetch(`/api/admin/users/${userId}/approve`, {
        method: "POST",
      });
      const json = await res.json();

      if (!res.ok || !json?.ok) {
        alert(json?.error || "تعذر اعتماد المستخدم");
        return;
      }

      // تحديث الصف في الجدول
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...json.user } : u))
      );
    } catch (err) {
      console.error("[ADMIN_APPROVE_USER]", err);
      alert("تعذر اعتماد المستخدم");
    } finally {
      setSavingId(null);
    }
  }

  async function handleUpdate(
    userId: number,
    partial: Partial<Pick<AdminUser, "role" | "status">>
  ) {
    try {
      setSavingId(userId);
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(partial),
      });
      const json = await res.json();

      if (!res.ok || !json?.ok) {
        alert(json?.error || "تعذر تحديث بيانات المستخدم");
        return;
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...json.user } : u))
      );
    } catch (err) {
      console.error("[ADMIN_UPDATE_USER_STATUS]", err);
      alert("تعذر تحديث بيانات المستخدم");
    } finally {
      setSavingId(null);
    }
  }

  if (!users.length) {
    return <p className="text-sm text-zinc-400">لا يوجد مستخدمون مسجلون بعد.</p>;
  }

  return (
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
            <th className="p-2 text-right">إجراءات</th>
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
              <td className="p-2 ltr text-left">{u.email ?? "-"}</td>

              {/* تغيير الدور */}
              <td className="p-2 text-xs">
                <select
                  className="bg-zinc-800 rounded-md px-2 py-1 text-xs"
                  value={u.role}
                  onChange={(e) =>
                    handleUpdate(u.id, {
                      role: e.target.value as UserRoleValue,
                    })
                  }
                  disabled={savingId === u.id}
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="CLIENT">CLIENT</option>
                  <option value="LAWYER">LAWYER</option>
                  <option value="COMPANY">COMPANY</option>
                  <option value="TRANSLATION_OFFICE">
                    TRANSLATION_OFFICE
                  </option>
                </select>
              </td>

              {/* تغيير الحالة */}
              <td className="p-2 text-xs">
                <select
                  className="bg-zinc-800 rounded-md px-2 py-1 text-xs"
                  value={u.status}
                  onChange={(e) =>
                    handleUpdate(u.id, {
                      status: e.target.value as UserStatusValue,
                    })
                  }
                  disabled={savingId === u.id}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="PENDING">PENDING</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="EXPIRED">EXPIRED</option>
                </select>
              </td>

              {/* مفعّل؟ */}
              <td className="p-2 text-xs">
                {u.isApproved ? (
                  <span className="text-emerald-400 font-semibold">نعم</span>
                ) : (
                  <span className="text-amber-400 font-semibold">
                    بانتظار الموافقة
                  </span>
                )}
              </td>

              {/* تاريخ الإنشاء */}
              <td className="p-2 text-xs">
                {u.createdAt
                  ? new Intl.DateTimeFormat("ar-IQ", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(u.createdAt))
                  : "-"}
              </td>

              {/* أزرار الإجراءات */}
              <td className="p-2 text-xs space-x-2 space-x-reverse">
                {!u.isApproved && (
                  <button
                    onClick={() => handleApprove(u.id)}
                    disabled={savingId === u.id}
                    className="rounded-md  bg-emerald-500
 hover:bg-emerald-400 text-black px-3 py-1 text-xs disabled:opacity-50"
                  >
                    {savingId === u.id ? "جاري الاعتماد..." : "اعتماد + تفعيل"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

