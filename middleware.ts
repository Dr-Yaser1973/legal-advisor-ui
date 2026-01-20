 // middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [
  "/",
  "/library",
  "/contracts",
  "/contracts/templates",
  "/contracts/generated",
  "/translate",
  "/translation",
  "/smart-lawyer",
  "/lawyers",
  "/pricing",
  "/about",
  "/privacy",
  "/terms",
  "/login",
  "/register",
  "/unauthorized",
  "/consultations",  
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/api/debug/prisma")) {
    return NextResponse.next();
  }
  // استثناء ملفات النظام والستايل
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  // استثناء مسارات الأوث نفسها
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }
  // ✅ السماح لـ API المكتبة العامة
if (pathname.startsWith("/api/library")) {
  return NextResponse.next();
}


  // مسارات عامة لا تحتاج تسجيل دخول
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // باقي المسارات → نقرأ الـ JWT
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const role = (token as any).role as
    | "ADMIN"
    | "LAWYER"
    | "CLIENT"
    | "COMPANY"
    | "TRANSLATION_OFFICE"
    | undefined;

  const status = (token as any).status as "ACTIVE" | "BLOCKED" | undefined;

  // حظر الحسابات BLOCKED
  if (status === "BLOCKED") {
    const url = req.nextUrl.clone();
    url.pathname = "/account-blocked";
    return NextResponse.redirect(url);
  }

  // ================ قواعد الصلاحيات ================ //

  // القضايا → ADMIN + LAWYER + COMPANY
  if (pathname.startsWith("/cases")) {
    if (!["ADMIN", "LAWYER", "COMPANY"].includes(role || "")) {
      const url = req.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  // لوحات المحامي الخاصة (/lawyers/my-consults, /lawyers/my-cases, /lawyer/...)
  if (
    pathname.startsWith("/lawyers/my") ||
    pathname.startsWith("/lawyer")
  ) {
    if (!["LAWYER", "ADMIN"].includes(role || "")) {
      const url = req.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  // لوحات مكتب الترجمة
  if (pathname.startsWith("/translation-office")) {
    if (!["TRANSLATION_OFFICE", "ADMIN"].includes(role || "")) {
      const url = req.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  // لوحات المستخدم العادي (إن وُجدت مثال /client/...)
  if (pathname.startsWith("/client")) {
    if (!["CLIENT", "ADMIN"].includes(role || "")) {
      const url = req.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  // لوحات الشركة
  if (pathname.startsWith("/company")) {
    if (!["COMPANY", "ADMIN"].includes(role || "")) {
      const url = req.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  // لوحة الأدمن
  if (pathname.startsWith("/admin")) {
    if (role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  // ما عدا ذلك → يكفي أن يكون مسجّل دخول
  return NextResponse.next();
}

 export const config = {
  matcher: [
    "/((?!login|register|api/register|api/auth|_next/static|_next/image|favicon.ico|library).*)",
  ],
};


