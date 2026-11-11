# VANTA — Footwear Template

A dark, premium footwear storefront template — **Series 01, 10 silhouettes** —
built to be rebranded for one real footwear shop and pitched with a live
preview. No prices, no checkout: the bag is a shortlist, and its call to
action is **"Request this bag"**.

Live target: GitHub Pages at `https://isacPY.github.io/Vantaa/` (repo `Vantaa`).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173/Vantaa/
npm run build    # production build into dist/
npm run preview  # serve the build at http://localhost:4173/Vantaa/
npm test         # node scripts/verify.mjs — static checks (see below)
```

## Routes (hash routing — works on GitHub Pages with no server rewrites)

| Route | Page |
|---|---|
| `#/` | Home — hero spotlight (VERGE 10) + 10-shoe collection grid |
| `#/product/:slug` | Single shoe — slide-in stage, prev/next peeking shoes, size EU 40–46, Add to bag |
| `#/about` | Brand story / manifesto |
| `#/faq` | Accordion, 6 questions |
| `#/contact` | Showroom block + front-end-only form (shows a confirmation, never sends) |

The bag drawer works on every page. It persists in `localStorage`
(`vanta-bag-v1`), supports quantity +/− and remove, and closes on Escape.

## Rebrand it (one file + one data file)

- **`src/config/brand.js`** — name, tagline, series, contact placeholders,
  footer demo note, nav, sizes EU 40–46.
- **`src/data/products.js`** — the 10 shoes: slug, code, colour, description,
  image, and `defaultSize` (EU 45 on VERGE 10 only, matching the source video).
  `image` is a remote Unsplash URL (see Photos). To self-host, put the files
  in `public/images/shoes/` and set each `image` back to
  `'/images/shoes/<file>.jpg'` — `imgSrc` in the components handles both.

No other file needs to change for a rebrand.

## Photos

Free Unsplash images, downloaded and viewed before use — see `IMAGES.md`
for sources and known mismatches (e.g. VECTOR 02 is a leather high-top, not
mesh; RIFT 06 has no yellow trim; EMBER 08 is bright golden-yellow, not
muted mustard; several photos show visible Nike/Jordan branding — acceptable
for a demo template). All files are 1200px wide and under 300 KB.
The live site loads the same verified photos from `images.unsplash.com`:
the GitHub connector cannot push binary files, so the repo is text-only and
the local JPGs in `public/images/shoes/` (workspace only, not in the repo)
are the self-hosting copies.

## Deploy (GitHub Pages)

Push to `main` — `.github/workflows/deploy.yml` builds with `npm ci` +
`npm run build` and deploys `dist/` via `actions/deploy-pages`. Vite
`base` is `/Vantaa/` (see `vite.config.js`); if the repo is ever renamed,
update `base` to match. `public/404.html` redirects unknown paths into the
matching hash route as a fallback. **Do not deploy to Vercel** — GitHub
Pages is the release route for this project (see PLAN.md §10).

## Verify

`npm test` runs `scripts/verify.mjs`:

- all 10 product slugs have a valid image source (verified Unsplash URL,
  or a local file that exists on disk);
- no currency symbols, money amounts, subtotal or payment wording in `src/`
  (the word "checkout" is allowed only in the footer demo note);
- all 5 hash routes present in `src/App.jsx`, with a `hashchange` listener;
- sizes EU 40–46, VERGE 10 default EU 45, exactly 3 video-verified products;
- bag persisted in `localStorage`, "Request this bag" CTA, empty state, Escape closes.

Render verification (per the `patch_delivery_verification` skill): serve with
`npm run preview` and load it in a real browser — hero, grid, product page
and bag must render with **zero console errors**. Build alone is not a pass.

## Stack

Vite 6 + React 18.3.1 + Tailwind CSS v4 (`@tailwindcss/vite`) + GSAP 3.12
(+ ScrollTrigger) + Lenis 1.1 + lucide-react. No router library, no Framer
Motion, no Three.js.
