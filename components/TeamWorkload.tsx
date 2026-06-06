"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type CaseItem = { id: number; title: string; status: string; role: "LEAD" | "ASSISTANT" };
type ConsultItem = { id: number; subject: string; status: string };
type Member = {
  id: number;
  name: string | null;
  email: string | null;
  cases: CaseItem[];
  consults: ConsultItem[];
  total: number;
};

export default function TeamWorkload() {
  const [team, setTeam] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/team-workload")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => setTeam(d?.team || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-zinc-500">جارٍ تحميل توزيع المهام...</p>;
  }

  if (team.length === 0) {
    return (
      <section className="space-y-3">
        <h2 className="text-base font-semibold">توزيع المهام على الفريق</h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-center text-sm text-zinc-500">
          لا يوجد موظفون بعد. أضف موظفين لتوزيع المهام عليهم.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold">توزيع المهام على الفريق</h2>

      <div className="space-y-3">
        {team.map((m) => (
          <div key={m.id} className="rounded-xl border border-white/10 bg-zinc-900/60 p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-400">
                  {m.name?.charAt(0) || "م"}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{m.name || "موظف"}</div>
                  <div className="text-xs text-zinc-400">{m.email}</div>
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full border bg-zinc-800 text-zinc-300 border-zinc-600">
                {m.total} مهمة
              </span>
            </div>

            {m.total === 0 ? (
              <p className="text-xs text-zinc-500">لا توجد مهام مكلّف بها بعد.</p>
            ) : (
              <div className="space-y-2">
                {m.cases.map((c) => (
                  <Link
                    key={"case-" + c.id}
                    href={"/cases/" + c.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2 hover:border-emerald-500/40 transition"
                  >
                    <span className="text-xs text-zinc-200 truncate">📁 {c.title}</span>
                    <span className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] text-zinc-500">{c.status}</span>
                      <span className={"text-[10px] px-2 py-0.5 rounded-full border " + (c.role === "LEAD" ? "bg-amber-500/10 text-amber-300 border-amber-500/30" : "bg-blue-500/10 text-blue-300 border-blue-500/30")}>
                        {c.role === "LEAD" ? "رئيسي" : "مساعد"}
                      </span>
                    </span>
                  </Link>
                ))}

                {m.consults.map((c) => (
                  <Link
                    key={"consult-" + c.id}
                    href="/firm-dashboard"
                    className="flex items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2 hover:border-emerald-500/40 transition"
                  >
                    <span className="text-xs text-zinc-200 truncate">💬 {c.subject}</span>
                    <span className="text-[10px] text-zinc-500 flex-shrink-0">استشارة</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
