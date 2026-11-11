# VANTA — Footwear Template Plan

Status: ACTIVE — Phase 1 face first, Phase 2 inner pages, then GitHub + Vercel deploy.
Brand: VANTA (kept, per essa). Tagline: "Form, fit from within." (NOT "lit" — verified from the reel).
Source: Instagram reel https://www.instagram.com/reel/Dfkh9LHARcY/ by @cw_fy1 (verified by browser watch, 2026-11-11).
Stack: Vite + React 18.3.1 + Tailwind CSS v4 + GSAP 3.12 + ScrollTrigger + Lenis 1.1 (same fast base as Firnature). GSAP only — NO Framer Motion. Animate transform/opacity only (GPU). No Three.js. WebP/JPG images, lazy-load below fold.

## 1. Design review (senior designer — plan-design-review, adapted: no user questions, essa said results at end only)

Design completeness at plan start: 6/10 — hero/grid/product/bag are specified from the video; About/FAQ/Contacts copy, footer, mobile nav, empty/error states and exact type scale were not in the video and are decided here (see below).

- Hierarchy: 1st = the shoe (huge, lit, centre), 2nd = VANTA wordmark + "Form, fit from within.", 3rd = SERIES 01 / 10 SILHOUETTES + nav. Every screen passes the trunk test (where am I, what's here, what can I do, how do I get back).
- One strong visual anchor per screen: hero = single shoe on orange-glowing platform; collection = 10 shoes under spotlights; product = one shoe sliding in.
- Colour: near-black background #0B0B0C / #101012, warm cream text #F2EDE3, orange accent #FF6A1A (glow under hovered/active shoe, platform glow). Pale-cream bag drawer #F2EDE3 with ink text. No decorative shadows — premium comes from spotlight gradients, not box-shadows.
- Type: display — a condensed grotesque (system fallback stack: "Archivo", "Inter", system-ui; load Archivo + Inter via Google Fonts with display=swap, fall back cleanly offline). Eyebrow labels 11px uppercase, letter-spacing 0.18em. Product names large, tight tracking.
- Motion: one authored moment per viewport. Shoes slide in horizontally (x transform), spotlights fade in, hover = orange glow under shoe (opacity + scale of a radial gradient, no layout shift). No carousel without narrative purpose — the prev/next peeking shoes ARE the navigation.
- Subtraction: no generic 3-column features, no "why choose us" filler. Sections earn pixels or are cut.
- Responsive = intentional, not stacked: mobile = 2-column grid, single shoe full-width, bag drawer full-width, nav collapses to a menu button; touch targets >=44px; hover glow becomes tap-active on touch.
- Accessibility: keyboard — grid items are buttons, product page focus-visible, bag drawer traps focus and closes on Escape, aria-labels on bag/close/size buttons; prefers-reduced-motion — Lenis off, GSAP reveals become instant (same rule as Firnature: Lenis skipped for prefers-reduced-motion, viewport <768px, or coarse pointer <1024px); contrast — cream on near-black ~15:1, orange used only for glow/accents, never as sole text colour on dark.
- Edge cases: bag empty state ("Your bag is empty — explore the collection", CTA to grid); size not selected → "Select a size" hint, Add disabled until a size is picked; long product names wrap, never clip; missing image → dark placeholder with shoe initial, never a broken icon.

## 2. CEO / strategy review (plan-ceo-review, adapted)

- Real problem: a footwear shop owner whose site is missing, expired or embarrassing loses the customers who check them online before visiting/buying. The template is the proof; the product is the outcome (a shop whose site finally looks as good as its shoes, live in days).
- Buyer: independent footwear / sneaker shop owner, UK/US/AU first (essa's market), with no site or a bad one. NOT a generic SaaS buyer.
- Do-nothing cost: every Google/Instagram check that lands on a dead site is a lost walk-in / order.
- 10x check: the best version is not "10 shoes" — it is a template a real owner can picture their own shoes in within 5 minutes (rebrand via one config file, like Firnature's brand.js). So: all brand copy, product data and contact in `src/config/brand.js` + `src/data/products.js`.
- Dream state (12 months): VANTA rebranded for one real footwear shop, pitched with a live preview (Ælfred lesson from Firnature: pick ONE real buyer, contact before more design work; smallest sellable thing = rebrand for one owner). Phase 3, NOT this build.
- Scope challenge: do NOT build a store (no checkout, no payments, no CMS, no accounts). The video shows a bag drawer, not a checkout — the bag is a shortlist, like Firnature's bag. That is the correct scope for a pitch template.
- What already exists (reuse): Firnature's patterns — Vite+React+Tailwind v4+GSAP+Lenis, localStorage bag, Lenis mobile fallback, render-verify via `npx vite preview`. Do not reinvent.

## 3. Site map (Phase 1 = face, Phase 2 = inner pages)

- `/` Home — header (VANTA logo, Home/About/FAQ/Contacts, bag button), then the SHOWCASE, which IS the home: no hero, no cards. Full-viewport dark wall, 10 shoes on glass shelves (2 rows x 5 on desktop, 2 columns on mobile), a spotlight cone falling over each shoe, tagline "Form, fit from within." top-left, bottom bar "SERIES 01 / 10 SILHOUETTES" + "Explore the collection. Select a silhouette.", footer. Hover (or tap) a shoe: orange glow lights under it and the shoe lifts; clicking it opens the inspect view.
- `/product/:slug` Inspect (full-screen) — the shoe fills the screen, huge and centred on the orange-glowing platform, prev/next shoe peeking at the SCREEN edges (clickable to move, plus overlay arrows and arrow keys). Title top-left over the stage; details docked to the right edge of the stage (description, "Choose a size / Select a size" EU 40–46, EU 45 pre-selected on VERGE 10 only to match the video frame; others no pre-selection, Add to bag), below the stage on mobile. Back to collection above the stage; prev ← current → next caption below it.
- `/about` About — short brand story, "Form, fit from within." manifesto, series note. (Phase 2)
- `/faq` FAQ — accordion, 6 questions (sizing, delivery, returns, rebrand/demo note, contact). (Phase 2)
- `/contact` Contacts — showroom/contact block, form (front-end only, no backend — shows a confirmation state, does not send). (Phase 2)
- Bag drawer (all pages) — pale-cream "YOUR BAG" drawer slides in from right, backdrop blurs/dims grid, items with thumbnails + quantity +/-, remove, "Request this bag" CTA (no checkout). No prices anywhere (see §5).

## 4. Products (10) — 3 verified from video, 7 demo names (marked DEMO in code comments)

| # | Code | Colour (video) | Description |
|---|------|----------------|-------------|
| 01 | MONOLITH 01 | cream | "A clean silhouette in bone cream." (demo copy) |
| 02 | VECTOR 02 | light blue/white mesh | "Low, fast and breathable…" (video) |
| 03 | DUNE 03 | beige | "Warm beige, built for everyday miles." (demo copy) |
| 04 | HALO 04 | silver/grey | "Cool silver, light on its feet." (demo copy) |
| 05 | SPIKE 05 | light-blue spiked | "Grip for wet ground, light-blue spike plate." (demo copy) |
| 06 | RIFT 06 | olive + acid lime | "Built for rough ground, finished in acid lime." (video) |
| 07 | COURT 07 | white/blue | "A court classic in white and blue." (demo copy) |
| 08 | EMBER 08 | mustard high-top | "A high-top in burnt mustard." (demo copy) |
| 09 | SCARLET 09 | red | "Full red, impossible to miss." (demo copy) |
| 10 | VERGE 10 | mint/grey/cream retro | "A retro trainer with an oversized pull tab." (video) |

## 5. What is NOT in scope (Firnature scope rule)

No backend/CMS, no real prices, no checkout/payment, no Terms/Privacy pre-sale, no real contact details (demo placeholders only). Prices/subtotal in the video were too small to read — do NOT invent them. Bag shows no amounts; CTA is "Request this bag" (enquiry), matching Firnature's no-price convention. Real photos, prices, backend and legal pages happen AFTER a deal, not before.

## 6. Animation spec (GSAP + Lenis)

- Lenis smooth scroll, synced with ScrollTrigger; skipped on prefers-reduced-motion / <768px / coarse pointer <1024px (native scroll fallback).
- Showcase: shoes rise onto their shelves on load (y:28→0, opacity, stagger 0.05s); the wall drifts slowly (scale 1→1.06, 24s, yoyo) like the video's slow camera move; hover/tap: orange radial glow under shoe (opacity 0→1, 0.25s), shoe lifts y:-6px.
- Inspect carousel: a CSS transition on the track transform (0.7s, cubic-bezier(0.65, 0, 0.35, 1)), position = pure arithmetic from the measured stage width (slide 78%, peek 11% each side). Wrap-around clones at both ends so a neighbour always peeks; on a wrap jump the track is pre-snapped on the DOM node in the click handler BEFORE the route changes — a render-time snap flag was tried first and failed (React batched the restoring render before paint, so the wrap swept instead of snapping). No GSAP context/revert on the track: the old GSAP carousel went one shoe off after repeated in-app navigations (live bug, 2026-11-12).
- Bag: drawer x:100%→0 (0.35s, power3.out), backdrop blur fades in; item add = drawer opens, item row fades in.
- No layout-animating properties (no width/height/top/left animation). `will-change: transform` only on animated elements, removed after.

## 7. Performance budget

- First paint: hero only; JS < 180KB gz (React+GSAP+Lenis, code-split routes); images lazy below fold; each shoe image <=300KB.
- Targets (local preview, not a promise): LCP < 2.5s, no console errors, 0 layout shift on grid reveal. Lighthouse to be run after deploy if available.
- Fonts: 2 families max, display=swap.

## 8. Images (scrape — see IMAGES.md)

- VANTA site in the video is localhost:9542 — NOT public, cannot be scraped. Verified: no public VANTA site exists to scrape from; the reel is a local demo recording.
- Photos sourced instead from free Unsplash (images.unsplash.com ONLY; plus.unsplash.com is watermarked — unusable). Each candidate downloaded and viewed before use. See IMAGES.md for URLs, credits and mismatches.

## 9. Verification (patch_delivery_verification)

Build passes + `node scripts/verify.mjs` (routes, no-price check, bag logic) + render check in a real browser against `npx vite preview` (zero console errors, hero/grid/product/bag all render, bag add/remove/quantity works, Escape closes drawer) BEFORE calling the build good. Then live re-audit in the cloud browser after Vercel deploy.

## 10. Release — UPDATED 2026-11-12: GitHub Pages, NOT Vercel

- Essa: waiting on Vercel would be a waste of time. Do NOT chase Vercel reconnect, do NOT pause for Vercel approval, do NOT spend time on Vercel OAuth / CLI device codes (already failed repeatedly: callback blocked, codes expired).
- Deploy live via GitHub Pages from the new repo — no extra login needed, GitHub already connected.
- GitHub: NEW public repo, try `Vanta` first, fall back `vanta-footwear` / `Vanta-Footwear`. Push main only. Never touch Firnature or any other repo.
- Pages method: GitHub Actions workflow deploying the Vite build output (`.github/workflows/deploy.yml`, `actions/deploy-pages`), OR gh-pages branch — whichever is cleanest. Vite `base` MUST be set to the repo path (e.g. `/Vanta/` if repo is Vanta, `/vanta-footwear/` if fallback) — set it from the actual repo name at build time and record it.
- Routing on Pages: use HASH routing (no react-router dependency; routes `#/`, `#/product/:slug`, `#/about`, `#/faq`, `#/contact` via state + hashchange) so deep links / refresh work on Pages. Also ship a `404.html` copy of `index.html` as a belt-and-braces fallback. Note the hash-routing choice in the final report.
- Verify the live GitHub Pages URL in the cloud browser (parent agent does the live browser audit; coordinator reports the URL + evidence).
- If GitHub Pages hits a blocker, do NOT fall back to Vercel. Deliver the finished built site + repo, with the Pages URL attempt and the exact blocker noted.
- BLOCKER 2026-11-12 ~00:20 PKT: repo creation via the GitHub connector FAILED — `create_repository "Vanta"` → `403 Resource not accessible by integration` (POST https://api.github.com/user/repos). Verified: no Vanta repo exists (search: 0 results; account has only collage-management-system + Firnature). The App token can write existing repos but cannot create repos. Do NOT retry the same call. Handover: create the empty public repo `isacPY/Vanta` in a browser, then push the ready snapshot (`~/workspace/projects/vanta-push-manifest.txt`, 30 text files) with `github push-files`, then enable Pages → GitHub Actions. Full steps in HANDOVER.md. Live URL will be https://isacPY.github.io/Vanta/ (NOT verified live — no repo yet).
- IMAGES CHANGE 2026-11-12: product images are remote verified Unsplash URLs in the repo (connector cannot push binary files), not local files. Local JPG copies stay in the workspace at public/images/shoes/ for self-hosting; imgSrc handles both. verify.mjs updated to accept remote Unsplash URLs; all 10 return HTTP 200; npm test + build re-passed after the change.
- Phase 3 (not this build): pick ONE real footwear buyer, rebrand preview, pitch email.

## Decisions made (auto-decided, essa said results at end only)

- Keep VANTA name + footwear. Stack = Vite+React+Tailwind v4+GSAP+Lenis, no Framer Motion.
- No prices in template (video prices unreadable; Firnature convention).
- 7 product names/descriptions are demo inventions, clearly marked — only VECTOR 02, RIFT 06, VERGE 10 copy is from the video.
- About/FAQ/Contacts copy is demo copy written for the template, not from the video (video had no such pages visible).
