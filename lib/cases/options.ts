// lib/cases/options.ts
// مصدر موحّد لمفردات القضايا — يستخدمه الإنشاء والفلاتر والعرض معاً
// (كانت مفردات النوع متضاربة بين نموذج الإنشاء وفلتر القائمة فلا يطابق أيٌّ منهما الآخر).

export const CASE_TYPES = [
  "مدنية",
  "جزائية",
  "تجارية",
  "عمالية",
  "أحوال شخصية",
  "إدارية",
  "عقارية",
  "أخرى",
] as const;

export const CASE_STATUSES = [
  "مفتوحة",
  "قيد المتابعة",
  "مؤجّلة",
  "محجوزة للحكم",
  "مغلقة",
] as const;

export const CASE_VISIBILITY_OPTIONS = [
  { value: "PRIVATE", label: "خاصة بي فقط" },
  { value: "ORG", label: "مشتركة مع الشركة (اطّلاع)" },
  { value: "BRANCH", label: "مشتركة مع الفرع (اطّلاع)" },
] as const;

export function caseStatusColor(status: string): string {
  switch (status) {
    case "مفتوحة":
      return "bg-emerald-500/10 text-emerald-300 border-emerald-500/40";
    case "قيد المتابعة":
      return "bg-amber-500/10 text-amber-300 border-amber-500/40";
    case "مؤجّلة":
      return "bg-orange-500/10 text-orange-300 border-orange-500/40";
    case "محجوزة للحكم":
      return "bg-blue-500/10 text-blue-300 border-blue-500/40";
    case "مغلقة":
      return "bg-zinc-500/10 text-zinc-200 border-zinc-400/40";
    default:
      return "bg-zinc-500/10 text-zinc-200 border-zinc-400/40";
  }
}
