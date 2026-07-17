# Sanity Studio

Standalone Studio for the Gena Medure media kit. Lives inside the site repo at `genamedure/studio`.

**Project:** `ptkp2bg1` · **Dataset:** `production`

## Requirements

- Node.js **≥ 22.12**
- Sanity login (`npx sanity login`)

## Run

From the repo root:

```bash
npm run dev:studio
```

Or from this folder:

```bash
npm install
npm run dev
```

Open [http://localhost:3333](http://localhost:3333).

Edit **Media Kit** → publish.

## Deploy

Hosted at [https://genamedure.sanity.studio](https://genamedure.sanity.studio).

After schema changes:

```bash
npm run deploy
```
