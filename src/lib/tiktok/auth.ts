import {
  getTikTokClientKey,
  getTikTokClientSecret,
  getTikTokRedirectUri,
  TIKTOK_CONNECTION_ID,
} from "./env";
import { getWriteClient } from "@/sanity/writeClient";

export type TikTokTokens = {
  accessToken: string;
  refreshToken: string;
  openId: string;
  scope: string;
  expiresAt: string;
  refreshExpiresAt: string;
};

type TokenResponse = {
  access_token?: string;
  refresh_token?: string;
  open_id?: string;
  scope?: string;
  expires_in?: number;
  refresh_expires_in?: number;
  error?: string;
  error_description?: string;
};

function toTokens(data: TokenResponse): TikTokTokens {
  if (
    !data.access_token ||
    !data.refresh_token ||
    !data.open_id ||
    !data.expires_in ||
    !data.refresh_expires_in
  ) {
    throw new Error(
      data.error_description || data.error || "Invalid TikTok token response",
    );
  }

  const now = Date.now();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    openId: data.open_id,
    scope: data.scope || "",
    expiresAt: new Date(now + data.expires_in * 1000).toISOString(),
    refreshExpiresAt: new Date(
      now + data.refresh_expires_in * 1000,
    ).toISOString(),
  };
}

async function requestToken(
  body: Record<string, string>,
): Promise<TikTokTokens> {
  const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: new URLSearchParams(body),
  });

  const data = (await res.json()) as TokenResponse;
  if (!res.ok || data.error) {
    throw new Error(
      data.error_description || data.error || `TikTok token error (${res.status})`,
    );
  }

  return toTokens(data);
}

export async function exchangeCodeForTokens(code: string): Promise<TikTokTokens> {
  return requestToken({
    client_key: getTikTokClientKey(),
    client_secret: getTikTokClientSecret(),
    code,
    grant_type: "authorization_code",
    redirect_uri: getTikTokRedirectUri(),
  });
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<TikTokTokens> {
  return requestToken({
    client_key: getTikTokClientKey(),
    client_secret: getTikTokClientSecret(),
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
}

type StoredConnection = {
  accessToken?: string;
  refreshToken?: string;
  openId?: string;
  scope?: string;
  expiresAt?: string;
  refreshExpiresAt?: string;
};

export async function saveTikTokConnection(
  tokens: TikTokTokens,
  username?: string,
) {
  const client = getWriteClient();
  await client.createOrReplace({
    _id: TIKTOK_CONNECTION_ID,
    _type: "tiktokConnection",
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    openId: tokens.openId,
    scope: tokens.scope,
    expiresAt: tokens.expiresAt,
    refreshExpiresAt: tokens.refreshExpiresAt,
    username: username || undefined,
    connectedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function getValidAccessToken(): Promise<string> {
  const client = getWriteClient();
  const connection = await client.fetch<StoredConnection | null>(
    `*[_id == $id][0]{
      accessToken,
      refreshToken,
      openId,
      scope,
      expiresAt,
      refreshExpiresAt
    }`,
    { id: TIKTOK_CONNECTION_ID },
  );

  if (!connection?.refreshToken) {
    throw new Error(
      "TikTok is not connected. Visit /admin/tiktok to connect the account.",
    );
  }

  const expiresAt = connection.expiresAt
    ? Date.parse(connection.expiresAt)
    : 0;
  const stillValid =
    connection.accessToken && expiresAt - Date.now() > 5 * 60 * 1000;

  if (stillValid && connection.accessToken) {
    return connection.accessToken;
  }

  const refreshed = await refreshAccessToken(connection.refreshToken);
  await saveTikTokConnection(refreshed);
  return refreshed.accessToken;
}
