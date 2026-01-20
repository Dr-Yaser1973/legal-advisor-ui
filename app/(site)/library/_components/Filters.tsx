"use client";

type Section = "ALL" | "LAW" | "FIQH" | "ACADEMIC_STUDY";
type Mode = "hybrid" | "fts" | "simple";

export function Filters({
  section,
  setSection,
  mode,
  setMode,
}: {
  section: Section;
  setSection: (v: Section) => void;
  mode: Mode;
  setMode: (v: Mode) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Chip active={section === "ALL"} onClick={() => setSection("ALL")}>الكل</Chip>
        <Chip active={section === "LAW"} onClick={() => setSection("LAW")}>قوانين</Chip>
        <Chip active={section === "FIQH"} onClick={() => setSection("FIQH")}>فقه</Chip>
        <Chip active={section === "ACADEMIC_STUDY"} onClick={() => setSection("ACADEMIC_STUDY")}>دراسات</Chip>
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <span className="hidden sm:inline">وضع البحث:</span>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 outline-none"
        >
          <option value="hybrid">هجين (أفضل)</option>
          <option value="fts">FTS فقط</option>
          <option value="simple">بسيط فقط</option>
        </select>
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-2xl border px-4 py-2 text-sm",
        active
          ? "border-zinc-200 bg-zinc-200 text-zinc-900"
          : "border-zinc-800 bg-zinc-950 text-zinc-200 hover:border-zinc-600",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

