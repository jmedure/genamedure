export function getTikTokClientKey() {
  const key = process.env.TIKTOK_CLIENT_KEY;
  if (!key) throw new Error("Missing TIKTOK_CLIENT_KEY");
  return key;
}

export function getTikTokClientSecret() {
  const secret =
    process.env.TIKTOK_CLIENT_SECRET || process.env.TIKTOK_SECRET;
  if (!secret) {
    throw new Error("Missing TIKTOK_CLIENT_SECRET (or TIKTOK_SECRET)");
  }
  return secret;
}

export function getSiteUrl() {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SITE_URL");
  }

  return url.startsWith("http") ? url.replace(/\/$/, "") : `https://${url}`;
}

export function getTikTokRedirectUri() {
  return (
    process.env.TIKTOK_REDIRECT_URI ||
    `${getSiteUrl()}/api/tiktok/callback`
  );
}

export const TIKTOK_SCOPES = [
  "user.info.basic",
  "user.info.profile",
  "user.info.stats",
  "video.list",
].join(",");

export const TIKTOK_CONNECTION_ID = "tiktokConnection";
