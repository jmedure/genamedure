# TikTok → Sanity stats sync (paused)

**Status:** Paused — July 17, 2026  
**Decision:** Gena prefers **manual** stats updates in Sanity for now. Automation is shelved, not deleted.

Stats on the live site should be edited in Studio → **Media Kit** → Stats (followers, period label, metrics, last updated).

---

## Why we paused

Full automation was scoped, then deprioritized. Manual upload/edit in CMS is enough for the media kit right now.

---

## What was built (local / unreleased)

Code exists in the repo (or was left as local work) but **was not shipped as an active cron on production** when we paused. Nothing should be auto-running.

| Piece | Location |
|---|---|
| OAuth start | `src/app/api/tiktok/connect/route.ts` |
| OAuth callback | `src/app/api/tiktok/callback/route.ts` |
| Sync endpoint | `src/app/api/tiktok/sync/route.ts` |
| Admin UI | `src/app/admin/tiktok/` |
| TikTok helpers | `src/lib/tiktok/` |
| Sanity write client | `src/sanity/writeClient.ts` |
| Private token doc schema | `studio/src/schemaTypes/tiktokConnection.ts` (hidden from Studio structure) |

Cron was drafted in `vercel.json` as `0 15 * * *` → `/api/tiktok/sync`, then **removed** so the job cannot run.

---

## TikTok developer app (already started)

App name: **genamedure** (Business / Web)

| Item | Value / notes |
|---|---|
| Login Kit redirect URI | `https://genamedure.com/api/tiktok/callback` |
| Domain verification | File at `public/tiktokicJ3VgNSMiDtnFhJaMB2M91SBT7qyZs6.txt` (live) |
| Privacy / Terms | `https://genamedure.com/privacy`, `https://genamedure.com/terms` (live) |
| Scopes requested | `user.info.basic`, `user.info.profile`, `user.info.stats`, `video.list` |
| Environment | Sandbox (“testing”); Gena added as authorized/target user |
| App review | **Not submitted** — no demo video; stay in sandbox if/when resuming |
| Localhost redirects | Not usable for Web Login Kit (HTTPS required). Test against production URL or a tunnel |

Credentials live in local `.env.local` / Vercel only — never commit them.

---

## What the API can / can’t do

### Can automate

- TikTok **username** / profile link are hardcoded in the site (not written to Sanity)
- **Follower count** (lifetime total) → `followers`
- Engagement on videos **posted** in a chosen window → `metrics` (post views, likes, comments, shares)

Window is implemented in our code (default was 60 days): list videos newest-first, keep those with `create_time` inside the window, sum each video’s **lifetime** `view_count` / `like_count` / `comment_count` / `share_count`.

That means “posts published in the last N days,” not TikTok Studio’s exact “engagement that occurred in the last N days.” N is arbitrary (30 / 60 / 90 / all-time) — change the cutoff in `src/lib/tiktok/api.ts`.

### Cannot automate (Display API)

- **Profile views** (Studio-only; not exposed)
- True rolling account overview analytics matching Studio 1:1

While syncing, profile views were designed to be **preserved** from the existing Sanity value (or set manually).

---

## Env vars needed to resume

See `.env.example`. Roughly:

```
NEXT_PUBLIC_SITE_URL=https://genamedure.com
SANITY_API_WRITE_TOKEN=          # Sanity manage → API → Editor token
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=            # or TIKTOK_SECRET
TIKTOK_REDIRECT_URI=https://genamedure.com/api/tiktok/callback
TIKTOK_CONNECT_SECRET=
CRON_SECRET=
```

---

## How to pick this back up

1. Confirm TikTok sandbox still has Login Kit + scopes + redirect URI + Gena as target user (or submit for production review with a demo video).
2. Set env vars on Vercel + locally.
3. Re-enable cron in `vercel.json` if daily updates are wanted again, e.g.:

   ```json
   "crons": [{ "path": "/api/tiktok/sync", "schedule": "0 15 * * *" }]
   ```

   Vercel sends `Authorization: Bearer $CRON_SECRET` when `CRON_SECRET` is set.
4. Deploy, open `/admin/tiktok`, Connect once, Run sync, verify Sanity `mediaKit` + site.
5. Decide window (30 vs 60 vs all-time) and whether profile views stay manual forever.

---

## Manual workflow (current)

1. Gena (or Jacob) pulls numbers from TikTok Studio / app.
2. Studio → Media Kit → Stats: update `followers`, `periodLabel`, `postViews`, `profileViews`, `likes`, `comments`, `shares`. (“Last updated” is automatic from publish time.)
3. Publish. Site revalidates ~30s (`getMediaKit`).
