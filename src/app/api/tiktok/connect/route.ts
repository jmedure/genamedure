import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import {
  getTikTokClientKey,
  getTikTokRedirectUri,
  TIKTOK_SCOPES,
} from "@/lib/tiktok/env";
import { assertConnectSecret } from "@/lib/tiktok/security";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const secret = new URL(request.url).searchParams.get("secret");
    assertConnectSecret(secret);

    const state = randomBytes(24).toString("hex");
    const cookieStore = await cookies();
    cookieStore.set("tiktok_oauth_state", state, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    });

    const url = new URL("https://www.tiktok.com/v2/auth/authorize/");
    url.searchParams.set("client_key", getTikTokClientKey());
    url.searchParams.set("scope", TIKTOK_SCOPES);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("redirect_uri", getTikTokRedirectUri());
    url.searchParams.set("state", state);

    return NextResponse.redirect(url.toString());
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to start TikTok connect";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
