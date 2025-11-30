 // app/api/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // عدادات مبدئية
  let consultations = 0;
  let users = 0;

  try {
    // غيّر اسم الموديل حسب سكيمتك الفعلية (Consultation / LegalConsultation / ...)
    consultations = await prisma.consultation.count();
  } catch (e) {
    console.warn("stats: فشل عدّ الاستشارات (consultation.count)", e);
  }

  try {
    users = await prisma.user.count();
  } catch (e) {
    console.warn("stats: فشل عدّ المستخدمين (user.count)", e);
  }

  return NextResponse.json({
    consultations,
    users,
  });
}
