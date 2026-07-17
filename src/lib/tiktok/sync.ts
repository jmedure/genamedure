import { revalidatePath } from "next/cache";
import { getValidAccessToken } from "./auth";
import { fetchLast60DaysVideoTotals, fetchTikTokUser } from "./api";
import {
  formatCompact,
  formatHandle,
  formatStatsUpdatedAt,
} from "./format";
import { getWriteClient } from "@/sanity/writeClient";

type ExistingMetric = {
  _key?: string;
  label?: string | null;
  value?: string | null;
};

function metricKey(label: string) {
  return label.toLowerCase().replace(/\s+/g, "-");
}

export async function syncTikTokStatsToSanity() {
  const accessToken = await getValidAccessToken();
  const user = await fetchTikTokUser(accessToken);
  const totals = await fetchLast60DaysVideoTotals(accessToken);

  const handle = formatHandle(user.username || "");
  const profileUrl =
    user.profile_deep_link?.trim() ||
    (handle ? `https://www.tiktok.com/${handle}` : "");

  const client = getWriteClient();
  const existing = await client.fetch<{
    _id?: string;
    metrics?: ExistingMetric[] | null;
  } | null>(`*[_id == "mediaKit"][0]{ _id, metrics[]{ _key, label, value } }`);

  if (!existing?._id) {
    throw new Error(
      "Sanity mediaKit document is missing. Publish the Media Kit in Studio first.",
    );
  }

  const existingProfileViews =
    existing?.metrics?.find(
      (m) => m.label?.toLowerCase().trim() === "profile views",
    )?.value ?? null;

  const metrics = [
    {
      _key: metricKey("post views"),
      label: "post views",
      value: formatCompact(totals.postViews),
    },
    {
      _key: metricKey("profile views"),
      label: "profile views",
      value: existingProfileViews || "—",
    },
    {
      _key: metricKey("likes"),
      label: "likes",
      value: formatCompact(totals.likes),
    },
    {
      _key: metricKey("comments"),
      label: "comments",
      value: formatCompact(totals.comments),
    },
    {
      _key: metricKey("shares"),
      label: "shares",
      value: formatCompact(totals.shares),
    },
  ];

  await client
    .patch("mediaKit")
    .set({
      tiktokHandle: handle,
      tiktokUrl: profileUrl,
      followers: formatCompact(user.follower_count ?? 0),
      periodLabel: "Last 60 days",
      statsLastUpdated: formatStatsUpdatedAt(),
      metrics,
    })
    .commit();

  try {
    await client
      .patch("tiktokConnection")
      .set({ username: user.username, updatedAt: new Date().toISOString() })
      .commit();
  } catch {
    // Non-fatal — media kit already updated.
  }

  revalidatePath("/");

  return {
    handle,
    profileUrl,
    followers: formatCompact(user.follower_count ?? 0),
    metrics,
    videosCounted: totals.videoCount,
    profileViews: existingProfileViews
      ? "preserved (not available via TikTok Display API)"
      : "missing — set manually in Sanity",
  };
}
