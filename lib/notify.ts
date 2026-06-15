 // lib/notify.ts
import { prisma } from "@/lib/prisma";
import {
  sendNewConsultRequestEmail,
  sendNewOfferEmail,
  sendOfferAcceptedEmail,
} from "@/lib/mailer";

// إرسال Push عبر Expo — best-effort
async function sendExpoPush(
  userId: number,
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<boolean> {
  try {
    const tokens = await prisma.pushToken.findMany({
      where: { userId },
      select: { token: true },
    });

    if (tokens.length === 0) return false;

    // Expo يستقبل رسائل متعددة دفعة واحدة
    const messages = tokens.map((t) => ({
      to: t.token,
      sound: "default",
      title,
      body,
      data: data || {},
    }));

    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    });

    if (!res.ok) {
      console.error("Expo push failed:", await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("sendExpoPush error:", e);
    return false;
  }
}

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://smartlegaladvisor.com";

type EmailKind = "new_request" | "new_offer" | "offer_accepted" | null;

type NotifyParams = {
  userId: number;
  title: string;
  body: string;
  emailKind?: EmailKind;
  emailData?: {
    subject: string;
    consultUrl?: string;
    offerPath?: string;
    chatPath?: string;
  };
  pushData?: Record<string, any>;
};

/**
 * دالة مركزية: تكتب إشعاراً داخل المنصة دائماً, وترسل إيميلاً
 * و Push حسب النوع (best-effort — لا تُسقط العملية إن فشلت أي قناة).
 */
export async function notifyUser(
  params: NotifyParams
): Promise<{ ok: boolean; emailSent: boolean; pushSent: boolean }> {
  const { userId, title, body, emailKind = null, emailData } = params;

  // 1) إشعار داخل المنصة (دائماً)
  await prisma.notification.create({
    data: { userId, title, body },
  });

  // 2) إيميل (best-effort)
  let emailSent = false;
  if (emailKind && emailData) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      });

      if (user?.email) {
        const name = user.name ?? undefined;

        if (emailKind === "new_request") {
          await sendNewConsultRequestEmail(user.email, {
            lawyerName: name,
            subject: emailData.subject,
            consultUrl: `${BASE_URL}${emailData.consultUrl || "/dashboard/requests"}`,
          });
        } else if (emailKind === "new_offer") {
          await sendNewOfferEmail(user.email, {
            clientName: name,
            subject: emailData.subject,
            offerUrl: `${BASE_URL}${emailData.offerPath || "/dashboard/consultations"}`,
          });
        } else if (emailKind === "offer_accepted") {
          await sendOfferAcceptedEmail(user.email, {
            lawyerName: name,
            subject: emailData.subject,
            chatUrl: `${BASE_URL}${emailData.chatPath || "/dashboard/chat"}`,
          });
        }

        emailSent = true;
      }
    } catch (e) {
      console.error(`notifyUser email failed (${emailKind}):`, e);
    }
  }

  // 3) إشعار Push (best-effort — لا يُسقط العملية)
  let pushSent = false;
  try {
    pushSent = await sendExpoPush(userId, title, body, params.pushData);
  } catch (e) {
    console.error("notifyUser push failed:", e);
  }

  return { ok: true, emailSent, pushSent };
}