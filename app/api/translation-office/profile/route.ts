// app/api/translation-office/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const BUCKET = "office-logos";
const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const MAX_BIO = 600;

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

/** يضمن وجود الحاوية العامة، وينشئها عند أول رفع. */
async function ensureBucket(supabase: ReturnType<typeof getSupabaseAdmin>) {
  if (!supabase) return;
  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: MAX_SIZE,
  });
  // تجاهل خطأ "الحاوية موجودة مسبقاً"
  if (error && !/exist/i.test(error.message)) throw error;
}

export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    const sUser = session?.user as any;

    if (!sUser?.email) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    if (sUser.role !== "TRANSLATION_OFFICE") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    // معرّف المكتب الحقيقي من قاعدة البيانات
    const office = await prisma.user.findUnique({
      where: { email: sUser.email },
      select: { id: true, image: true },
    });
    if (!office) {
      return NextResponse.json({ error: "الحساب غير موجود" }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    const rawBio = (formData.get("bio") as string | null) ?? undefined;
    const rawName = (formData.get("name") as string | null) ?? undefined;
    const rawLocation = (formData.get("location") as string | null) ?? undefined;
    const rawPhone = (formData.get("phone") as string | null) ?? undefined;

    const data: {
      name?: string | null;
      location?: string | null;
      phone?: string | null;
      bio?: string | null;
      image?: string;
    } = {};

    if (rawName !== undefined) {
      const v = rawName.trim();
      data.name = v.length ? v.slice(0, 120) : null;
    }
    if (rawLocation !== undefined) {
      const v = rawLocation.trim();
      data.location = v.length ? v.slice(0, 160) : null;
    }
    if (rawPhone !== undefined) {
      const v = rawPhone.trim();
      data.phone = v.length ? v.slice(0, 40) : null;
    }
    if (rawBio !== undefined) {
      const v = rawBio.trim();
      if (v.length > MAX_BIO) {
        return NextResponse.json(
          { error: `النبذة طويلة جداً (الحد ${MAX_BIO} حرف)` },
          { status: 400 }
        );
      }
      data.bio = v.length ? v : null;
    }

    // رفع الشعار (اختياري)
    if (file && file.size > 0) {
      if (!ALLOWED.includes(file.type)) {
        return NextResponse.json(
          { error: "صيغة الصورة غير مدعومة (JPG, PNG, WEBP, SVG)" },
          { status: 415 }
        );
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: "حجم الشعار كبير (الحد الأقصى 2MB)" },
          { status: 413 }
        );
      }

      const supabase = getSupabaseAdmin();
      if (!supabase) {
        return NextResponse.json(
          { error: "خدمة التخزين غير متاحة حالياً" },
          { status: 503 }
        );
      }

      await ensureBucket(supabase);

      const ext = EXT[file.type] ?? "png";
      const path = `offices/${office.id}/logo.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, buffer, { contentType: file.type, upsert: true });

      if (uploadError) throw uploadError;

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      // كسر التخزين المؤقت للمتصفح بعد الاستبدال
      data.image = `${pub.publicUrl}?v=${Date.now()}`;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "لا توجد بيانات لتحديثها" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: office.id },
      data,
      select: { name: true, location: true, phone: true, bio: true, image: true },
    });

    return NextResponse.json({ ok: true, office: updated });
  } catch (err) {
    console.error("Office profile update error:", err);
    return NextResponse.json({ error: "تعذر حفظ الملف التعريفي" }, { status: 500 });
  }
}
