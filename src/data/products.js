// VANTA — Series 01 products.
// Only VECTOR 02, RIFT 06 and VERGE 10 descriptions are from the video;
// the other 7 names/descriptions are demo copy (marked DEMO below).
// `sole` is where the main shoe's sole sits as a fraction of the photo's
// height. First set by viewing each photo; CORRECTED 2026-11-13 from a
// pixel measurement of all 10 soles on the live homepage (browser task
// 01:04 PKT), anchored on RIFT 06 = 0.48, which an independent pixel scan
// of the live inspect page had already confirmed. The eyeball estimates
// were off by up to 0.13 (EMBER 0.72 → 0.85, HALO 0.88 → 0.78). The
// inspect page and the homepage glow both use it to put the orange
// platform/glow directly under the sole, like the video. `aspect` is the
// photo's w/h.
// Photos: free Unsplash images, verified in IMAGES.md. Known mismatches are
// lived with, not hidden — see IMAGES.md (e.g. 02 is a leather high-top, not
// mesh; 06 has no yellow trim; 08 is bright golden-yellow, not muted mustard;
// several photos show visible Nike/Jordan branding — acceptable for a demo).
// Images are the verified free Unsplash URLs (see IMAGES.md). They are remote
// on purpose: the GitHub connector cannot push binary files, so the repo is
// text-only and the live Pages site loads the same verified photos from
// images.unsplash.com. Local copies live in public/images/shoes/ in the
// workspace; to self-host, set each `image` back to '/images/shoes/<file>'.

export const products = [
  {
    slug: 'monolith-01',
    code: 'MONOLITH 01',
    name: 'Monolith 01',
    colour: 'cream',
    // DEMO copy
    description: 'A clean silhouette in bone cream.',
    image: 'https://images.unsplash.com/photo-1579632265758-674f6e1513b0?q=80&w=1200&auto=format&fit=crop',
    verifiedFromVideo: false,
    sole: 0.78,
    aspect: 1.5,
  },
  {
    slug: 'vector-02',
    code: 'VECTOR 02',
    name: 'Vector 02',
    colour: 'light blue / white mesh',
    description: 'Low, fast and breathable…',
    image: 'https://images.unsplash.com/photo-1685273510889-b2e141259a40?q=80&w=1200&auto=format&fit=crop',
    verifiedFromVideo: true,
    sole: 0.64,
    aspect: 0.563,
  },
  {
    slug: 'dune-03',
    code: 'DUNE 03',
    name: 'Dune 03',
    colour: 'beige',
    // DEMO copy
    description: 'Warm beige, built for everyday miles.',
    image: 'https://images.unsplash.com/photo-1726200333737-a1c85232503a?q=80&w=1200&auto=format&fit=crop',
    verifiedFromVideo: false,
    sole: 0.82,
    aspect: 1.5,
  },
  {
    slug: 'halo-04',
    code: 'HALO 04',
    name: 'Halo 04',
    colour: 'silver / grey',
    // DEMO copy
    description: 'Cool silver, light on its feet.',
    image: 'https://images.unsplash.com/photo-1719523677291-a395426c1a87?q=80&w=1200&auto=format&fit=crop',
    verifiedFromVideo: false,
    sole: 0.78,
    aspect: 1.333,
  },
  {
    slug: 'spike-05',
    code: 'SPIKE 05',
    name: 'Spike 05',
    colour: 'light-blue spiked',
    // DEMO copy
    description: 'Grip for wet ground, light-blue spike plate.',
    image: 'https://images.unsplash.com/photo-1511167814253-23b850fcd859?q=80&w=1200&auto=format&fit=crop',
    verifiedFromVideo: false,
    sole: 0.66,
    aspect: 0.8,
  },
  {
    slug: 'rift-06',
    code: 'RIFT 06',
    name: 'Rift 06',
    colour: 'olive + acid lime',
    description: 'Built for rough ground, finished in acid lime.',
    image: 'https://images.unsplash.com/photo-1597580838322-8c1930a37e7d?q=80&w=1200&auto=format&fit=crop',
    verifiedFromVideo: true,
    sole: 0.48,
    aspect: 1.5,
  },
  {
    slug: 'court-07',
    code: 'COURT 07',
    name: 'Court 07',
    colour: 'white / blue',
    // DEMO copy
    description: 'A court classic in white and blue.',
    image: 'https://images.unsplash.com/photo-1699901232384-f1646fb2a8da?q=80&w=1200&auto=format&fit=crop',
    verifiedFromVideo: false,
    sole: 0.84,
    aspect: 1.5,
  },
  {
    slug: 'ember-08',
    code: 'EMBER 08',
    name: 'Ember 08',
    colour: 'mustard high-top',
    // DEMO copy
    description: 'A high-top in burnt mustard.',
    image: 'https://images.unsplash.com/photo-1631312788472-e90ae179756a?q=80&w=1200&auto=format&fit=crop',
    verifiedFromVideo: false,
    sole: 0.85,
    aspect: 1.425,
  },
  {
    slug: 'scarlet-09',
    code: 'SCARLET 09',
    name: 'Scarlet 09',
    colour: 'red',
    // DEMO copy
    description: 'Full red, impossible to miss.',
    image: 'https://images.unsplash.com/photo-1675625500629-c74de60d7c2b?q=80&w=1200&auto=format&fit=crop',
    verifiedFromVideo: false,
    sole: 0.87,
    aspect: 1.277,
  },
  {
    slug: 'verge-10',
    code: 'VERGE 10',
    name: 'Verge 10',
    colour: 'mint / grey / cream retro',
    description: 'A retro trainer with an oversized pull tab.',
    image: 'https://images.unsplash.com/photo-1583426087887-accad2c41dc2?q=80&w=1200&auto=format&fit=crop',
    verifiedFromVideo: true,
    sole: 0.81,
    aspect: 1.511,
    // Matches the video frame: EU 45 pre-selected on VERGE 10 only.
    defaultSize: 45,
  },
];

export const heroProduct = products.find((p) => p.slug === 'verge-10');

export function getProduct(slug) {
  return products.find((p) => p.slug === slug) || null;
}

export function getNeighbours(slug) {
  const i = products.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null, index: -1 };
  return {
    prev: products[(i - 1 + products.length) % products.length],
    next: products[(i + 1) % products.length],
    index: i,
  };
}
