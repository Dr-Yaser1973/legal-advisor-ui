// app/api/cron/case-reminders/route.ts
// «الرقيب» — يقرأ أحداث القضايا المستحقّة للتذكير ويُشعر المالك والمكلّفين.
// يستدعيه Vercel Cron (انظر vercel.json). محميّ بـ CRON_SECRET.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyUser } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  HEARING: "جلسة",
  DEADLINE: "موعد نهائي",
  MEETING: "اجتماع موكّل",
  TASK: "مهمة",
  VERDICT: "حكم",
  APPEAL: "طعن",
  OTHER: "حدث",
};

async function runReminders() {
  const now = new Date();

  // المستحقّ: له موعد تذكير حان ولم يُشعَر بعد (notifyAt غير null يُستبعد تلقائياً بشرط lte)
  const due = await prisma.caseEvent.findMany({
    where: { notified: false, notifyAt: { lte: now } },
    include: {
      case: {
        select: {
          id: true,
          title: true,
          userId: true,
          assignments: { select: { userId: true } },
        },
      },
    },
    orderBy: { notifyAt: "asc" },
    take: 100,
  });

  let sent = 0;
  for (const ev of due) {
    const recipients = new Set<number>();
    if (ev.case?.userId) recipients.add(ev.case.userId);
    for (const a of ev.case?.assignments ?? []) recipients.add(a.userId);

    const label = TYPE_LABEL[ev.type] ?? "حدث";
    const when = new Date(ev.date).toLocaleString("ar-IQ", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    const title = `🔔 تذكير: ${label} — ${ev.case?.title || `قضية #${ev.caseId}`}`;
    const body = `${ev.title} بتاريخ ${when}${ev.location ? ` — ${ev.location}` : ""}`;

    await Promise.allSettled(
      [...recipients].map((userId) =>
        notifyUser({
          userId,
          title,
          body,
          pushData: { type: "case_reminder", caseId: ev.caseId, eventId: ev.id },
        })
      )
    );

    // نضع notified=true بعد الإرسال حتى لا يتكرّر التذكير
    await prisma.caseEvent.update({
      where: { id: ev.id },
      data: { notified: true },
    });
    sent++;
  }

  return { processed: due.length, sent };
}

export async function GET(req: Request) {
  // Vercel Cron يضيف الترويسة Authorization: Bearer <CRON_SECRET> تلقائياً
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runReminders();
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    console.error("case-reminders cron error:", e);
    return NextResponse.json({ ok: false, error: e?.message || "فشل" }, { status: 500 });
  }
}
