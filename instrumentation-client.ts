import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === "production",

  // === Session Replay ===
  // 10% من الجلسات العادية، 100% من الجلسات التي حدث فيها خطأ
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({
      // إخفاء كل النصوص والوسائط في التسجيل (حرج لبيانات قانونية)
      maskAllText: true,
      maskAllInputs: true,
      blockAllMedia: true,
    }),
  ],
});

// لتتبّع انتقالات الصفحات (App Router)
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
