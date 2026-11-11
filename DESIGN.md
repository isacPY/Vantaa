# VANTA — Design notes

## Tokens

| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#0B0B0C` | Page background |
| `--color-ink-2` | `#101012` | Panels, image backs |
| `--color-cream` | `#F2EDE3` | Text, bag drawer background |
| `--color-cream-dim` | `#B8B2A4` | Secondary text on dark |
| `--color-accent` | `#FF6A1A` | Orange glow, platform glow, active states |
| `--font-display` | Archivo (900/800), Inter/system fallback | Headlines, product codes, wordmark |
| `--font-sans` | Inter, system-ui | Body copy |

- Eyebrow labels: 11px, uppercase, 0.18em letter-spacing.
- No decorative box-shadows: premium comes from spotlight radial gradients,
  not shadows.
- Cream on near-black ≈ 15:1. Orange is glow/accent only, never the sole
  text colour on dark.
- Fonts load from Google Fonts with `display=swap` and fall back cleanly
  offline (Archivo → Inter → system-ui).

## Decisions

- **Hero shoe is VERGE 10** (10-verge.jpg): mint on pure black is the best
  hero shot and matches the video's spotlight shoe.
- **Grid is 5 columns × 2 rows on desktop, 2 columns on mobile.** Photos
  have mixed aspect ratios (some portrait, some landscape), so every card is
  a fixed `aspect-[4/5]` frame with `object-fit: cover` plus a dark
  spotlight gradient overlay — the grid looks unified without re-cropping
  any photo.
- **Hover/tap glow**: an orange radial gradient under each shoe, opacity +
  scale only (0.25s), shoe lifts 6px. No layout shift.
- **Product page**: shoe slides in horizontally from the side it was entered
  from; prev/next shoes peek at the edges as clickable cards. Size EU 40–46;
  EU 45 pre-selected **only** on VERGE 10, to match the video frame.
- **Bag is a shortlist, not a store**: pale-cream drawer from the right,
  blurred/dimmed backdrop, thumbnails + quantity +/− + remove, persisted in
  `localStorage`, CTA "Request this bag" (front-end confirmation state, no
  send). No prices anywhere — the video's prices were unreadable and
  Firnature's no-price convention applies.
- **Hash routing** (`#/`, `#/product/:slug`, `#/about`, `#/faq`,
  `#/contact`) via state + `hashchange`, no router library — required for
  GitHub Pages, where there are no server rewrites. `public/404.html`
  redirects stray paths into the matching hash route.
- **Motion**: GSAP + ScrollTrigger + Lenis only, transform/opacity only.
  Lenis is skipped for `prefers-reduced-motion`, viewport < 768px, or coarse
  pointer < 1024px (native scroll fallback); GSAP reveals become instant
  under reduced motion. This is the same rule as Firnature.
- **Accessibility**: grid items are `<button>`s, drawer traps focus and
  closes on Escape, `aria-label`s on bag/close/size buttons, `aria-pressed`
  on sizes, `focus-visible` orange outline, touch targets ≥ 44px, mobile nav
  collapses to a menu button.
- **Performance**: JS split into react-core / gsap-core / lenis-core / icons
  chunks; total JS ≈ 110 KB gz (budget < 180 KB). Images lazy below the fold
  (first grid row eager); every shoe photo ≤ 300 KB.

## Deviations from the video (with reasons)

- **7 of 10 product names/descriptions are demo inventions** (marked `DEMO`
  in `src/data/products.js`). Only VECTOR 02, RIFT 06 and VERGE 10 copy is
  from the video — the reel shows no copy for the other seven.
- **Photo mismatches, lived with** (see `IMAGES.md`): VECTOR 02 is a leather
  high-top with a red zip-tie tag, not mesh; RIFT 06 has no yellow trim;
  EMBER 08 is bright golden-yellow, not muted mustard; several photos show
  visible Nike/Jordan branding. None were re-sourced — the colours and
  silhouettes are the closest acceptable matches, and the branding is
  acceptable for a demo template. Nothing was cropped out or hidden.
- **About / FAQ / Contacts copy is demo copy** written for the template —
  the video shows no such pages. Contact details are placeholders
  (`hello@vanta.example`, demo showroom address).
- **VECTOR 02 description kept as "Low, fast and breathable…"** — exactly as
  written in PLAN.md §4, ellipsis included.
- **404.html is a redirect script, not a copy of index.html.** Hash routing
  already handles deep links on Pages; the 404 only needs to translate a
  stray path (`/Vanta/product/verge-10`) into its hash route.
- **No Vercel.** Release is GitHub Pages only, per PLAN.md §10 (essa:
  waiting on Vercel would be a waste of time). Vite `base` is `/Vanta/`.
