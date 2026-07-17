import { revalidatePath } from "next/cache";
import { getValidAccessToken } from "./auth";
import { fetchLast60DaysVideoTotals, fetchTikTokUser } from "./api";
import { formatCompact, formatHandle } from "./format";
import { getWriteClient } from "@/sanity/writeClient";

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
    profileViews?: string | null;
  } | null>(`*[_id == "mediaKit"][0]{ _id, profileViews }`);

  if (!existing?._id) {
    throw new Error(
      "Sanity mediaKit document is missing. Publish the Media Kit in Studio first.",
    );
  }

  const profileViews = existing.profileViews?.trim() || "—";
  const stats = {
    followers: formatCompact(user.follower_count ?? 0),
    periodLabel: "Last 60 Days",
    postViews: formatCompact(totals.postViews),
    profileViews,
    likes: formatCompact(totals.likes),
    comments: formatCompact(totals.comments),
    shares: formatCompact(totals.shares),
  };

  await client.patch("mediaKit").set(stats).commit();

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
    followers: stats.followers,
    metrics: [
      { label: "Post Views", value: stats.postViews },
      { label: "Profile Views", value: stats.profileViews },
      { label: "Likes", value: stats.likes },
      { label: "Comments", value: stats.comments },
      { label: "Shares", value: stats.shares },
    ],
    videosCounted: totals.videoCount,
    profileViews: existing.profileViews?.trim()
      ? "preserved (not available via TikTok Display API)"
      : "missing — set manually in Sanity",
  };
}
