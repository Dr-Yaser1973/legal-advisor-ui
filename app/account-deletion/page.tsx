// app/account-deletion/page.tsx
// صفحة عامة لشرح إجراء حذف الحساب — مطلوبة من Google Play (Data safety)
// الرابط بعد النشر: https://smartlegaladvisor.com/account-deletion

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حذف الحساب | المستشار القانوني",
  description:
    "تعليمات حذف حسابك وبياناتك بالكامل من تطبيق ومنصة المستشار القانوني.",
};

export default function AccountDeletionPage() {
  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#0f1923",
        color: "#e8eef2",
        display: "flex",
        justifyContent: "center",
        padding: "48px 20px",
        fontFamily:
          "'Segoe UI', Tahoma, 'Noto Kufi Arabic', Arial, sans-serif",
        lineHeight: 1.9,
      }}
    >
      <article
        style={{
          maxWidth: 760,
          width: "100%",
          background: "#13202c",
          border: "1px solid #1e2f3d",
          borderRadius: 16,
          padding: "40px 32px",
        }}
      >
        <h1
          style={{
            color: "#c9a84c",
            fontSize: 28,
            marginBottom: 8,
            fontWeight: 700,
          }}
        >
          حذف الحساب والبيانات
        </h1>
        <p style={{ color: "#8fa3b0", marginTop: 0, marginBottom: 28 }}>
          تطبيق ومنصة المستشار القانوني
        </p>

        <p>
          نحترم حقّك الكامل في التحكّم ببياناتك. يمكنك حذف حسابك وجميع بياناتك
          المرتبطة به نهائياً في أي وقت، مباشرةً من داخل التطبيق.
        </p>

        <h2 style={sectionStyle}>خطوات حذف الحساب</h2>
        <ol style={{ paddingRight: 20, margin: 0 }}>
          <li>افتح تطبيق «المستشار القانوني» وسجّل الدخول إلى حسابك.</li>
          <li>انتقل إلى صفحة «حسابي».</li>
          <li>اضغط على زر «حذف الحساب».</li>
          <li>أكّد العملية عند طلب التأكيد.</li>
        </ol>

        <h2 style={sectionStyle}>ما الذي يتم حذفه</h2>
        <p>
          عند تأكيد الحذف، يُحذف حسابك وكل بياناتك المرتبطة به{" "}
          <strong style={{ color: "#4caf82" }}>نهائياً وبشكل فوري</strong> من
          التطبيق والمنصة معاً، ويشمل ذلك:
        </p>
        <ul style={{ paddingRight: 20, margin: 0 }}>
          <li>بيانات الحساب الشخصية (الاسم والبريد الإلكتروني).</li>
          <li>سجلّ الاستشارات والمحادثات.</li>
          <li>القضايا والمستندات المرتبطة بحسابك.</li>
          <li>أي بيانات أخرى مخزّنة تخصّ حسابك.</li>
        </ul>

        <p style={{ marginTop: 24 }}>
          الحذف نهائي ولا يمكن التراجع عنه، ولا نحتفظ بأي نسخة من بياناتك بعد
          إتمام العملية.
        </p>

        <h2 style={sectionStyle}>هل تحتاج مساعدة؟</h2>
        <p style={{ marginBottom: 0 }}>
          إذا واجهت أي صعوبة في حذف حسابك، تواصل معنا عبر البريد:{" "}
          <a
            href="mailto:support@smartlegaladvisor.com"
            style={{ color: "#c9a84c", textDecoration: "none" }}
          >
            support@smartlegaladvisor.com
          </a>
        </p>
      </article>
    </main>
  );
}

const sectionStyle: React.CSSProperties = {
  color: "#c9a84c",
  fontSize: 20,
  marginTop: 32,
  marginBottom: 12,
  fontWeight: 600,
};

