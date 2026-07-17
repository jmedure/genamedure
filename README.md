# Gena Medure — Media Kit

Personal media / brand kit site for Gena Medure.

```
genamedure/
├── src/          # Next.js site (App Router)
├── public/       # Static assets / layout chrome
└── studio/       # Standalone Sanity Studio (edit content here)
```

## Develop — site

```bash
npm install
npm run dev
# or: npm run dev:site
```

Open [http://localhost:3000](http://localhost:3000).

### Env vars

Create a local `.env.local` (gitignored) with:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=ptkp2bg1
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-15
```

If Sanity has no published **Media Kit** document yet, the site falls back to `src/lib/content.ts` defaults and local `public/images/` assets.

### Stats (manual for now)

Update followers / metrics in Studio → **Media Kit** → Stats.  
“Last updated” is automatic from the document’s publish time — no manual field.  
TikTok automation was scoped then **paused** — see [`docs/tiktok-stats-sync.md`](docs/tiktok-stats-sync.md) if we pick it up later.

## Develop — Studio (edit content)

Studio is a **separate app** under `studio/` (not embedded in Next). Needs Node.js ≥ 22.12.

**Production Studio (for Gena):** [https://genamedure.sanity.studio](https://genamedure.sanity.studio)

```bash
npm run dev:studio
# or:
cd studio && npm install && npm run dev
```

First time only: `cd studio && npx sanity login`

Open [http://localhost:3333](http://localhost:3333) locally, or the hosted URL above.

Edit the **Media Kit** singleton → publish. The site revalidates about every 30s.

### What Gena can edit in Studio

- Hero images
- Pronunciation + about (about also drives site meta description)
- Stats: followers, period, post views, profile views, likes, comments, shares
- Gallery clips (video — poster/blur/alt auto-generated from the first frame)
- Hero images (alt auto-generated on upload)
- Brand names list

Name, email, TikTok handle/URL, and brand logos are hardcoded in `src/lib/content.ts`. Hand-drawn scribbles stay in the frontend for now.

## Content fallbacks

| Source | When used |
|--------|-----------|
| Sanity `mediaKit` document | Published fields present |
| `src/lib/content.ts` + `public/images/` | Empty/missing Sanity fields or fetch error |

## Deploy

- **Site:** Vercel (point at this repo root — Next.js)
- **Studio:** [https://genamedure.sanity.studio](https://genamedure.sanity.studio) — redeploy after schema changes with `cd studio && npm run deploy`
