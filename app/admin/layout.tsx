// app/(admin)/layout.tsx
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scale,
  LayoutDashboard,
  BookOpen,
  Users,
  MessageCircle,
} from "lucide-react";

const adminNav = [
  {
    href: "/admin",
    label: "لوحة التحكم",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    href: "/admin/library",
    label: "إدارة المكتبة",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    href: "/admin/users",
    label: "المستخدمون والأدوار",
    icon: <Users className="h-4 w-4" />,
  },
  {
    href: "/admin/consultations",
    label: "الاستشارات",
    icon: <MessageCircle className="h-4 w-4" />,
  },
];

function NavItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
        active
          ? "bg-emerald-500/15 text-emerald-200 border border-emerald-500/60"
          : "text-zinc-300 hover:bg-zinc-800/80 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-row-reverse">
      {/* السايدبار (يمين في RTL) */}
      <aside className="w-64 border-l border-white/10 bg-zinc-900/40 backdrop-blur flex flex-col">
        {/* شعار وحالة الأدمن */}
        <div className="px-4 py-4 border-b border-white/10 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-emerald-400/50 bg-emerald-500/10">
            <Scale className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">لوحة إدارة المنصة</span>
            <span className="text-[11px] text-zinc-400">
              المستشار القانوني – ADMIN
            </span>
          </div>
        </div>

        {/* روابط التنقّل */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {adminNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={active}
              />
            );
          })}
        </nav>

        {/* تذييل بسيط */}
        <div className="px-4 py-3 border-t border-white/10 text-[11px] text-zinc-500">
          نسخة تجريبية من لوحة التحكم. يمكن توسيعها لاحقاً لإضافة المزيد من
          التقارير والإحصاءات.
        </div>
      </aside>

      {/* منطقة المحتوى الرئيسية */}
      <main className="flex-1 flex flex-col">
        {/* عنوان أعلى كل صفحات الأدمن */}
        <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">لوحة تحكم المستشار القانوني</h1>
            <p className="text-xs text-zinc-400">
              إدارة المكتبة والمستخدمين والاستشارات من مكان واحد.
            </p>
          </div>
        </header>

        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}

