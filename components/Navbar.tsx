 // components/Navbar.tsx
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const user: any = session?.user;
  const role: string | undefined = user?.role;

  const isLawyer = role === "LAWYER";
  const isAdmin = role === "ADMIN";

  return (
    <nav className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-black/30 bg-black/20 border-b border-white/10">
      <div className="container mx-auto max-w-6xl px-4 md:px-6 h-14 flex items-center justify-between">

        {/* شعار المنصّة */}
        <div className="text-white font-semibold">
          <Link href="/" className="hover:opacity-90">
            المستشار القانوني ⚖️
          </Link>
        </div>

        {/* الروابط */}
        <div className="flex items-center gap-5 text-sm text-white/80">

          {/* أقسام الصفحة الرئيسية */}
          <a href="#features" className="hover:text-white hidden sm:inline">
            المزايا
          </a>
          <a href="#about" className="hover:text-white hidden sm:inline">
            حولنا
          </a>
          <a href="#contact" className="hover:text-white hidden sm:inline">
            تواصل
          </a>

          {/* روابط المنصّة */}
          <Link href="/consultations" className="hover:text-white">
            الاستشارات
          </Link>

          <Link href="/lawyers" className="hover:text-white">
            المحامون
          </Link>

          {/* للمحامي فقط */}
          {(isLawyer || isAdmin) && (
            <Link
              href="/lawyers/my-consults"
              className="hover:text-white"
            >
              استشاراتي كمحامٍ
            </Link>
          )}

          {/* رابط الأدمن */}
          {isAdmin && (
            <Link
              href="/admin"
              className="hover:text-white font-semibold text-amber-300"
            >
              لوحة الأدمن 🔑
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
