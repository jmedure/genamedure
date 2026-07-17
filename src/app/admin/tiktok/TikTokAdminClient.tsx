"use client";

import { useState } from "react";

export function TikTokAdminClient() {
  const [connectSecret, setConnectSecret] = useState("");
  const [cronSecret, setCronSecret] = useState("");
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  async function runSync() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch(
        `/api/tiktok/sync?secret=${encodeURIComponent(cronSecret)}`,
        { method: "POST" },
      );
      const data = await res.json();
      setSyncResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setSyncResult(
        error instanceof Error ? error.message : "Sync request failed",
      );
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="mt-10 space-y-8 font-body">
      <section className="space-y-3">
        <h2 className="text-lg font-bold tracking-[-0.01em]">1. Connect</h2>
        <p className="text-sm text-muted">
          Uses <code className="text-ink">TIKTOK_CONNECT_SECRET</code>. Gena
          must be a sandbox target user.
        </p>
        <input
          type="password"
          value={connectSecret}
          onChange={(e) => setConnectSecret(e.target.value)}
          placeholder="Connect secret"
          className="w-full border border-ink/15 px-3 py-2.5 text-base outline-none focus:border-ink/40"
        />
        <a
          href={
            connectSecret
              ? `/api/tiktok/connect?secret=${encodeURIComponent(connectSecret)}`
              : undefined
          }
          aria-disabled={!connectSecret}
          className={`inline-flex min-h-11 items-center justify-center px-4 text-base text-white transition-opacity ${
            connectSecret
              ? "bg-ink hover:opacity-80"
              : "pointer-events-none bg-ink/30"
          }`}
        >
          Connect TikTok
        </a>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold tracking-[-0.01em]">2. Sync now</h2>
        <p className="text-sm text-muted">
          Uses <code className="text-ink">CRON_SECRET</code>. Same endpoint the
          daily Vercel cron hits.
        </p>
        <input
          type="password"
          value={cronSecret}
          onChange={(e) => setCronSecret(e.target.value)}
          placeholder="Cron secret"
          className="w-full border border-ink/15 px-3 py-2.5 text-base outline-none focus:border-ink/40"
        />
        <button
          type="button"
          onClick={runSync}
          disabled={!cronSecret || syncing}
          className="inline-flex min-h-11 items-center justify-center bg-ink px-4 text-base text-white transition-opacity hover:opacity-80 disabled:bg-ink/30"
        >
          {syncing ? "Syncing…" : "Run sync"}
        </button>
        {syncResult ? (
          <pre className="overflow-x-auto border border-ink/10 bg-ink/[0.03] p-3 text-xs leading-relaxed">
            {syncResult}
          </pre>
        ) : null}
      </section>
    </div>
  );
}
