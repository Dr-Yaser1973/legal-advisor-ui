"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Scale, BookOpen, Newspaper, MessageSquare, FileText,
  Gavel, Languages, Users, DollarSign, Briefcase,
  Building2, PenTool, Settings, ChevronLeft, ChevronRight,
  LayoutDashboard, FileEdit, Shield, Globe
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

export default function Sidebar() {
  const { data: session }        = useSession();
  const pathname                 = usePathname();
  const user: any                = session?.user;
  const role: string | undefined = user?.role;

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // إغلاق الموبايل عند تغيير الصفحة
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // حفظ حالة الطي
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setCollapsed(saved === "true");
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      localStorage.setItem("sidebar-collapsed", String(!prev));
      return !prev;
    });
  }

  const isAdmin       = role === "ADMIN";
  const isLawyer      = role === "LAWYER";
  const isLawFirm     = role === "LAW_FIRM";
  const isTranslation = role === "TRANSLATION_OFFICE";
  const isCompany     = role === "COMPANY";
  const isClient      = role === "CLIENT";
  const isGuest       = !role;

  // ── روابط حسب الدور ──────────────────────────────
  const commonLinks: NavItem[] = [
    { href: "/library",  label: "المكتبة القانونية", icon: <BookOpen className="w-5 h-5" /> },
    { href: "/blog",     label: "المدونة",            icon: <Newspaper className="w-5 h-5" /> },
  ];

  const clientLinks: NavItem[] = [
    { href: "/consultations", label: "الاستشارات",       icon: <MessageSquare className="w-5 h-5" /> },
    { href: "/contracts",     label: "العقود الذكية",    icon: <FileText className="w-5 h-5" /> },
    { href: "/smart-lawyer",  label: "المحامي الذكي",    icon: <Gavel className="w-5 h-5" /> },
    { href: "/cases",         label: "إدارة القضايا",    icon: <Briefcase className="w-5 h-5" /> },
    { href: "/translate",     label: "الترجمة القانونية", icon: <Languages className="w-5 h-5" /> },
    { href: "/lawyers",       label: "المحامون",          icon: <Users className="w-5 h-5" /> },
    { href: "/pricing",       label: "الأسعار",           icon: <DollarSign className="w-5 h-5" /> },
  ];

  const lawyerLinks: NavItem[] = [
    { href: "/consultations",       label: "الاستشارات",        icon: <MessageSquare className="w-5 h-5" /> },
    { href: "/contracts",           label: "العقود الذكية",     icon: <FileText className="w-5 h-5" /> },
    { href: "/cases",               label: "إدارة القضايا",     icon: <Briefcase className="w-5 h-5" /> },
    { href: "/lawyers",             label: "المحامون",           icon: <Users className="w-5 h-5" /> },
    { href: "/lawyers/my-consults", label: "استشاراتي كمحامٍ",  icon: <Gavel className="w-5 h-5" /> },
    { href: "/blog/new",            label: "كتابة مقال",        icon: <PenTool className="w-5 h-5" />, highlight: true },
  ];

  const lawFirmLinks: NavItem[] = [
    { href: "/consultations",  label: "الاستشارات",    icon: <MessageSquare className="w-5 h-5" /> },
    { href: "/contracts",      label: "العقود الذكية", icon: <FileText className="w-5 h-5" /> },
    { href: "/cases",          label: "إدارة القضايا", icon: <Briefcase className="w-5 h-5" /> },
    { href: "/firm-dashboard", label: "لوحة المكتب",   icon: <Building2 className="w-5 h-5" />, highlight: true },
    { href: "/blog/new",       label: "كتابة مقال",    icon: <PenTool className="w-5 h-5" />,   highlight: true },
  ];

  const translationLinks: NavItem[] = [
    { href: "/translation-office",          label: "لوحة الترجمة",   icon: <LayoutDashboard className="w-5 h-5" />, highlight: true },
    { href: "/translation-office/requests", label: "الطلبات الجديدة", icon: <Globe className="w-5 h-5" /> },
  ];

  const companyLinks: NavItem[] = [
    { href: "/company-dashboard", label: "لوحة الشركة",    icon: <Building2 className="w-5 h-5" />,    highlight: true },
    { href: "/consultations",     label: "الاستشارات",     icon: <MessageSquare className="w-5 h-5" /> },
    { href: "/contracts",         label: "العقود",          icon: <FileText className="w-5 h-5" /> },
    { href: "/cases",             label: "القضايا",         icon: <Briefcase className="w-5 h-5" /> },
    { href: "/smart-lawyer",      label: "المحامي الذكي",   icon: <Gavel className="w-5 h-5" /> },
  ];

  const adminLinks: NavItem[] = [
    { href: "/consultations",      label: "الاستشارات",       icon: <MessageSquare className="w-5 h-5" /> },
    { href: "/contracts",          label: "العقود الذكية",    icon: <FileText className="w-5 h-5" /> },
    { href: "/smart-lawyer",       label: "المحامي الذكي",    icon: <Gavel className="w-5 h-5" /> },
    { href: "/cases",              label: "إدارة القضايا",    icon: <Briefcase className="w-5 h-5" /> },
    { href: "/translate",          label: "الترجمة القانونية", icon: <Languages className="w-5 h-5" /> },
    { href: "/lawyers",            label: "المحامون",          icon: <Users className="w-5 h-5" /> },
    { href: "/firm-dashboard",     label: "المكاتب",           icon: <Building2 className="w-5 h-5" /> },
    { href: "/translation-office", label: "مكاتب الترجمة",    icon: <Globe className="w-5 h-5" /> },
    { href: "/pricing",            label: "الأسعار",           icon: <DollarSign className="w-5 h-5" /> },
    { href: "/blog/new",           label: "كتابة مقال",        icon: <PenTool className="w-5 h-5" />,   highlight: true },
    { href: "/admin/blog",         label: "إدارة المدونة",     icon: <FileEdit className="w-5 h-5" />,  highlight: true },
    { href: "/admin",              label: "لوحة الأدمن",       icon: <Shield className="w-5 h-5" />,    highlight: true },
  ];

  // تحديد الروابط حسب الدور
  const roleLinks: NavItem[] =
    isAdmin       ? adminLinks       :
    isLawyer      ? lawyerLinks      :
    isLawFirm     ? lawFirmLinks     :
    isTranslation ? translationLinks :
    isCompany     ? companyLinks     :
    clientLinks;

  const allLinks = [...commonLinks, ...roleLinks];

  // ── مكوّن رابط واحد ──────────────────────────────
  function SidebarLink({ item }: { item: NavItem }) {
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

    return (
      <Link
        href={item.href}
        title={collapsed ? item.label : undefined}
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm
          ${collapsed ? "justify-center" : ""}
          ${isActive
            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
            : item.highlight
            ? "text-amber-300 hover:bg-amber-500/10"
            : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
          }
        `}
      >
        <span className="flex-shrink-0">{item.icon}</span>
        {!collapsed && (
          <span className="truncate">{item.label}</span>
        )}
      </Link>
    );
  }

  // ── الـ Sidebar الفعلي ────────────────────────────
  const sidebarContent = (
    <div className={`
      flex flex-col h-full bg-zinc-900 border-l border-zinc-800
      transition-all duration-300
      ${collapsed ? "w-16" : "w-60"}
    `}>

      {/* الشعار */}
      <div className={`flex items-center border-b border-zinc-800 py-4 px-3 ${collapsed ? "justify-center" : "gap-3"}`}>
        <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-2xl border border-emerald-400/50 bg-emerald-500/10">
          <Scale className="h-5 w-5 text-emerald-400" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-sm font-semibold truncate">المستشار القانوني</span>
            <span className="text-[10px] text-zinc-500 truncate">منصة قانونية ذكية</span>
          </div>
        )}
      </div>

      {/* الروابط */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {allLinks.map((item) => (
          <SidebarLink key={item.href} item={item} />
        ))}
      </div>

      {/* زر الطي */}
      <div className="border-t border-zinc-800 p-2">
        <button
          onClick={toggleCollapsed}
          className="w-full flex items-center justify-center p-2 rounded-xl text-zinc-500 hover:text-zinc-100 hover:bg-white/5 transition"
          title={collapsed ? "توسيع القائمة" : "طي القائمة"}
        >
          {collapsed
            ? <ChevronLeft className="w-4 h-4" />
            : <ChevronRight className="w-4 h-4" />
          }
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* ── ديسكتوب ── */}
      <aside className="hidden md:flex h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* ── موبايل: زر الفتح ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg"
      >
        <Scale className="w-5 h-5" />
      </button>

      {/* ── موبايل: Drawer ── */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="md:hidden fixed top-0 right-0 z-50 h-full w-64 flex">
            {sidebarContent}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 left-4 text-zinc-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </>
      )}
    </>
  );
}
