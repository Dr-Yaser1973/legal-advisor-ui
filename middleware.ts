//middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";



// =========================
// المسارات العامة
// =========================
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
    "/blog",  // ← أضف هذا
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

// =========================
// Middleware الرئيسي
// =========================
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // =========================
  // استثناءات النظام
  // =========================
   if (
  pathname === "/manifest.webmanifest" ||
  pathname === "/manifest.json" ||
  pathname.startsWith("/icons/") ||
  pathname === "/favicon.ico" ||
  pathname === "/sitemap.xml" ||   // ← أضف هذا
  pathname === "/robots.txt"        // ← وهذا احترازياً
) {
  return NextResponse.next();
}

  // =========================
  // استثناءات API
  // =========================
   // =========================
// استثناءات API
// =========================
// قراءة عامة لدليل المحامين والمكاتب المعتمدة (القائمة + التفاصيل)
// الإنشاء/التعديل (POST/غير GET) يبقى محمياً بالميدلوير + تحقّق داخلي
if (
  request.method === "GET" &&
  (pathname === "/api/lawyers" ||
    /^\/api\/lawyers\/\d+$/.test(pathname) ||
    pathname === "/api/organizations")
) {
  return NextResponse.next();
}

if (
  pathname.startsWith("/api/auth") ||
  pathname.startsWith("/api/register") ||
  pathname.startsWith("/api/mobile") ||
   pathname.startsWith("/api/blog") ||
  pathname.startsWith("/api/library") ||
  pathname.startsWith("/api/contracts/templates") ||
  pathname.startsWith("/api/ocr") ||
  pathname.startsWith("/api/translation")
) {
  return NextResponse.next();
}


  // =========================
  // صفحات عامة
  // =========================
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // =========================
  // تحقق الجلسة
  // =========================
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const role = (token as any).role as
    | "ADMIN"
    | "LAWYER"
    | "CLIENT"
    | "COMPANY"
    | "LAW_FIRM"  
    | "TRANSLATION_OFFICE"
    | undefined;

  const status = (token as any).status as "ACTIVE" | "PENDING" | "SUSPENDED" | "EXPIRED" | undefined;
if (status === "SUSPENDED") {

  // =========================
  // حساب محظور
  // =========================
 if (status === "SUSPENDED") {
  const url = request.nextUrl.clone();
  url.pathname = "/account-blocked";
  return NextResponse.redirect(url);
}
}

  // =========================
  // صلاحيات القضايا
  // =========================
  if (pathname.startsWith("/cases")) {
    if (!["ADMIN", "LAWYER", "COMPANY", "LAW_FIRM"].includes(role || "")) {
      const url = request.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  // =========================
  // لوحات المحامي
  // =========================
  if (
    pathname.startsWith("/lawyers/my") ||
    pathname.startsWith("/lawyer")
  ) {
    if (!["LAWYER", "ADMIN"].includes(role || "")) {
      const url = request.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  // =========================
  // مكتب الترجمة
  // =========================
  if (pathname.startsWith("/translation-office")) {
    if (!["TRANSLATION_OFFICE", "ADMIN"].includes(role || "")) {
      const url = request.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  // =========================
  // المستخدم
  // =========================
  if (pathname.startsWith("/client")) {
    if (!["CLIENT", "ADMIN"].includes(role || "")) {
      const url = request.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  // =========================
  // الشركة
  // =========================
  if (pathname.startsWith("/company")) {
    if (!["COMPANY", "ADMIN"].includes(role || "")) {
      const url = request.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  // =========================
  // الأدمن
  // =========================
  if (pathname.startsWith("/admin")) {
    if (role !== "ADMIN") {
      const url = request.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }
// 3. إضافة حماية /dashboard
if (pathname.startsWith("/dashboard")) {
  if (!["ADMIN", "LAWYER", "CLIENT", "COMPANY", "LAW_FIRM", "TRANSLATION_OFFICE"].includes(role || "")) {
    const url = request.nextUrl.clone();
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }
}

// blog عام لكن new يحتاج تسجيل دخول
if (pathname.startsWith("/blog/new")) {
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}
  return NextResponse.next();
}

// =========================
// matcher
// =========================
 
 export const config = {
  matcher: [
    "/((?!_next|favicon.ico|sitemap.xml|robots.txt|public|api/auth|api/ocr/worker/callback).*)",
  ],
};
