// lib/lawCategories.ts

export type LawCategoryKey = "LAW" | "FIQH" | "ACADEMIC_STUDY";

export const LAW_CATEGORIES: { key: LawCategoryKey; label: string }[] = [
  { key: "LAW", label: "قانون عراقي" },
  { key: "FIQH", label: "كتاب فقهي" },
  { key: "ACADEMIC_STUDY", label: "دراسة أكاديمية" },
];

export function categoryLabel(key?: string | null) {
  const found = LAW_CATEGORIES.find((c) => c.key === key);
  if (found) return found.label;
  return "مواد قانونية";
}

