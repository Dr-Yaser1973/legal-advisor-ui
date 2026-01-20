 import Link from "next/link";

/* =========================
   أنواع مرنة (قديم + جديد)
========================= */
type LegacyRelation = {
  id: number;
  type: string;
  note?: string | null;
  to: {
    id: number;
    title: string;
    section: string;
  };
};

type NewRelation = {
  id: number;
  type: string;
  note?: string | null;
  toId: number;
  toTitle: string;
  toCategory: string;
  direction?: "IN" | "OUT";
};

type Relation = LegacyRelation | NewRelation;

export function RelationsPanel({
  relations,
}: {
  relations: Relation[];
}) {
  if (!relations?.length) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">
        لا توجد علاقات مسجلة لهذه المادة بعد.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {relations.map((r) => {
        // =========================
        // دعم الشكلين
        // =========================
        const isNew = "toId" in r;

        const toId = isNew ? r.toId : r.to.id;
        const toTitle = isNew ? r.toTitle : r.to.title;
        const toCategory = isNew
          ? r.toCategory
          : r.to.section;

        const direction =
          isNew && r.direction
            ? r.direction === "OUT"
              ? "↦ يشير إلى"
              : "↤ مُشار إليه من"
            : null;

        return (
          <div
            key={r.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm text-zinc-400">
                {labelType(r.type)}
                {direction && (
                  <span className="ml-2 text-xs text-zinc-500">
                    {direction}
                  </span>
                )}
              </div>

              <div className="text-xs text-zinc-500">
                {toCategory}
              </div>
            </div>

            <Link
              href={`/library/${toId}`}
              className="mt-1 block text-lg font-semibold text-zinc-100 hover:underline"
            >
              {toTitle}
            </Link>

            {r.note && (
              <div className="mt-2 text-sm text-zinc-300">
                {r.note}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function labelType(t: string) {
  switch (t) {
    case "AMENDS":
      return "تعديل";
    case "REPEALS":
      return "إلغاء";
    case "INTERPRETS":
      return "تفسير";
    case "REFERENCES":
      return "إحالة";
    case "APPLIES_TO":
      return "ينطبق على";
    default:
      return "علاقة";
  }
}
