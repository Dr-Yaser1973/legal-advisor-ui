 "use client";

import * as React from "react";

export type TabItem<T extends string> = {
  key: T;
  label: string;
};

export function Tabs<T extends string>({
  active,
  setActive,
  items,
}: {
  active: T;
  setActive: React.Dispatch<React.SetStateAction<T>>;
  items: TabItem<T>[];
}) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-2">
      {items.map((item) => {
        const isActive = item.key === active;

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => setActive(item.key)}
            className={`rounded-lg px-3 py-1.5 text-sm transition
              ${
                isActive
                  ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700"
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
              }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
