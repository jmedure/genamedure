const TZ = "America/Los_Angeles";

type ZonedDay = {
  year: number;
  month: number;
  day: number;
  weekday: string;
};

function getZonedDay(date: Date): ZonedDay {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
  }).formatToParts(date);

  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";

  return { year, month, day, weekday };
}

/** UTC midnight for that Pacific calendar day — for day math only. */
function toUtcDayNumber({ year, month, day }: ZonedDay) {
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

/** Sunday-start week id in Pacific (YYYY-MM-DD of that Sunday). */
function weekStartKey(zoned: ZonedDay) {
  const utc = Date.UTC(zoned.year, zoned.month - 1, zoned.day);
  const dow = new Date(utc).getUTCDay(); // 0 = Sunday
  const sunday = new Date(utc - dow * 86_400_000);
  const y = sunday.getUTCFullYear();
  const m = String(sunday.getUTCMonth() + 1).padStart(2, "0");
  const d = String(sunday.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Relative stats stamp from a Sanity `_updatedAt` (UTC ISO).
 * Compared on America/Los_Angeles calendar days.
 *
 * - today → "today"
 * - yesterday → "yesterday"
 * - 2 days ago → "2 days ago"
 * - later same week → "Friday"
 * - prior weeks → "last week"
 */
export function formatStatsUpdatedAt(
  date: Date = new Date(),
  now: Date = new Date(),
): string {
  const updated = getZonedDay(date);
  const current = getZonedDay(now);
  const dayDiff = toUtcDayNumber(current) - toUtcDayNumber(updated);

  if (dayDiff <= 0) return "today";
  if (dayDiff === 1) return "yesterday";
  if (dayDiff === 2) return "2 days ago";

  if (weekStartKey(updated) === weekStartKey(current)) {
    return updated.weekday;
  }

  return "last week";
}
