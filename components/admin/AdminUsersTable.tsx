 "use client";

import { useState } from "react";

type UserStatusValue = "ACTIVE" | "PENDING" | "SUSPENDED" | "EXPIRED";
type UserRoleValue = "ADMIN" | "CLIENT" | "LAWYER" | "COMPANY" | "TRANSLATION_OFFICE";
type UserPlanValue = "FREE" | "INDIVIDUAL" | "LAWYER" | "TRANSLATION" | "BUSINESS";

type AdminUser = {
  id: number;
  name: string | null;
  email: string | null;
  role: UserRoleValue;
  status: UserStatusValue;
  isApproved: boolean;
  subscriptionEndsAt: string | null;
  createdAt: string | null;
  plan: UserPlanValue;
  points: number;
};

const PLAN_LABELS: Record<UserPlanValue, string> = {
  FREE: "مجاني",
  INDIVIDUAL: "أفراد",
  LAWYER: "محامون",
  TRANSLATION: "ترجمة",
  BUSINESS: "شركات",
};

const PLAN_COLORS: Record<UserPlanValue, string> = {
  FREE: "text-zinc-400",
  INDIVIDUAL: "text-sky-400",
  LAWYER: "text-violet-400",
  TRANSLATION: "text-amber-400",
  BUSINESS: "text-emerald-400",
};

