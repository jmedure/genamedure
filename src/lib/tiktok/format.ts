function trimNum(value: number) {
  return value
    .toFixed(value >= 10 || Number.isInteger(value) ? 0 : 1)
    .replace(/\.0$/, "");
}

/** Compact display values matching the media kit (e.g. 20.6K, 5.2M). */
export function formatCompact(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "0";
  if (n >= 1_000_000) return `${trimNum(n / 1_000_000)}M`;
  if (n >= 1_000) return `${trimNum(n / 1_000)}K`;
  return String(Math.round(n));
}

export function formatHandle(username: string): string {
  const trimmed = username.trim().replace(/^@+/, "");
  return trimmed ? `@${trimmed}` : "";
}

export { formatStatsUpdatedAt } from "@/lib/formatStatsUpdatedAt";
