/** Display time for stats "Last updated" (Pacific). */
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