export default function AdminUsersTable({
  initialUsers,
}: {
  initialUsers: AdminUser[];
}) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  // ===============================
  // اعتماد المستخدم
  // ===============================
  async function approveUser(id: number) {
    try {
      setLoadingId(id);
      const res = await fetch(`/api/admin/users/${id}/approve`, { method: "POST" });
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        alert(json?.error || "تعذر اعتماد المستخدم.");
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, isApproved: true, status: json.user?.status ?? u.status }
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

  // ===============================
  // تحديث الدور / الحالة / تاريخ الاشتراك
  // ===============================
  async function updateUser(
    id: number,
    data: Partial<Pick<AdminUser, "role" | "status" | "subscriptionEndsAt">>
  ) {
    try {
      setLoadingId(id);
      const res = await fetch(`/api/admin/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        alert(json?.error || "تعذر تحديث المستخدم.");
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                role: (json.user?.role as UserRoleValue) ?? u.role,
                status: (json.user?.status as UserStatusValue) ?? u.status,
                subscriptionEndsAt: json.user?.subscriptionEndsAt ?? u.subscriptionEndsAt,
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

  // ===============================
  // تفعيل باقة للمستخدم
  // ===============================
  async function activatePlan(id: number, plan: UserPlanValue) {
    if (!confirm(`تفعيل باقة "${PLAN_LABELS[plan]}" للمستخدم #${id}؟`)) return;

    try {
      setLoadingId(id);
      const res = await fetch(`/api/admin/users/${id}/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        alert(json?.error || "تعذر تفعيل الباقة.");
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                plan: plan,
                points: json.user?.points ?? u.points,
                subscriptionEndsAt: json.user?.subscriptionEndsAt ?? u.subscriptionEndsAt,
              }
            : u
        )
      );

      alert(`✅ تم تفعيل باقة "${PLAN_LABELS[plan]}" بنجاح.`);
    } catch (err) {
      console.error("ACTIVATE_PLAN_ERROR", err);
      alert("حدث خطأ أثناء تفعيل الباقة.");
    } finally {
      setLoadingId(null);
    }
  }

  // ===============================
  // إضافة نقاط للمستخدم
  // ===============================
  async function addPoints(id: number) {
    const input = prompt("كم نقطة تريد إضافة؟");
    const amount = Number(input);

    if (!input || isNaN(amount) || amount <= 0) {
      alert("يرجى إدخال عدد صحيح أكبر من صفر.");
      return;
    }

    try {
      setLoadingId(id);
      const res = await fetch(`/api/admin/users/${id}/points`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, reason: "manual_admin" }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        alert(json?.error || "تعذر إضافة النقاط.");
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, points: json.newBalance ?? u.points + amount } : u
        )
      );

      alert(`✅ تمت إضافة ${amount} نقطة بنجاح.`);
    } catch (err) {
      console.error("ADD_POINTS_ERROR", err);
      alert("حدث خطأ أثناء إضافة النقاط.");
    } finally {
      setLoadingId(null);
    }
  }

  if (users.length === 0) {
    return <p className="text-sm text-zinc-400">لا يوجد مستخدمون مسجلون بعد.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-zinc-900/60">
      <table className="w-full text-sm">
        <thead className="bg-zinc-900/80">
          <tr className="text-zinc-300 border-b border-zinc-800">
            <th className="p-2 text-right">ID</th>
            <th className="p-2 text-right">الاسم</th>
            <th className="p-2 text-right">البريد</th>
            <th className="p-2 text-right">الدور</th>
            <th className="p-2 text-right">الحالة</th>
            <th className="p-2 text-right">الباقة</th>
            <th className="p-2 text-right">النقاط</th>
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
                <td className="p-2 text-xs">{u.email ?? "-"}</td>

                {/* الدور */}
                <td className="p-2">
                  <select
                    className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs"
                    value={u.role}
                    disabled={isLoading}
                    onChange={(e) => updateUser(u.id, { role: e.target.value as UserRoleValue })}
                  >
                    <option value="CLIENT">CLIENT</option>
                    <option value="LAWYER">LAWYER</option>
                    <option value="COMPANY">COMPANY</option>
                    <option value="TRANSLATION_OFFICE">TRANSLATION_OFFICE</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>

                {/* الحالة */}
                <td className="p-2">
                  <select
                    className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs"
                    value={u.status}
                    disabled={isLoading}
                    onChange={(e) => updateUser(u.id, { status: e.target.value as UserStatusValue })}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="EXPIRED">EXPIRED</option>
                  </select>
                </td>

                {/* الباقة */}
                <td className="p-2">
                  <div className="flex flex-col gap-1">
                    <span className={`text-xs font-semibold ${PLAN_COLORS[u.plan]}`}>
                      {PLAN_LABELS[u.plan]}
                    </span>
                    <select
                      className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs"
                      defaultValue=""
                      disabled={isLoading}
                      onChange={(e) => {
                        if (e.target.value) {
                          activatePlan(u.id, e.target.value as UserPlanValue);
                          e.target.value = "";
                        }
                      }}
                    >
                      <option value="">تفعيل باقة...</option>
                      <option value="FREE">مجاني</option>
                      <option value="INDIVIDUAL">أفراد</option>
                      <option value="LAWYER">محامون</option>
                      <option value="TRANSLATION">ترجمة</option>
                      <option value="BUSINESS">شركات</option>
                    </select>
                  </div>
                </td>

                {/* النقاط */}
                <td className="p-2">
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-xs font-semibold text-emerald-400">
                      {u.points} نقطة
                    </span>
                    <button
                      onClick={() => addPoints(u.id)}
                      disabled={isLoading}
                      className="px-2 py-0.5 rounded bg-zinc-700 hover:bg-zinc-600 text-xs text-zinc-200 disabled:opacity-40"
                    >
                      + إضافة
                    </button>
                  </div>
                </td>

                {/* تاريخ انتهاء الاشتراك */}
                <td className="p-2">
                  <input
                    type="date"
                    className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs"
                    disabled={isLoading}
                    value={u.subscriptionEndsAt ? u.subscriptionEndsAt.slice(0, 10) : ""}
                    onChange={(e) => {
                      const val = e.target.value || null;
                      updateUser(u.id, {
                        subscriptionEndsAt: val ? new Date(val).toISOString() : null,
                      });
                    }}
                  />
                </td>

                {/* مفعّل؟ */}
                <td className="p-2 text-xs">{u.isApproved ? "نعم" : "لا"}</td>

                {/* زر اعتماد */}
                <td className="p-2">
                  <button
                    onClick={() => approveUser(u.id)}
                    disabled={u.isApproved || isLoading}
                    className="px-3 py-1 rounded bg-emerald-500 text-black text-xs font-semibold disabled:opacity-40"
                  >
                    {u.isApproved ? "معتمد" : "اعتماد"}
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
