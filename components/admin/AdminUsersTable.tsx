 // components/admin/AdminUsersTable.tsx
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
  subscriptionEndsAt: string | null;
  createdAt: string | null;
};

export default function AdminUsersTable({
  initialUsers,
}: {
  initialUsers: AdminUser[];
}) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  async function approveUser(id: number) {
    try {
      setLoadingId(id);
      const res = await fetch(`/api/admin/users/${id}/approve`, {
        method: "POST",
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        alert(json?.error || "تعذر اعتماد المستخدم.");
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                isApproved: true,
                status: json.user?.status ?? u.status,
              }
            : u
        )
      );
    } catch (err) {
      console.error("APPROVE_USER_ERROR", err);
      alert("حدث خطأ أثناء اعتماد المستخدم.");
    } finally {
      setLoadingId(null);
    }
  }

  async function updateUser(
    id: number,
    data: Partial<Pick<AdminUser, "role" | "status" | "subscriptionEndsAt">>
  ) {
    try {
      setLoadingId(id);

      const res = await fetch(`/api/admin/users/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: data.role,
          status: data.status,
          subscriptionEndsAt: data.subscriptionEndsAt,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        console.error("UPDATE_USER_FAIL", res.status, json);
        alert(json?.error || "تعذر تحديث المستخدم (تحقق من الصلاحيات).");
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                role: (json.user?.role as UserRoleValue) ?? u.role,
                status: (json.user?.status as UserStatusValue) ?? u.status,
                subscriptionEndsAt:
                  json.user?.subscriptionEndsAt ?? u.subscriptionEndsAt,
              }
            : u
        )
      );
    } catch (err) {
      console.error("UPDATE_USER_ERROR", err);
      alert("حدث خطأ غير متوقع أثناء التحديث.");
    } finally {
      setLoadingId(null);
    }
  }

  if (users.length === 0) {
    return (
      <p className="text-sm text-zinc-400">لا يوجد مستخدمون مسجلون بعد.</p>
    );
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
            <th className="p-2 text-right">تاريخ الانتهاء</th>
            <th className="p-2 text-right">مُفعّل؟</th>
            <th className="p-2 text-right">إجراءات</th>
            <th className="p-2 text-right">تاريخ الإنشاء</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const isLoading = loadingId === u.id;
            return (
              <tr
                key={u.id}
                className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/60"
              >
                <td className="p-2">{u.id}</td>
                <td className="p-2">{u.name ?? "-"}</td>
                <td className="p-2">{u.email ?? "-"}</td>

                {/* الدور */}
                <td className="p-2 text-xs">
                  <select
                    className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs"
                    value={u.role}
                    disabled={isLoading}
                    onChange={(e) =>
                      updateUser(u.id, {
                        role: e.target.value as UserRoleValue,
                      })
                    }
                  >
                    <option value="CLIENT">CLIENT</option>
                    <option value="LAWYER">LAWYER</option>
                    <option value="COMPANY">COMPANY</option>
                    <option value="TRANSLATION_OFFICE">
                      TRANSLATION_OFFICE
                    </option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>

                {/* الحالة */}
                <td className="p-2 text-xs">
                  <select
                    className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs"
                    value={u.status}
                    disabled={isLoading}
                    onChange={(e) =>
                      updateUser(u.id, {
                        status: e.target.value as UserStatusValue,
                      })
                    }
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="EXPIRED">EXPIRED</option>
                  </select>
                </td>

                {/* تاريخ انتهاء الاشتراك */}
                <td className="p-2 text-xs">
                  <input
                    type="date"
                    className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs"
                    disabled={isLoading}
                    value={
                      u.subscriptionEndsAt
                        ? u.subscriptionEndsAt.slice(0, 10)
                        : ""
                    }
                    onChange={(e) => {
                      const val = e.target.value || null;
                      updateUser(u.id, {
                        subscriptionEndsAt: val
                          ? new Date(val).toISOString()
                          : null,
                      });
                    }}
                  />
                </td>

                {/* مفعّل؟ */}
                <td className="p-2 text-xs">
                  {u.isApproved ? "نعم" : "لا"}
                </td>

                {/* زر اعتماد */}
                <td className="p-2 text-xs">
                  <button
                    onClick={() => approveUser(u.id)}
                    disabled={u.isApproved || isLoading}
                    className="px-3 py-1 rounded bg-emerald-500 text-black text-xs font-semibold disabled:opacity-40"
                  >
                    {u.isApproved ? "معتمد" : "اعتماد + تفعيل"}
                  </button>
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
