 // lib/mailer.ts
import nodemailer from "nodemailer";

// ===============================
// التحقق من المتغيرات
// ===============================
if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD must be set in environment variables");
}

const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ===============================
// إيميل ترحيب — CLIENT
// ===============================
export async function sendWelcomeEmail(email: string, name?: string) {
  await mailer.sendMail({
    from: `"المستشار القانوني الذكي" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "مرحباً بك في المستشار القانوني الذكي",
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">مرحباً ${name ?? "بك"} 👋</h2>
        <p>تم إنشاء حسابك بنجاح في منصة <strong>المستشار القانوني الذكي</strong>.</p>
        <p>يمكنك الآن:</p>
        <ul>
          <li>تصفح المكتبة القانونية</li>
          <li>الحصول على استشارة قانونية ذكية</li>
          <li>إنشاء العقود القانونية</li>
        </ul>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/login" 
           style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 16px;">
          تسجيل الدخول
        </a>
        <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">
          إذا لم تقم بإنشاء هذا الحساب، يرجى تجاهل هذا البريد.
        </p>
      </div>
    `,
  });
}

// ===============================
// إيميل قيد المراجعة — LAWYER / LAW_FIRM / COMPANY
// ===============================
export async function sendPendingReviewEmail(email: string, name?: string) {
  await mailer.sendMail({
    from: `"المستشار القانوني الذكي" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "تم استلام طلب تسجيلك — قيد المراجعة",
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">شكراً ${name ?? "لك"} على التسجيل ⏳</h2>
        <p>تم استلام طلب تسجيلك في منصة <strong>المستشار القانوني الذكي</strong>.</p>
        <p>سيقوم فريقنا بمراجعة بياناتك وتفعيل حسابك خلال:</p>
        <p style="font-size: 24px; font-weight: bold; color: #f59e0b; text-align: center;">
          24 - 48 ساعة
        </p>
        <p>ستصلك رسالة على هذا البريد الإلكتروني فور تفعيل حسابك.</p>
        <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">
          إذا لم تقم بإنشاء هذا الحساب، يرجى تجاهل هذا البريد.
        </p>
      </div>
    `,
  });
}

// ===============================
// إيميل تفعيل الحساب
// ===============================
export async function sendApprovalEmail(email: string, name?: string) {
  await mailer.sendMail({
    from: `"المستشار القانوني الذكي" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "تم تفعيل حسابك ✅",
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">تم تفعيل حسابك 🎉</h2>
        <p>مرحباً ${name ?? ""}، يسعدنا إبلاغك بأن حسابك في منصة <strong>المستشار القانوني الذكي</strong> تم تفعيله بنجاح.</p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/login"
           style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 16px;">
          تسجيل الدخول الآن
        </a>
        <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">
          إذا لم تقم بإنشاء هذا الحساب، يرجى تجاهل هذا البريد.
        </p>
      </div>
    `,
  });
}

// ===============================
// إيميل رفض الطلب
// ===============================
export async function sendRejectionEmail(email: string, name?: string, reason?: string) {
  await mailer.sendMail({
    from: `"المستشار القانوني الذكي" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "بخصوص طلب تسجيلك",
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">بخصوص طلب تسجيلك</h2>
        <p>مرحباً ${name ?? ""}،</p>
        <p>نأسف لإبلاغك بأنه تعذر تفعيل حسابك في الوقت الحالي.</p>
        ${reason ? `<p><strong>السبب:</strong> ${reason}</p>` : ""}
        <p>للاستفسار يرجى التواصل معنا عبر واتساب.</p>
        <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">
          شكراً لتفهمك.
        </p>
      </div>
    `,
  });
}

export default mailer;