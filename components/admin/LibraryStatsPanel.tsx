"use client";

import { useEffect, useState } from "react";
import { Users, BookOpen, FileText, TrendingUp, RefreshCcw } from "lucide-react";

 type Stats = {
  totalUnits: number;
  totalDocs: number;
  totalUsers: number;
  libraryUsers: number;
  anonUsers: number;
  totalLibraryUsers: number;
  reindexCount: number;
};


export default function LibraryStatsPanel() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/library/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setStats(d.stats);
      });
  }, []);

  if (!stats) {
    return (
      <div className="text-sm text-zinc-400">
        جارٍ تحميل الإحصائيات...
      </div>
    );
  }

  const Card = ({
    label,
    value,
    icon: Icon,
  }: {
    label: string;
    value: number;
    icon: any;
  }) => (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 flex items-center gap-3">
      <Icon className="text-emerald-400" size={20} />
      <div>
        <div className="text-xs text-zinc-400">{label}</div>
        <div className="text-xl font-bold text-zinc-100">
          {value}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      <Card label="المواد القانونية" value={stats.totalUnits} icon={BookOpen} />
      <Card label="ملفات PDF" value={stats.totalDocs} icon={FileText} />
      <Card label="المستخدمون" value={stats.totalUsers} icon={Users} />
      <Card
        label="مستخدمو المكتبة"
        value={stats.libraryUsers}
        icon={TrendingUp}
      />
      <Card
        label="إعادة الفهرسة"
        value={stats.reindexCount}
        icon={RefreshCcw}
      />
      <Card
  label="زوار مجهولون"
  value={stats.anonUsers}
  icon={Users}
/>
<Card
  label="إجمالي مستخدمي المكتبة"
  value={stats.totalLibraryUsers}
  icon={TrendingUp}
/>

    </div>
  );
}

