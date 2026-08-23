// app/api/track/visit/route.ts
// نقطة تسجيل الزيارات (First-party). تُستدعى مرّة واحدة لكل جلسة متصفّح
// من مكوّن VisitTracker، فتُخزّن مصدر الزيارة في AuditLog دون أي migration.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { classifyChannel, isBot } from "@/lib/analytics/channel";

export const runtime = "nodejs";

const SELF_HOSTS = /(^|\.)smartlegaladvisor\.com$/i;

function selfHostFrom(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const ua = req.headers.get("user-agent");
    // استبعاد البوتات المعروفة (JS الأول-طرفي يستبعد أغلبها أصلاً)
    if (isBot(ua)) {
      return NextResponse.json({ ok: true, skipped: "bot" });
    }

    const body = await req.json().catch(() => ({}));
    const referrer: string | null = body?.referrer || null;
    const path: string = typeof body?.path === "string" ? body.path.slice(0, 300) : "/";
    const utm = {
      source: body?.utm_source ? String(body.utm_source).slice(0, 120) : null,
      medium: body?.utm_medium ? String(body.utm_medium).slice(0, 120) : null,
      campaign: body?.utm_campaign ? String(body.utm_campaign).slice(0, 120) : null,
    };

    // لا نتتبّع صفحات الإدارة/الدخول (تلوّث الإحصاءات بتنقّل الأدمن نفسه)
    if (/^\/(admin|login|register|api)/.test(path)) {
      return NextResponse.json({ ok: true, skipped: "internal" });
    }

    const selfHost = selfHostFrom(req.headers.get("origin")) || "smartlegaladvisor.com";
    const channel = classifyChannel(referrer, selfHost, utm);

    // نطاق المُحيل فقط (بدون مسار كامل) — يكفي للتحليل ويقلّل تخزين بيانات حسّاسة
    let referrerHost: string | null = null;
    if (referrer) {
      try {
        const h = new URL(referrer).hostname.toLowerCase();
        // نتجاهل الإحالة الداخلية من نفس النطاق
        referrerHost = SELF_HOSTS.test(h) ? null : h;
      } catch {
        referrerHost = null;
      }
    }

    await prisma.auditLog.create({
      data: {
        action: "PAGE_VISIT",
        meta: {
          channel,
          referrerHost,
          landing: path,
          utm_source: utm.source,
          utm_medium: utm.medium,
          utm_campaign: utm.campaign,
        },
      },
    });

    return NextResponse.json({ ok: true, channel });
  } catch (e: any) {
    // صامت — التتبّع يجب ألا يكسر تجربة المستخدم أبداً
    console.error("TRACK VISIT ERROR", e?.message || e);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
