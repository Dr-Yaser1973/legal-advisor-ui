"use client";
import { useState } from "react";

export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [value, setValue] = useState("");

  function handleChange(e: any) {
    const q = e.target.value;
    setValue(q);

    // Debounce بسيط
    clearTimeout((window as any).sb);
    (window as any).sb = setTimeout(() => {
      onSearch(q);
    }, 300);
  }

  return (
    <input
      className="w-full border rounded-lg p-3 text-right"
      placeholder="ابحث في المكتبة..."
      value={value}
      onChange={handleChange}
    />
  );
}

