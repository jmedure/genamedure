import { NextResponse } from "next/server";
import { assertCronSecret } from "@/lib/tiktok/security";
import { syncTikTokStatsToSanity } from "@/lib/tiktok/sync";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function handle(request: Request) {
  try {
    assertCronSecret(request);
    const result = await syncTikTokStatsToSanity();
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "TikTok sync failed";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
