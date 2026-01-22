 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  MessageCircle,
  FileText,
  BarChart3,
  ScanText, // ✅ OCR Icon
} from "lucide-react";

const links = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/library", label: "المكتبة القانونية", icon: BookOpen },
  { href: "/admin/users", label: "المستخدمون والأدوار", icon: Users },
  {
    href: "/admin/consultations",
    label: "الاستشارات القانونية",
    icon: MessageCircle,
  },
  {
    href: "/admin/contracts-stats",
    label: "إحصائيات العقود",
    icon: FileText,
  },
  {
    href: "/admin/translation-stats",
    label: "إحصاءات الترجمة",
    icon: BarChart3,
  },
  {
    href: "/admin/ocr",
    label: "لوحة OCR",
    icon: ScanText, // 🧠 مسح ضوئي + ذكاء
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-l border-white/10 bg-zinc-900/80 min-h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold">لوحة الإدارة</h2>
        <p className="text-xs text-zinc-400 mt-1">
          تحكم بالمكتبة، المستخدمين، والاستشارات من مكان واحد.
        </p>
      </div>

      <nav className="p-3 space-y-1 text-sm">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition
                ${
                  active
                    ? "bg-emerald-500 text-black"
                    : "text-zinc-200 hover:bg-zinc-800"
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
