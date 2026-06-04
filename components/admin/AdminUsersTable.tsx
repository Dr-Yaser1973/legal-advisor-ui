 "use client";
// components/admin/AdminUsersTable.tsx
import { useState } from "react";
import { ChevronDown, ChevronUp, Building2, Briefcase, User2 } from "lucide-react";

type UserStatusValue = "ACTIVE" | "PENDING" | "SUSPENDED" | "EXPIRED";
 type UserRoleValue = "ADMIN" | "CLIENT" | "LAWYER" | "LAW_FIRM" | "COMPANY" | "TRANSLATION_OFFICE";
type UserPlanValue = "FREE" | "INDIVIDUAL" | "LAWYER" | "TRANSLATION" | "BUSINESS";

type LawyerProfile = {
  specialties?: string | null;
  officeAddress?: string | null;
  phone?: string | null;
  bio?: string | null;
  city?: string | null;
};

type OrgInfo = {
  id: number;
  name: string;
  type: string;
  description?: string | null;
  isApproved: boolean;
};

type BranchInfo = {
  id: number;
  name: string;
  city: string;
  address?: string | null;
  org: OrgInfo;
};

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
  phone?: string | null;
  lawyerProfile?: LawyerProfile | null;
  branch?: BranchInfo | null;
};

const PLAN_LABELS: Record<UserPlanValue, string> = {
  FREE: "مجاني", INDIVIDUAL: "أفراد", LAWYER: "محامون",
  TRANSLATION: "ترجمة", BUSINESS: "شركات",
};
const PLAN_COLORS: Record<UserPlanValue, string> = {
  FREE: "text-zinc-400", INDIVIDUAL: "text-sky-400", LAWYER: "text-violet-400",
  TRANSLATION: "text-amber-400", BUSINESS: "text-emerald-400",
};
const ORG_TYPE_LABEL: Record<string, string> = {
  LAW_FIRM: "مكتب محاماة", COMPANY: "شركة",
  GOVERNMENT: "جهة حكومية", OTHER: "أخرى",
};

