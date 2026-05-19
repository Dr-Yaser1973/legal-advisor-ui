 "use client";
// components/admin/AdminSidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, BookOpen, Users, MessageCircle,
  FileText, BarChart3, ScanText, Database, Building2,
  Languages, Settings, ChevronRight,
} from "lucide-react";

type NavLink = {
  href: string;
  label: string;
  icon: any;
  exact?: boolean;
};

type NavGroup = {
  label: string;
  links: NavLink[];
};

const groups: NavGroup[] = [
  {
    label: "الرئيسية",
    links: [
      { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "إدارة المحتوى",
    links: [
      { href: "/admin/library",          label: "المكتبة القانونية",    icon: BookOpen },
      { href: "/admin/external-sources", label: "المصادر الخارجية",     icon: Database },
    ],
  },
  {
    label: "إدارة المستخدمين",
    links: [
      { href: "/admin/users",             label: "المستخدمون والأدوار", icon: Users },
      { href: "/admin/consultations",     label: "الاستشارات",          icon: MessageCircle },
    ],
  },
  {
    label: "الإحصاءات",
    links: [
      { href: "/admin/contracts-stats",   label: "إحصاءات العقود",      icon: FileText },
      { href: "/admin/translation-stats", label: "إحصاءات الترجمة",     icon: BarChart3 },
    ],
  },
  {
    label: "الأدوات",
    links: [
      { href: "/admin/ocr",              label: "لوحة OCR",            icon: ScanText },
      { href: "/admin/translation-offices", label: "مكاتب الترجمة",    icon: Languages },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 border-l border-white/10 bg-zinc-900/90 min-h-[calc(100vh-4rem)] flex flex-col" dir="rtl">

      {/* الشعار */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <Settings className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">لوحة الإدارة</div>
            <div className="text-[10px] text-zinc-500">المستشار القانوني الذكي</div>
          </div>
        </div>
      </div>

      {/* الروابط */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-2 mb-1">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.links.map((link) => {
                const Icon = link.icon;
                const active = link.exact
                  ? pathname === link.href
                  : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all ${
                      active
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-transparent"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="flex-1">{link.label}</span>
                    {active && <ChevronRight className="h-3 w-3 opacity-50" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* الفوتر */}
      <div className="px-4 py-3 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition"
        >
          <ChevronRight className="w-3 h-3 rotate-180" />
          العودة للموقع
        </Link>
      </div>
    </aside>
  );
}
