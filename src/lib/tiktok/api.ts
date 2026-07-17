type TikTokError = {
  code?: string;
  message?: string;
  log_id?: string;
};

type UserInfoResponse = {
  data?: {
    user?: {
      username?: string;
      display_name?: string;
      profile_deep_link?: string;
      follower_count?: number;
      likes_count?: number;
      video_count?: number;
    };
  };
  error?: TikTokError;
};

type Video = {
  id?: string;
  create_time?: number;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  share_count?: number;
};

type VideoListResponse = {
  data?: {
    videos?: Video[];
    cursor?: number;
    has_more?: boolean;
  };
  error?: TikTokError;
};

function assertOk(error: TikTokError | undefined, fallback: string) {
  if (error && error.code && error.code !== "ok") {
    throw new Error(error.message || error.code || fallback);
  }
}

export async function fetchTikTokUser(accessToken: string) {
  const fields = [
    "username",
    "display_name",
    "profile_deep_link",
    "follower_count",
    "likes_count",
    "video_count",
  ].join(",");

  const res = await fetch(
    `https://open.tiktokapis.com/v2/user/info/?fields=${encodeURIComponent(fields)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    },
  );

  const data = (await res.json()) as UserInfoResponse;
  assertOk(data.error, `TikTok user info failed (${res.status})`);

  const user = data.data?.user;
  if (!user?.username) {
    throw new Error("TikTok user info missing username");
  }

  return user;
}

const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;
const MAX_PAGES = 40;

/**
 * Sums lifetime engagement for videos posted in the last 60 days.
 * TikTok Display API does not expose true rolling 60-day account analytics.
 */
export async function fetchLast60DaysVideoTotals(accessToken: string) {
  const cutoffSec = Math.floor((Date.now() - SIXTY_DAYS_MS) / 1000);
  let cursor: number | undefined;
  let pages = 0;

  let postViews = 0;
  let likes = 0;
  let comments = 0;
  let shares = 0;
  let videoCount = 0;

  while (pages < MAX_PAGES) {
    pages += 1;

    const res = await fetch(
      "https://open.tiktokapis.com/v2/video/list/?fields=id,create_time,view_count,like_count,comment_count,share_count",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          max_count: 20,
          ...(cursor != null ? { cursor } : {}),
        }),
        cache: "no-store",
      },
    );

    const data = (await res.json()) as VideoListResponse;
    assertOk(data.error, `TikTok video list failed (${res.status})`);

    const videos = data.data?.videos ?? [];
    let reachedCutoff = false;

    for (const video of videos) {
      if (typeof video.create_time === "number" && video.create_time < cutoffSec) {
        reachedCutoff = true;
        break;
      }

      videoCount += 1;
      postViews += video.view_count ?? 0;
      likes += video.like_count ?? 0;
      comments += video.comment_count ?? 0;
      shares += video.share_count ?? 0;
    }

    if (reachedCutoff || !data.data?.has_more) break;
    cursor = data.data?.cursor;
    if (cursor == null) break;
  }

  return { postViews, likes, comments, shares, videoCount };
}