// ── بطاقة تفاصيل الطلب ────────────────────────────────────────
function RequestDetails({ user }: { user: AdminUser }) {
  const isLawyer = user.role === "LAWYER" && user.lawyerProfile && !user.branch;
  const isFirm   = user.branch?.org != null;

  if (!isLawyer && !isFirm) return null;

  return (
    <div className="mt-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs space-y-1.5 text-right">
      <div className="text-amber-300 font-semibold mb-2 flex items-center gap-1">
        {isFirm ? <Building2 className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
        {isFirm ? "بيانات المؤسسة" : "بيانات المحامي"}
      </div>

      {/* محامٍ فرد */}
      {isLawyer && user.lawyerProfile && (
        <>
          {user.lawyerProfile.bio && (
            <div><span className="text-zinc-400">رقم النقابة: </span>
              <span className="text-zinc-200">{user.lawyerProfile.bio.replace("رقم هوية النقابة: ", "")}</span>
            </div>
          )}
          {user.lawyerProfile.officeAddress && (
            <div><span className="text-zinc-400">عنوان المكتب: </span>
              <span className="text-zinc-200">{user.lawyerProfile.officeAddress}</span>
            </div>
          )}
          {user.lawyerProfile.phone && (
            <div><span className="text-zinc-400">الهاتف: </span>
              <span className="text-zinc-200">{user.lawyerProfile.phone}</span>
            </div>
          )}
        </>
      )}

      {/* مكتب / شركة */}
      {isFirm && user.branch && (
        <>
          <div><span className="text-zinc-400">اسم المؤسسة: </span>
            <span className="text-zinc-200 font-semibold">{user.branch.org.name}</span>
          </div>
          <div><span className="text-zinc-400">النوع: </span>
            <span className="text-zinc-200">{ORG_TYPE_LABEL[user.branch.org.type] || user.branch.org.type}</span>
          </div>
          {user.branch.org.description && (
            <div><span className="text-zinc-400">نوع النشاط: </span>
              <span className="text-zinc-200">{user.branch.org.description.replace("نوع النشاط: ", "")}</span>
            </div>
          )}
          <div><span className="text-zinc-400">المقر: </span>
            <span className="text-zinc-200">{user.branch.city}</span>
          </div>
          {user.branch.address && (
            <div><span className="text-zinc-400">العنوان: </span>
              <span className="text-zinc-200">{user.branch.address}</span>
            </div>
          )}
          {user.phone && (
            <div><span className="text-zinc-400">الهاتف: </span>
              <span className="text-zinc-200">{user.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-zinc-400">حالة المؤسسة: </span>
            <span className={user.branch.org.isApproved ? "text-emerald-400" : "text-amber-400"}>
              {user.branch.org.isApproved ? "✓ معتمدة" : "⏳ بانتظار الاعتماد"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminUsersTable({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  async function approveUser(id: number) {
    try {
      setLoadingId(id);
      const res = await fetch(`/api/admin/users/${id}/approve`, { method: "POST" });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) { alert(json?.error || "تعذر اعتماد المستخدم."); return; }

      // اعتماد المؤسسة أيضاً إذا كان المستخدم مرتبطاً بفرع
      const user = users.find(u => u.id === id);
      if (user?.branch?.org) {
        await fetch(`/api/admin/users/${id}/approve`, { method: "POST" });
      }

      setUsers((prev) =>
        prev.map((u) => u.id === id
          ? { ...u, isApproved: true, status: json.user?.status ?? u.status,
              branch: u.branch ? { ...u.branch, org: { ...u.branch.org, isApproved: true } } : u.branch }
          : u
        )
      );
    } catch { alert("حدث خطأ أثناء اعتماد المستخدم."); }
    finally { setLoadingId(null); }
  }

  async function updateUser(id: number, data: Partial<Pick<AdminUser, "role" | "status" | "subscriptionEndsAt">>) {
    try {
      setLoadingId(id);
      const res = await fetch(`/api/admin/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) { alert(json?.error || "تعذر تحديث المستخدم."); return; }
      setUsers((prev) =>
        prev.map((u) => u.id === id
          ? { ...u, role: json.user?.role ?? u.role, status: json.user?.status ?? u.status,
              subscriptionEndsAt: json.user?.subscriptionEndsAt ?? u.subscriptionEndsAt }
          : u
        )
      );
    } catch { alert("حدث خطأ غير متوقع."); }
    finally { setLoadingId(null); }
  }

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
      if (!res.ok || !json?.ok) { alert(json?.error || "تعذر تفعيل الباقة."); return; }
      setUsers((prev) =>
        prev.map((u) => u.id === id
          ? { ...u, plan, points: json.user?.points ?? u.points,
              subscriptionEndsAt: json.user?.subscriptionEndsAt ?? u.subscriptionEndsAt }
          : u
        )
      );
      alert(`✅ تم تفعيل باقة "${PLAN_LABELS[plan]}" بنجاح.`);
    } catch { alert("حدث خطأ أثناء تفعيل الباقة."); }
    finally { setLoadingId(null); }
  }

  async function addPoints(id: number) {
    const input = prompt("كم نقطة تريد إضافة؟");
    const amount = Number(input);
    if (!input || isNaN(amount) || amount <= 0) { alert("يرجى إدخال عدد صحيح أكبر من صفر."); return; }
    try {
      setLoadingId(id);
      const res = await fetch(`/api/admin/users/${id}/points`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, reason: "manual_admin" }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) { alert(json?.error || "تعذر إضافة النقاط."); return; }
      setUsers((prev) =>
        prev.map((u) => u.id === id ? { ...u, points: json.newBalance ?? u.points + amount } : u)
      );
      alert(`✅ تمت إضافة ${amount} نقطة بنجاح.`);
    } catch { alert("حدث خطأ أثناء إضافة النقاط."); }
    finally { setLoadingId(null); }
  }

  if (users.length === 0) return <p className="text-sm text-zinc-400">لا يوجد مستخدمون مسجلون بعد.</p>;

  // فصل المعلقين عن البقية
  const pending = users.filter(u => u.status === "PENDING" && !u.isApproved);
  const others  = users.filter(u => !(u.status === "PENDING" && !u.isApproved));

  return (
    <div className="space-y-6">

      {/* ── طلبات بانتظار الموافقة ── */}
      {pending.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-amber-300 mb-3 flex items-center gap-2">
            ⏳ طلبات بانتظار الموافقة
            <span className="bg-amber-500 text-black text-xs px-2 py-0.5 rounded-full">{pending.length}</span>
          </h2>
          <div className="space-y-3">
            {pending.map((u) => {
              const isLoading = loadingId === u.id;
              const isExpanded = expandedId === u.id;
              const hasDetails = u.lawyerProfile || u.branch;

              return (
                <div key={u.id} className="rounded-xl border border-amber-500/30 bg-zinc-900/70 p-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        {u.branch ? <Building2 className="w-4 h-4 text-amber-400" /> : <User2 className="w-4 h-4 text-blue-400" />}
                        <span className="font-semibold text-white">{u.name || "—"}</span>
                        <span className="text-xs text-zinc-500">#{u.id}</span>
                      </div>
                      <div className="text-xs text-zinc-400">{u.email}</div>
                      <div className="flex gap-2 flex-wrap mt-1">
                        <span className="text-xs bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full text-zinc-300">{u.role}</span>
                        {u.branch && <span className="text-xs bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full text-amber-300">{ORG_TYPE_LABEL[u.branch.org.type]}</span>}
                        <span className="text-xs text-zinc-500">{u.createdAt ? new Intl.DateTimeFormat("ar-IQ", { dateStyle: "short", timeStyle: "short" }).format(new Date(u.createdAt)) : "—"}</span>
                      </div>

                      {/* تفاصيل الطلب */}
                      {hasDetails && isExpanded && <RequestDetails user={u} />}
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      {hasDetails && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : u.id)}
                          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition"
                        >
                          {isExpanded ? <><ChevronUp className="w-3 h-3" /> إخفاء</> : <><ChevronDown className="w-3 h-3" /> عرض البيانات</>}
                        </button>
                      )}
                      <button
                        onClick={() => approveUser(u.id)}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition disabled:opacity-40"
                      >
                        {isLoading ? "جارٍ..." : "✓ اعتماد"}
                      </button>
                      <select
                        className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs"
                        value={u.status}
                        disabled={isLoading}
                        onChange={(e) => updateUser(u.id, { status: e.target.value as UserStatusValue })}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── جدول المستخدمين ── */}
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
            {others.map((u) => {
              const isLoading = loadingId === u.id;
              return (
                <tr key={u.id} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/60">
                  <td className="p-2">{u.id}</td>
                  <td className="p-2">
                    <div>{u.name ?? "-"}</div>
                    {u.branch && <div className="text-[10px] text-amber-400">{u.branch.org.name}</div>}
                  </td>
                  <td className="p-2 text-xs">{u.email ?? "-"}</td>
                  <td className="p-2">
                      <select
  className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs"
  value={u.role}
  disabled={isLoading}
  onChange={(e) => updateUser(u.id, { role: e.target.value as UserRoleValue })}
>
  <option value="CLIENT">CLIENT</option>
  <option value="LAWYER">LAWYER</option>
  <option value="LAW_FIRM">LAW_FIRM</option>
  <option value="COMPANY">COMPANY</option>
  <option value="TRANSLATION_OFFICE">TRANSLATION_OFFICE</option>
  <option value="ADMIN">ADMIN</option>
</select>
                  </td>
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
                  <td className="p-2">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold ${PLAN_COLORS[u.plan]}`}>{PLAN_LABELS[u.plan]}</span>
                      <select
                        className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs"
                        defaultValue=""
                        disabled={isLoading}
                        onChange={(e) => { if (e.target.value) { activatePlan(u.id, e.target.value as UserPlanValue); e.target.value = ""; } }}
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
                  <td className="p-2">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-xs font-semibold text-emerald-400">{u.points} نقطة</span>
                      <button onClick={() => addPoints(u.id)} disabled={isLoading} className="px-2 py-0.5 rounded bg-zinc-700 hover:bg-zinc-600 text-xs text-zinc-200 disabled:opacity-40">+ إضافة</button>
                    </div>
                  </td>
                  <td className="p-2">
                    <input
                      type="date"
                      className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs"
                      disabled={isLoading}
                      value={u.subscriptionEndsAt ? u.subscriptionEndsAt.slice(0, 10) : ""}
                      onChange={(e) => updateUser(u.id, { subscriptionEndsAt: e.target.value ? new Date(e.target.value).toISOString() : null })}
                    />
                  </td>
                  <td className="p-2 text-xs">{u.isApproved ? "نعم" : "لا"}</td>
                  <td className="p-2">
                    <button
                      onClick={() => approveUser(u.id)}
                      disabled={u.isApproved || isLoading}
                      className="px-3 py-1 rounded bg-emerald-500 text-black text-xs font-semibold disabled:opacity-40"
                    >
                      {u.isApproved ? "معتمد" : "اعتماد"}
                    </button>
                  </td>
                  <td className="p-2 text-xs">
                    {u.createdAt ? new Intl.DateTimeFormat("ar-IQ", { dateStyle: "short", timeStyle: "short" }).format(new Date(u.createdAt)) : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
