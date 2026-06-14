 // app/api/mobile/push/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/jwt";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // 1) استخراج التوكن من ترويسة Authorization
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : "";

    if (!token) {
      return NextResponse.json(
        { error: "غير مصرح. التوكن مفقود." },
        { status: 401 }
      );
    }

    // 2) التحقق من التوكن واستخراج معرّف المستخدم من sub
    let userId: number;
    try {
      const payload = await verifyUserToken(token);
      userId = Number(payload.sub);
      if (!Number.isFinite(userId) || userId <= 0) {
        throw new Error("invalid sub");
      }
    } catch {
      return NextResponse.json(
        { error: "غير مصرح. التوكن غير صالح." },
        { status: 401 }
      );
    }

    // 3) قراءة رمز Expo Push من الجسم
    const body = await req.json();
    const pushToken = (body?.token || "").toString().trim();
    const platform = body?.platform ? String(body.platform) : null;

    if (!pushToken || !pushToken.startsWith("ExponentPushToken")) {
      return NextResponse.json(
        { error: "رمز الإشعارات غير صالح." },
        { status: 400 }
      );
    }

    // 4) حفظ الرمز (upsert: قد ينتقل الجهاز بين مستخدمين)
    const saved = await prisma.pushToken.upsert({
      where: { token: pushToken },
      update: { userId, platform },
      create: { userId, token: pushToken, platform },
    });

    return NextResponse.json({ ok: true, id: saved.id });
  } catch (err) {
    console.error("POST /api/mobile/push/register error:", err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل رمز الإشعارات." },
      { status: 500 }
    );
  }
}