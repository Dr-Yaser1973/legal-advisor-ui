export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
 import { prisma } from "@/lib/prisma";
 import bcrypt from "bcryptjs";
 
 export async function POST(req: NextRequest) {
   try {
     const { name, email, phone, password } = await req.json();
 
     if (!name || !email || !password) {
       return NextResponse.json(
         { error: "البيانات غير مكتملة" },
         { status: 400 }
       );
     }
 
     // هل المستخدم موجود مسبقًا؟
     const exists = await prisma.user.findUnique({
       where: { email },
     });
 
     if (exists) {
       return NextResponse.json(
         { error: "هذا البريد مسجّل مسبقًا" },
         { status: 409 }
       );
     }
 
     // تشفير كلمة السر
     const hashed = await bcrypt.hash(password, 10);
 
     // إنشاء المستخدم
     const user = await prisma.user.create({
       data: {
         name,             // ✔️ الاسم الصحيح في السكيمة
         email,
         phone: phone || null,
         role: "CLIENT",
         password: hashed, // ✔️ الاسم الصحيح في السكيمة
       },
     });
 
     console.log("User created:", user.id);
 
     return NextResponse.json({ ok: true });
   } catch (e: any) {
     console.error("REGISTER ERROR:", e);
     return NextResponse.json(
       { error: "حدث خطأ غير متوقع أثناء التسجيل" },
       { status: 500 }
     );
   }
 }
 