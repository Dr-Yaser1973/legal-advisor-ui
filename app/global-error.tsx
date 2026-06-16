"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a12",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          margin: 0,
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2 style={{ color: "#c9a84c", marginBottom: "1rem" }}>
            حدث خطأ غير متوقّع
          </h2>
          <p style={{ color: "#aaa", marginBottom: "1.5rem" }}>
            نعتذر، واجه النظام مشكلة. تم إبلاغ الفريق التقني تلقائياً.
          </p>
          <button
            onClick={() => window.location.assign("/")}
            style={{
              backgroundColor: "#c9a84c",
              color: "#0a0a12",
              border: "none",
              padding: "0.75rem 2rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            العودة للرئيسية
          </button>
        </div>
      </body>
    </html>
  );
}
