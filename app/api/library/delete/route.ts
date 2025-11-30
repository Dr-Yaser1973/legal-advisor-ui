 // app/api/library/delete/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
 const session: any = await getServerSession(authOptions);
 

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({} as any));
  let id = body.id;

  // تحويل النص إلى رقم لو جاء "5" مثلاً
  if (typeof id === "string") {
    id = Number(id);
  }

  if (typeof id !== "number" || Number.isNaN(id) || id <= 0) {
    return NextResponse.json({ error: "معرّف غير صالح" }, { status: 400 });
  }

  try {
    await prisma.lawDoc.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete LawDoc error:", error);
    return NextResponse.json(
      { error: "خطأ أثناء الحذف" },
      { status: 500 }
    );
  }
}
