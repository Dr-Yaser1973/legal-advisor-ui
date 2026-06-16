"use client";

export default function SentryTestPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a12",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
        gap: "1.5rem",
      }}
    >
      <h1 style={{ color: "#c9a84c" }}>اختبار Sentry</h1>
      <p style={{ color: "#aaa" }}>
        اضغط الزر لرمي خطأ متعمّد والتأكّد من وصوله إلى Sentry
      </p>
      <button
        onClick={() => {
          throw new Error("اختبار Sentry — خطأ متعمّد من الويب");
        }}
        style={{
          backgroundColor: "#c9a84c",
          color: "#0a0a12",
          border: "none",
          padding: "0.75rem 2rem",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "1rem",
        }}
      >
        ارمِ خطأ تجريبياً
      </button>
    </div>
  );
}
