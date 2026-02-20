//components/admin/AdminServiceBar.tsx
"use client";

import Link from "next/link";
import {
  BookOpen,
  Database,
  Users,
  MessageCircle,
  ScanText,
  Brain,
  Home,
  Briefcase,
  Scale,
} from "lucide-react";

export default function AdminServiceBar() {
  const adminServices = [
    {
      href: "/admin/library",
      label: "إدارة المكتبة",
      icon: BookOpen,
    },
    {
      href: "/admin/external-sources",
      label: "مصادر خارجية",
      icon: Database,
    },
    {
      href: "/admin/users",
      label: "المستخدمون",
      icon: Users,
    },
    {
      href: "/admin/consultations",
      label: "استشارات (إدارة)",
      icon: MessageCircle,
    },
    {
      href: "/admin/ocr",
      label: "OCR",
      icon: ScanText,
      disabled: true,
    },
    {
      href: "/admin/ai-usage",
      label: "AI Usage",
      icon: Brain,
      disabled: true,
    },
  ];

  const siteServices = [
    {
      href: "/",
      label: "الرئيسية",
      icon: Home,
    },
    {
      href: "/consultations",
      label: "الاستشارات",
      icon: Briefcase,
    },
    {
      href: "/lawyers",
      label: "المحامون",
      icon: Users,
    },
    {
      href: "/library",
      label: "المكتبة العامة",
      icon: Scale,
    },
  ];

  return (
    <div className="sticky top-14 z-10 border-b border-white/10 bg-zinc-950/90 backdrop-blur">
      <div className="container mx-auto max-w-6xl px-4 py-2 space-y-2">

        {/* ===== قسم الإدارة ===== */}
        <div className="flex gap-2 overflow-x-auto">
          {adminServices.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.disabled ? "#" : s.href}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-xl text-sm
                  border border-white/10
                  ${
                    s.disabled
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-white/5 hover:border-emerald-500/60"
                  }
                `}
              >
                <Icon className="w-4 h-4 text-emerald-400" />
                <span className="whitespace-nowrap">{s.label}</span>
              </Link>
            );
          })}
        </div>

        {/* ===== فاصل بصري ===== */}
        <div className="h-px bg-white/10" />

        {/* ===== قسم المنصة ===== */}
        <div className="flex gap-2 overflow-x-auto">
          {siteServices.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.href}
                className="
                  flex items-center gap-2 px-3 py-2 rounded-xl text-sm
                  border border-white/10
                  hover:bg-white/5 hover:border-indigo-500/60
                "
              >
                <Icon className="w-4 h-4 text-indigo-400" />
                <span className="whitespace-nowrap">{s.label}</span>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}

