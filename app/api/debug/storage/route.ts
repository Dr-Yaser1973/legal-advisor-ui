 // app/api/debug/supabase/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1) فحص المتغيرات (بدون إظهار المفاتيح)
    const hasUrl = !!process.env.SUPABASE_URL;
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    // 2) قراءة قائمة الـ buckets (أقوى اختبار)
    const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          step: "listBuckets",
          env: { hasUrl, hasServiceKey },
          error: {
            message: error.message,
            name: (error as any).name,
            status: (error as any).status,
          },
        },
        { status: 500 }
      );
    }

    // 3) أسماء الـ buckets
    const names = (buckets || []).map((b: any) => b.name);

    // 4) اختبر bucket معيّن (اختياري)
    const target = "library-documents";
    const exists = names.includes(target);

    return NextResponse.json({
      ok: true,
      env: { hasUrl, hasServiceKey },
      buckets: names,
      check: { target, exists },
      hint: exists
        ? "الاتصال ممتاز — bucket موجود ويُرى من السيرفر."
        : "bucket غير ظاهر من السيرفر — غالباً SUPABASE_URL أو SERVICE_ROLE_KEY لمشروع آخر.",
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        step: "catch",
        error: e?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
