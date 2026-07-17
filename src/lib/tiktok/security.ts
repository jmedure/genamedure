import { timingSafeEqual } from "crypto";

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function assertConnectSecret(provided: string | null | undefined) {
  const expected = process.env.TIKTOK_CONNECT_SECRET;
  if (!expected) throw new Error("Missing TIKTOK_CONNECT_SECRET");
  if (!provided || !safeEqual(provided, expected)) {
    throw new Error("Unauthorized");
  }
}

export function assertCronSecret(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) throw new Error("Missing CRON_SECRET");

  const auth = request.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  const query = new URL(request.url).searchParams.get("secret");
  const provided = bearer || query;

  if (!provided || !safeEqual(provided, expected)) {
    throw new Error("Unauthorized");
  }
}
