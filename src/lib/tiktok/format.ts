function trimNum(value: number) {
  return value
    .toFixed(value >= 10 || Number.isInteger(value) ? 0 : 1)
    .replace(/\.0$/, "");
}

/** Compact display values matching the media kit (e.g. 20.6k, 5.2M). */
export function formatCompact(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "0";
  if (n >= 1_000_000) return `${trimNum(n / 1_000_000)}M`;
  if (n >= 1_000) return `${trimNum(n / 1_000)}k`;
  return String(Math.round(n));
}

export function formatHandle(username: string): string {
  const trimmed = username.trim().replace(/^@+/, "");
  return trimmed ? `@${trimmed}` : "";
}

export function formatStatsUpdatedAt(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).formatToParts(date);

  const hour = parts.find((p) => p.type === "hour")?.value ?? "";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "";
  const dayPeriod = parts.find((p) => p.type === "dayPeriod")?.value ?? "";
  const tz = parts.find((p) => p.type === "timeZoneName")?.value ?? "PT";

  return `${hour}:${minute} ${dayPeriod} ${tz}`.replace(/\s+/g, " ").trim();
}
