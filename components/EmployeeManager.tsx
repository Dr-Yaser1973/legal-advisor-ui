//components/EmployeeManager.tsx
"use client";
import { useState, useEffect } from "react";
import { Users, Plus, Trash2, Mail, Phone } from "lucide-react";

interface Employee {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  status: string;
}

interface OrgInfo {
  id: number;
  name: string;
  maxUsers: number;
}

export default function EmployeeManager({ currentEmail }: { currentEmail?: string }) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [org, setOrg] = useState<OrgInfo | null>(null);
  const [canAddMore, setCanAddMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function fetchEmployees() {
    try {
      setLoading(true);
      const res = await fetch("/api/company/employees");
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setEmployees(data.employees || []);
      setOrg(data.org);
      setCanAddMore(data.canAddMore);
    } catch { setError("حدث خطأ أثناء تحميل البيانات."); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchEmployees(); }, []);

  async function addEmployee(e: React.FormEvent) {
    e.preventDefault();
    setAddLoading(true); setError(null);
    try {
      const res = await fetch("/api/company/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, email: newEmail, phone: newPhone, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setNewName(""); setNewEmail(""); setNewPhone(""); setNewPassword("");
      setShowAddForm(false);
      fetchEmployees();
    } catch { setError("حدث خطأ غير متوقع."); }
    finally { setAddLoading(false); }
  }

  async function removeEmployee(id: number, name: string) {
    if (!confirm(`هل تريد إيقاف تفعيل حساب ${name || "هذا الموظف"}؟`)) return;
    try {
      const res = await fetch(`/api/company/employees/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) { alert(data.error); return; }
      fetchEmployees();
    } catch { alert("حدث خطأ غير متوقع."); }
  }

  const inputCls = "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition";

  if (loading) {
    return <p className="text-sm text-zinc-500">جارٍ تحميل الموظفين...</p>;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" />
          إدارة الموظفين
          {org && (
            <span className="text-xs text-zinc-400 font-normal">
              ({employees.length} / {org.maxUsers})
            </span>
          )}
        </h2>
        {canAddMore ? (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
          >
            <Plus className="w-3 h-3" /> إضافة موظف
          </button>
        ) : (
          <span className="text-xs text-amber-400">بلغت الحد الأقصى — رقِّ الباقة لإضافة المزيد</span>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/5 p-3 text-sm text-red-300">{error}</div>
      )}

      {showAddForm && (
        <form onSubmit={addEmployee} className="rounded-xl border border-emerald-500/20 bg-zinc-900/60 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-emerald-300">إضافة موظف جديد</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">الاسم</label>
              <input className={inputCls} placeholder="اسم الموظف" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">البريد الإلكتروني *</label>
              <input type="email" className={inputCls} placeholder="email@org.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">رقم الهاتف</label>
              <input className={inputCls} placeholder="+964 7xx xxx xxxx" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">كلمة المرور *</label>
              <input type="password" className={inputCls} placeholder="6 أحرف على الأقل" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={addLoading} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition disabled:opacity-60">
              {addLoading ? "جارٍ الإضافة..." : "إضافة الموظف"}
            </button>
            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-xl border border-zinc-700 text-zinc-300 text-sm transition hover:bg-zinc-800">
              إلغاء
            </button>
          </div>
        </form>
      )}

      {employees.length === 0 ? (
        <div className="text-center py-8 text-zinc-500 text-sm">لا يوجد موظفون مضافون بعد.</div>
      ) : (
        <div className="space-y-2">
          {employees.map((emp) => (
            <div key={emp.id} className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400">
                  {emp.name?.charAt(0) || "م"}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{emp.name || "موظف"}</div>
                  <div className="flex gap-2 text-xs text-zinc-400">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{emp.email}</span>
                    {emp.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{emp.phone}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${emp.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" : "bg-red-500/10 text-red-300 border-red-500/30"}`}>
                  {emp.status === "ACTIVE" ? "نشط" : "موقوف"}
                </span>
                {emp.email !== currentEmail && (
                  <button
                    onClick={() => removeEmployee(emp.id, emp.name || "")}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
