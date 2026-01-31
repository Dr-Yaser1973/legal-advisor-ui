import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    layer: "next-api",
    time: new Date().toISOString()
  });
}

