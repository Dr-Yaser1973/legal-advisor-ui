 import Link from "next/link";
import { ReactNode } from "react";

type FileInfo = {
  id: number;
  filename: string;
  ext: string;
  url: string | null;
  isPdf: boolean;
  isImage: boolean;
};

type LawUnit = {
  id: number;
  title: string;
  category: "LAW" | "FIQH" | "ACADEMIC_STUDY";
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";

  files?: FileInfo[];
  hasText?: boolean;
  isScanned?: boolean;

  createdAt: string;
};

function statusBadge(status: LawUnit["status"]) {
  if (status === "PUBLISHED") {
    return (
      <span className="rounded-lg border border-emerald-700 bg-emerald-900/30 px-2 py-1 text-xs text-emerald-300">
        منشور
      </span>
    );
  }

  if (status === "DRAFT") {
    return (
      <span className="rounded-lg border border-yellow-700 bg-yellow-900/30 px-2 py-1 text-xs text-yellow-300">
        مسودة
      </span>
    );
  }

  return (
    <span className="rounded-lg border border-zinc-700 bg-zinc-900/30 px-2 py-1 text-xs text-zinc-400">
      مؤرشف
    </span>
  );
}

function contentBadges(unit: LawUnit) {
  const badges: ReactNode[] = [];

  if (unit.hasText) {
    badges.push(
      <span
        key="text"
        className="rounded-lg border border-sky-700 bg-sky-900/30 px-2 py-1 text-xs text-sky-300"
      >
        نص مستخرج
      </span>
    );
  }

  if (unit.files && unit.files.length > 0) {
    badges.push(
      <span
        key="files"
        className="rounded-lg border border-emerald-700 bg-emerald-900/30 px-2 py-1 text-xs text-emerald-300"
      >
        ملفات: {unit.files.length}
      </span>
    );
  }

  if (unit.isScanned) {
    badges.push(
      <span
        key="scan"
        className="rounded-lg border border-amber-700 bg-amber-900/30 px-2 py-1 text-xs text-amber-300"
      >
        ممسوح ضوئيًا
      </span>
    );
  }

  if (!badges.length) {
    badges.push(
      <span
        key="empty"
        className="rounded-lg border border-zinc-700 bg-zinc-900/30 px-2 py-1 text-xs text-zinc-400"
      >
        بدون مصدر
      </span>
    );
  }

  return badges;
}

export default function LawCard({ unit }: { unit: LawUnit }) {
  return (
    <Link
      href={`/library/${unit.id}`}
      className="group block rounded-2xl border border-zinc-800 bg-zinc-950 p-4 transition hover:bg-zinc-900 hover:border-emerald-700"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-emerald-400 transition">
            {unit.title}
          </h3>

          <div className="mt-1 flex flex-wrap gap-3 text-xs text-zinc-400">
            <span>
              التصنيف:{" "}
              {unit.category === "LAW"
                ? "قانون"
                : unit.category === "FIQH"
                ? "فقه"
                : "دراسات أكاديمية"}
            </span>

            <span>
              التاريخ:{" "}
              {new Date(unit.createdAt).toLocaleDateString("ar-IQ")}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {statusBadge(unit.status)}

          <div className="flex flex-wrap justify-end gap-1">
            {contentBadges(unit)}
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-zinc-500 opacity-0 group-hover:opacity-100 transition">
        📂 افتح المادة لعرض جميع الملفات والشرح والربط الذكي
      </div>
    </Link>
  );
}
