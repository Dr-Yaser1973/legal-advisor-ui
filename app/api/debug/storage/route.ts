 // app/api/debug/storage/route.ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { blockIfProduction, requireRole } from "@/lib/auth/guards";
import { UserRole } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const env = blockIfProduction();
  if (!env.ok) return env.res;

  const auth = await requireRole([UserRole.ADMIN]);
  if (!auth.ok) return auth.res;

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        error: "Supabase Admin client غير مهيأ (ENV مفقود أثناء البناء أو التشغيل).",
      },
      { status: 500 },
    );
  }

  try {
    const hasUrl = !!process.env.SUPABASE_URL;
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    const { data: buckets, error } = await supabase.storage.listBuckets();

    return NextResponse.json({
      ok: true,
      env: { hasUrl, hasServiceKey },
      buckets: buckets?.map((b) => ({ id: b.id, name: b.name })) ?? [],
      bucketError: error?.message ?? null,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "storage debug failed" },
      { status: 500 },
    );
  }
}
