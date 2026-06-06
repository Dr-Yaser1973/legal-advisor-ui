"use client";
import { useState } from "react";

type Employee = { id: number; name: string | null; email: string | null };

export default function ConsultAssignButton({ requestId }: { requestId: number }) {
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    if (!open && employees.length === 0) {
      setLoading(true);
      try {
        const res = await fetch("/api/company/employees");
        const data = await res.json();
        if (res.ok) setEmployees(data.employees || []);
      } finally {
        setLoading(false);
      }
    }
    setOpen(!open);
  }

  async function assign() {
    if (!selected) { setError("اختر موظفاً."); return; }
    setError(null);
    try {
      const res = await fetch("/api/firm-consult/" + requestId + "/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: Number(selected) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "تعذّر التكليف."); return; }
      setDone(true);
      setOpen(false);
    } catch {
      setError("حدث خطأ غير متوقع.");
    }
  }

  if (done) {
    return <span className="text-xs text-emerald-300">✓ تم تكليف الموظف</span>;
  }

  return (
    <div className="inline-block">
      <button
        onClick={toggle}
        className="text-xs px-3 py-1 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
      >
        {open ? "إلغاء" : "تكليف موظف"}
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-2 bg-zinc-900/80 border border-zinc-700 rounded-lg p-2">
          {loading ? (
            <span className="text-xs text-zinc-500">جارٍ تحميل الموظفين...</span>
          ) : employees.length === 0 ? (
            <span className="text-xs text-zinc-500">لا يوجد موظفون. أضفهم من لوحتك أولاً.</span>
          ) : (
            <>
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="">— اختر موظفاً —</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name || emp.email}
                  </option>
                ))}
              </select>
              <button
                onClick={assign}
                className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition"
              >
                تكليف
              </button>
            </>
          )}
          {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
      )}
    </div>
  );
}
