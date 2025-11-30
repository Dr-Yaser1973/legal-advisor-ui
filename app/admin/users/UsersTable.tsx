 "use client";

import { useState } from "react";

type UserRole =
  | "ADMIN"
  | "LAWYER"
  | "CLIENT"
  | "COMPANY"
  | "TRANSLATION_OFFICE";

type UserStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "EXPIRED";

interface UserRow {
  id: number;
  email: string;
  name: string | null;
  role: UserRole;
  status: UserStatus;
  subscriptionEndsAt: string | null; // ISO string أو null
  createdAt: string; // ISO string
}

interface UsersTableProps {
  initialUsers: UserRow[];
}

export default function UsersTable({ initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [savingId, setSavingId] = useState<number | null>(null);

  const formatDate = (iso: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
  };

  const handleFieldChange = <K extends keyof UserRow>(
    id: number,
    field: K,
    value: UserRow[K]
  ) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, [field]: value } : u))
    );
  };

  const updateUser = async (id: number) => {
    const u = users.find((x) => x.id === id);
    if (!u) return;

    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: u.role,
          status: u.status,
          subscriptionEndsAt: u.subscriptionEndsAt
            ? new Date(u.subscriptionEndsAt).toISOString()
            : null,
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(j.error || "حدث خطأ أثناء حفظ التغييرات");
        return;
      }

      const updated = await res.json().catch(() => null);
      if (updated?.id) {
        setUsers((prev) =>
          prev.map((row) =>
            row.id === id
              ? {
                  ...row,
                  role: updated.role as UserRole,
                  status: updated.status as UserStatus,
                  subscriptionEndsAt: updated.subscriptionEndsAt
                    ? String(updated.subscriptionEndsAt)
                    : null,
                }
              : row
          )
        );
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ غير متوقع");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="border border-zinc-800 rounded-2xl bg-zinc-900/70 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-zinc-900/80">
          <tr className="text-xs text-zinc-400">
            <th className="px-3 py-2 text-right">#</th>
            <th className="px-3 py-2 text-right">البريد</th>
            <th className="px-3 py-2 text-right">الاسم</th>
            <th className="px-3 py-2 text-right">الدور</th>
            <th className="px-3 py-2 text-right">الحالة</th>
            <th className="px-3 py-2 text-right">انتهاء الاشتراك</th>
            <th className="px-3 py-2 text-right">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr
              key={u.id}
              className="border-t border-zinc-800 hover:bg-zinc-900/60"
            >
              <td className="px-3 py-2 text-xs text-zinc-500">{idx + 1}</td>
              <td className="px-3 py-2 font-mono text-xs">{u.email}</td>
              <td className="px-3 py-2 text-xs">{u.name || "—"}</td>

              <td className="px-3 py-2">
                <select
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-2 py-1 text-xs"
                  value={u.role}
                  onChange={(e) =>
                    handleFieldChange(u.id, "role", e.target.value as UserRole)
                  }
                >
                  <option value="CLIENT">عميل (مستخدم عادي)</option>
                  <option value="LAWYER">محامٍ</option>
                  <option value="COMPANY">شركة</option>
                  <option value="TRANSLATION_OFFICE">مكتب ترجمة</option>
                  <option value="ADMIN">أدمن</option>
                </select>
              </td>

              <td className="px-3 py-2">
                <select
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-2 py-1 text-xs"
                  value={u.status}
                  onChange={(e) =>
                    handleFieldChange(
                      u.id,
                      "status",
                      e.target.value as UserStatus
                    )
                  }
                >
                  <option value="ACTIVE">مفعّل</option>
                  <option value="PENDING">بانتظار التفعيل</option>
                  <option value="SUSPENDED">موقوف</option>
                  <option value="EXPIRED">منتهي الاشتراك</option>
                </select>
              </td>

              <td className="px-3 py-2">
                <input
                  type="date"
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-700 px-2 py-1 text-xs"
                  value={formatDate(u.subscriptionEndsAt)}
                  onChange={(e) =>
                    handleFieldChange(
                      u.id,
                      "subscriptionEndsAt",
                      e.target.value ? e.target.value : null
                    )
                  }
                />
              </td>

              <td className="px-3 py-2 text-left">
                <button
                  onClick={() => updateUser(u.id)}
                  disabled={savingId === u.id}
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1 text-xs font-medium disabled:opacity-60"
                >
                  {savingId === u.id ? "جارٍ الحفظ..." : "حفظ التغييرات"}
                </button>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-3 py-6 text-center text-sm text-zinc-400"
              >
                لا يوجد مستخدمون حالياً.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
