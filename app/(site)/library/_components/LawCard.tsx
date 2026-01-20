 import Link from "next/link";

type LawUnit = {
  id: number;
  title: string;
  category: "LAW" | "FIQH" | "ACADEMIC_STUDY";
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  pdfUrl?: string | null;
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

export default function LawCard({ unit }: { unit: LawUnit }) {
  return (
    <Link
      href={`/library/${unit.id}`}
      className="block rounded-2xl border border-zinc-800 bg-zinc-950 p-4 transition hover:bg-zinc-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100">
            {unit.title}
          </h3>

          <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-400">
            <span>التصنيف: {unit.category}</span>
            <span>
              التاريخ:{" "}
              {new Date(unit.createdAt).toLocaleDateString("ar-IQ")}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {statusBadge(unit.status)}

          {unit.pdfUrl && (
            <span className="rounded-lg border border-emerald-700 bg-emerald-900/30 px-2 py-1 text-xs text-emerald-300">
              PDF
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
