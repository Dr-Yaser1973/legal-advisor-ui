//middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_HEADER,
  LOCALE_PARAM,
  resolveLocale,
  type Locale,
} from "@/lib/i18n/config";

// =========================
// اللغة
// =========================
// نقرأ اللغة من ?lang= ثم من الكوكي، ونمرّرها للخادم كترويسة request
// حتى يستطيع app/layout.tsx ضبط <html lang dir> أثناء التصيير على الخادم.
// هذا ما يجعل النسخة الإنجليزية قابلة للفهرسة فعلياً.
function detectLocale(request: NextRequest): Locale {
  return resolveLocale(
    request.nextUrl.searchParams.get(LOCALE_PARAM) ??
      request.cookies.get(LOCALE_COOKIE)?.value,
  );
}

function withLocale(request: NextRequest, locale: Locale) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);

  const res = NextResponse.next({ request: { headers: requestHeaders } });

  // نثبّت الاختيار في كوكي ليصمد عبر التنقّل والزيارات اللاحقة
  if (request.cookies.get(LOCALE_COOKIE)?.value !== locale) {
    res.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  }

  return res;
}



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
  "/how-to-use",
  "/about",
  "/privacy",
  "/terms",
  "/disclaimer",
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
  pathname === "/robots.txt" ||       // ← وهذا احترازياً
  pathname === "/privacy-policy.html" // ← ملف ثابت عام (سياسة خصوصية اللعبة) يجب أن يفتحه الجميع بلا تسجيل دخول
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
    pathname === "/api/organizations" ||
    pathname === "/api/promo-banners")
) {
  return NextResponse.next();
}

// تتبّع أداء الإعلانات (POST beacon عام) — مسارات فرعية فقط، لا تشمل /api/admin
if (/^\/api\/promo-banners\/\d+\/track$/.test(pathname)) {
  return NextResponse.next();
}

// تتبّع مصادر الزوّار (POST beacon عام من كل الصفحات) — قراءة الإحصاءات تبقى محميّة داخل /api/admin
if (pathname.startsWith("/api/track")) {
  return NextResponse.next();
}

if (
  pathname.startsWith("/api/auth") ||
  pathname.startsWith("/api/register") ||
  pathname.startsWith("/api/mobile") ||
  pathname.startsWith("/api/cron") ||
   pathname.startsWith("/api/blog") ||
  pathname.startsWith("/api/library") ||
  pathname.startsWith("/api/contracts/templates") ||
  pathname.startsWith("/api/ocr") ||
  pathname.startsWith("/api/translation")
) {
  return NextResponse.next();
}


  // =========================
  // اللغة (صفحات فقط — لا تمسّ مسارات API أعلاه)
  // =========================
  const locale = detectLocale(request);

  // =========================
  // صفحات عامة
  // =========================
  if (isPublicPath(pathname)) {
    return withLocale(request, locale);
  }

  // =========================
  // تحقق الجلسة
  // =========================
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    // مسارات API: أعِد 401 JSON (لا تحويل إلى صفحة HTML) كي تعمل معالجات
    // العميل (مثل 401 → تسجيل دخول Google) بدل خطأ عام مبهم.
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "غير مصرح. يرجى تسجيل الدخول." },
        { status: 401 }
      );
    }
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

  // =========================
  // حساب محظور
  // =========================
  if (status === "SUSPENDED") {
    const url = request.nextUrl.clone();
    url.pathname = "/account-blocked";
    return NextResponse.redirect(url);
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
  return withLocale(request, locale);
}

// =========================
// matcher
// =========================
 
 export const config = {
  matcher: [
    "/((?!_next|favicon.ico|sitemap.xml|robots.txt|public|api/auth|api/ocr/worker/callback).*)",
  ],
};
