import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { exchangeCodeForTokens, saveTikTokConnection } from "@/lib/tiktok/auth";
import { fetchTikTokUser } from "@/lib/tiktok/api";
import { getSiteUrl } from "@/lib/tiktok/env";
import { syncTikTokStatsToSanity } from "@/lib/tiktok/sync";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const siteUrl = (() => {
    try {
      return getSiteUrl();
    } catch {
      return "https://genamedure.com";
    }
  })();

  try {
    const url = new URL(request.url);
    const error = url.searchParams.get("error");
    if (error) {
      const description =
        url.searchParams.get("error_description") || error;
      return NextResponse.redirect(
        `${siteUrl}/admin/tiktok?error=${encodeURIComponent(description)}`,
      );
    }

    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const cookieStore = await cookies();
    const expectedState = cookieStore.get("tiktok_oauth_state")?.value;

    if (!code || !state || !expectedState || state !== expectedState) {
      return NextResponse.redirect(
        `${siteUrl}/admin/tiktok?error=${encodeURIComponent("Invalid OAuth state")}`,
      );
    }

    cookieStore.delete("tiktok_oauth_state");

    const tokens = await exchangeCodeForTokens(code);
    const user = await fetchTikTokUser(tokens.accessToken);
    await saveTikTokConnection(tokens, user.username);

    try {
      await syncTikTokStatsToSanity();
    } catch {
      // Connection succeeded; sync can be retried from admin.
    }

    return NextResponse.redirect(`${siteUrl}/admin/tiktok?connected=1`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "TikTok callback failed";
    return NextResponse.redirect(
      `${siteUrl}/admin/tiktok?error=${encodeURIComponent(message)}`,
    );
  }
}
