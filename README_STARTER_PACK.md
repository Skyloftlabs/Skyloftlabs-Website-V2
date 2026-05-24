# Skyloft Labs — Starter Pack (Eleventy + Cloudflare Pages)

## Run locally

```bash
npm install
npm run dev
```

Build output goes to `_site/`.

## Deploy on Cloudflare Pages
Set:
- Build command: `npm run build`
- Output directory: `_site`

## Add a new product
Edit `src/_data/products.json` and add an object with a unique `slug`.
A detail page will be generated at `/pages/products/<slug>/`.

## Add a new consulting offering
Edit `src/_data/consulting.json`.
A detail page will be generated at `/pages/consulting/<slug>/`.

## Add a new niche
Edit `src/_data/niches.json` and reference products and consulting by slug.

## Contact form
- Form posts to `/api/submit`
- Function lives at `functions/api/submit.js`

Optional:
- Add Turnstile: replace `YOUR_TURNSTILE_SITE_KEY` in `src/_includes/components/formContact.njk`
- Set `TURNSTILE_SECRET` as a Pages environment variable

Optional storage:
- Bind a D1 database as `DB` in Pages project settings
