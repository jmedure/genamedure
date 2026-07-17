import type { Metadata } from "next";
import Link from "next/link";
import { TikTokAdminClient } from "./TikTokAdminClient";
import { getWriteClient } from "@/sanity/writeClient";

export const metadata: Metadata = {
  title: "TikTok sync — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function getConnectionStatus() {
  try {
    if (!process.env.SANITY_API_WRITE_TOKEN) {
      return { connected: false as const, reason: "Missing SANITY_API_WRITE_TOKEN" };
    }

    const client = getWriteClient();
    const doc = await client.fetch<{
      username?: string;
      updatedAt?: string;
      connectedAt?: string;
      refreshExpiresAt?: string;
    } | null>(
      `*[_id == "tiktokConnection"][0]{
        username,
        updatedAt,
        connectedAt,
        refreshExpiresAt
      }`,
    );

    if (!doc) {
      return { connected: false as const, reason: "Not connected yet" };
    }

    return {
      connected: true as const,
      username: doc.username ? `@${doc.username.replace(/^@/, "")}` : "connected",
      updatedAt: doc.updatedAt || doc.connectedAt || null,
      refreshExpiresAt: doc.refreshExpiresAt || null,
    };
  } catch (error) {
    return {
      connected: false as const,
      reason: error instanceof Error ? error.message : "Could not read connection",
    };
  }
}

export default async function TikTokAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; error?: string }>;
}) {
  const params = await searchParams;
  const status = await getConnectionStatus();

  return (
    <div className="min-h-screen bg-white px-4 py-12 text-ink">
      <div className="mx-auto w-full max-w-[520px]">
        <Link
          href="/"
          className="font-body text-sm text-muted transition-opacity hover:opacity-70"
        >
          ← Back to site
        </Link>
        <h1 className="mt-6 font-display text-[clamp(2.5rem,8vw,3.25rem)] leading-none">
          TikTok sync
        </h1>
        <p className="mt-4 font-body text-base leading-relaxed text-muted">
          Connect Gena’s TikTok once. Daily cron keeps handle, profile URL,
          followers, and last-60-days video stats live in Sanity.
        </p>

        {params.connected ? (
          <p className="mt-6 rounded-sm border border-ink/10 bg-ink/[0.03] px-4 py-3 font-body text-sm">
            Connected. Stats sync ran (or can be run below).
          </p>
        ) : null}

        {params.error ? (
          <p className="mt-6 rounded-sm border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-800">
            {params.error}
          </p>
        ) : null}

        <div className="mt-8 space-y-2 font-body text-sm">
          <p>
            Status:{" "}
            <span className="font-medium text-ink">
              {status.connected
                ? `Connected as ${status.username}`
                : status.reason}
            </span>
          </p>
          {status.connected && status.updatedAt ? (
            <p className="text-muted">Last updated: {status.updatedAt}</p>
          ) : null}
        </div>

        <TikTokAdminClient />
      </div>
    </div>
  );
}
