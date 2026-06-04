"use client";
//app/(site)/cases/[id]/CaseAssignments.tsx
import { useState, useEffect } from "react";

type Assignment = {
  id: number;
  role: "LEAD" | "ASSISTANT";
  user: { id: number; name: string | null; email: string | null };
};

type Employee = {
  id: number;
  name: string | null;
  email: string | null;
  isManager: boolean;
};

export default function CaseAssignments({
  caseId,
  canManage,
}: {
  caseId: number;
  canManage: boolean;
}) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [selectedRole, setSelectedRole] = useState<"LEAD" | "ASSISTANT">("ASSISTANT");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const aRes = await fetch(`/api/cases/${caseId}/assignments`);
      const aData = await aRes.json();
      setAssignments(aData.items || []);

      if (canManage) {
        const eRes = await fetch(`/api/cases/${caseId}/assignable`);
        const eData = await eRes.json();
        setEmployees(eData.items || []);
      }
    } catch {
      setError("تعذّر تحميل بيانات الفريق.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addAssignment() {
    if (!selectedEmp) { setError("اختر موظفاً."); return; }
    setBusy(true); setError(null);
    try {
      const res = await fetch(`/api/cases/${caseId}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: Number(selectedEmp), role: selectedRole }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "تعذّر التكليف."); return; }
      setSelectedEmp("");
      setSelectedRole("ASSISTANT");
      await load();
    } catch {
      setError("حدث خطأ غير متوقع.");
    } finally {
      setBusy(false);
    }
  }

  async function removeAssignment(employeeId: number) {
    if (!confirm("إزالة هذا المكلّف من القضية؟")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/cases/${caseId}/assignments?employeeId=${employeeId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "تعذّرت الإزالة."); return; }
      await load();
    } catch {
      setError("حدث خطأ غير متوقع.");
    } finally {
      setBusy(false);
    }
  }

  const roleLabel = (r: string) => (r === "LEAD" ? "محامٍ رئيسي" : "مساعد");

  // الموظفون غير المكلّفين بعد (لقائمة الإضافة)
  const assignedIds = new Set(assignments.map((a) => a.user.id));
  const available = employees.filter((e) => !assignedIds.has(e.id));

  if (loading) {
    return <p className="text-xs text-zinc-500">جارٍ تحميل فريق القضية...</p>;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold">فريق القضية</h2>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/5 px-3 py-2 text-xs text-red-300">
          {error}
        </div>
      )}

      {/* قائمة المكلّفين */}
      {assignments.length === 0 ? (
        <p className="text-xs text-zinc-500">لم يُكلّف أحد بهذه القضية بعد.</p>
      ) : (
        <div className="space-y-2">
          {assignments.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-900/60 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400">
                  {a.user.name?.charAt(0) || "م"}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {a.user.name || a.user.email}
                  </div>
                  <div className="text-xs text-zinc-400">{a.user.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={
                    "text-xs px-2 py-0.5 rounded-full border " +
                    (a.role === "LEAD"
                      ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                      : "bg-blue-500/10 text-blue-300 border-blue-500/30")
                  }
                >
                  {roleLabel(a.role)}
                </span>
                {canManage && (
                  <button
                    onClick={() => removeAssignment(a.user.id)}
                    disabled={busy}
                    className="text-xs px-2 py-1 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition disabled:opacity-40"
                  >
                    إزالة
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* نموذج التكليف — للمدير/المالك فقط */}
      {canManage && (
        <div className="rounded-xl border border-emerald-500/20 bg-zinc-900/40 p-3 space-y-3">
          <h3 className="text-xs font-semibold text-emerald-300">تكليف موظف بالقضية</h3>
          {available.length === 0 ? (
            <p className="text-xs text-zinc-500">
              جميع موظفيك مكلّفون بالفعل، أو لا يوجد موظفون. أضف موظفين من لوحة المؤسسة أولاً.
            </p>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedEmp}
                onChange={(e) => setSelectedEmp(e.target.value)}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="">— اختر موظفاً —</option>
                {available.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name || emp.email}{emp.isManager ? " (مدير)" : ""}
                  </option>
                ))}
              </select>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as "LEAD" | "ASSISTANT")}
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 sm:w-40"
              >
                <option value="ASSISTANT">مساعد</option>
                <option value="LEAD">محامٍ رئيسي</option>
              </select>
              <button
                onClick={addAssignment}
                disabled={busy}
                className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-50"
              >
                {busy ? "..." : "تكليف"}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
