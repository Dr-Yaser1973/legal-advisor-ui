import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // أداء: 10% في الإنتاج، 100% أثناء التطوير
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  environment: process.env.NODE_ENV,

  // لا ترسل أخطاء أثناء التطوير المحلي إلى Sentry
  enabled: process.env.NODE_ENV === "production",

  // === تنقية البيانات الحسّاسة قبل الإرسال (حرج لمنصة قانونية) ===
  beforeSend(event) {
    // إزالة محتوى الطلبات الذي قد يحوي بيانات استشارة أو عقود
    if (event.request) {
      delete event.request.data;
      delete event.request.cookies;
      if (event.request.headers) {
        delete event.request.headers["authorization"];
        delete event.request.headers["cookie"];
      }
    }

    // إبقاء معرّف المستخدم ودوره فقط، حذف الإيميل والاسم
    if (event.user) {
      event.user = {
        id: event.user.id,
        // نحتفظ بالدور للتشخيص، لا بالهوية الشخصية
        ...(event.user.role ? { role: event.user.role } : {}),
      };
    }

    return event;
  },

  // تنقية إضافية: حذف أي قيم تطابق أنماطاً حسّاسة من breadcrumbs
  beforeBreadcrumb(breadcrumb) {
    if (breadcrumb.category === "console") return null; // لا تسجّل console
    if (breadcrumb.data?.url) {
      // إخفاء أي tokens في عناوين URL
      breadcrumb.data.url = breadcrumb.data.url.replace(
        /([?&](token|key|secret|password)=)[^&]+/gi,
        "$1[REDACTED]"
      );
    }
    return breadcrumb;
  },
});
