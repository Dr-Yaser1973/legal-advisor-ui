"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type CaseTask = {
  assignmentRole: "LEAD" | "ASSISTANT";
  id: number;
  title: string;
  type: string;
  court: string;
  status: string;
  filingDate: string;
};

type ConsultTask = {
  id: number;
  subject: string;
  status: string;
  clientName: string;
  chatRoomId: number | null;
};

type Data = {
  cases: CaseTask[];
  consults: ConsultTask[];
  counts: { total: number; lead: number; assistant: number; consults: number };
};

function consultStatusLabel(s: string) {
  if (s === "PENDING") return "بانتظار الرد";
  if (s === "OFFER_SENT") return "عرض مُرسل";
  if (s === "ACCEPTED") return "مقبولة";
  if (s === "IN_PROGRESS") return "قيد التنفيذ";
  if (s === "COMPLETED") return "منجزة";
  if (s === "CANCELED") return "ملغاة";
  return s;
}

export default function MyAssignments() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/my-assignments")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-zinc-500">جارٍ تحميل مهامك...</p>;
  }

  if (!data || data.counts.total === 0) {
    return (
      <section className="space-y-3">
        <h2 className="text-base font-semibold">مهامي المكلّف بها</h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-center text-sm text-zinc-500">
          لم تُكلّف بأي قضية أو استشارة بعد.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold">مهامي المكلّف بها</h2>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center">
          <div className="text-lg font-bold text-emerald-400">{data.cases.length}</div>
          <div className="text-xs text-zinc-400 mt-1">قضايا</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center">
          <div className="text-lg font-bold text-amber-400">{data.counts.lead}</div>
          <div className="text-xs text-zinc-400 mt-1">كرئيسي</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center">
          <div className="text-lg font-bold text-blue-400">{data.counts.consults}</div>
          <div className="text-xs text-zinc-400 mt-1">استشارات</div>
        </div>
      </div>

      {data.cases.map((c) => (
        <Link
          key={"case-" + c.id}
          href={"/cases/" + c.id}
          className="block rounded-xl border border-white/10 bg-zinc-900/60 p-3 hover:border-emerald-500/40 transition"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="text-sm font-semibold text-white">{c.title}</div>
            <span className="text-xs px-2 py-0.5 rounded-full border bg-amber-500/10 text-amber-300 border-amber-500/30">
              {c.assignmentRole === "LEAD" ? "رئيسي" : "مساعد"}
            </span>
          </div>
          <div className="text-xs text-zinc-400 mt-1">{c.court} · {c.type} · {c.status}</div>
        </Link>
      ))}

      {data.consults.map((c) => (
        <Link
          key={"consult-" + c.id}
          href={c.chatRoomId ? "/firm-chat/" + c.chatRoomId : "/firm-dashboard"}
          className="block rounded-xl border border-white/10 bg-zinc-900/60 p-3 hover:border-emerald-500/40 transition"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="text-sm font-semibold text-white">{c.subject}</div>
            <span className="text-xs px-2 py-0.5 rounded-full border bg-zinc-800 text-zinc-300 border-zinc-600">
              {consultStatusLabel(c.status)}
            </span>
          </div>
          <div className="text-xs text-zinc-400 mt-1">العميل: {c.clientName}</div>
        </Link>
      ))}
    </section>
  );
}
