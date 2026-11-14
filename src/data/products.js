// VANTA — Series 01 products.
// Only VECTOR 02, RIFT 06 and VERGE 10 descriptions are from the video;
// the other 7 names/descriptions are demo copy (marked DEMO below).
// Images (redesign 2026-11-15): 10 clean original AI-rendered chunky
// retro-tech runners, no logos, no text, transparent background, same
// side 3/4 view facing right, same scale, same bottom edge. Each is a
// 1200×800 WebP (aspect 1.5), the shoe normalised to 1080px wide with
// 60px side padding, and the sole at the image bottom edge — so
// `sole` is 0.99 for every shoe (the sole IS the bottom edge) and the
// shoe sits directly on its shelf with a 0px gap. The old Unsplash
// photos (real brand product shots, several with visible Nike/Jordan
// branding) are replaced.
// NOTE: the repo is text-only via the GitHub connector (it cannot push
// binary files), so the 10 WebPs live in public/images/shoes/ in the
// workspace and must be uploaded to the repo (GitHub web UI) for the
// live Pages site to show them — the code already points at the local
// paths. Until then the live site shows broken images; the dev server
// (which serves public/) shows them.

export const products = [
  {
    slug: 'monolith-01',
    code: 'MONOLITH 01',
    name: 'Monolith 01',
    colour: 'cream',
    // DEMO copy
    description: 'A clean silhouette in bone cream.',
    image: '/images/shoes/monolith-01.webp',
    verifiedFromVideo: false,
    sole: 0.99,
    aspect: 1.5,
  },
  {
    slug: 'vector-02',
    code: 'VECTOR 02',
    name: 'Vector 02',
    colour: 'light blue / white mesh',
    description: 'Low, fast and breathable…',
    image: '/images/shoes/vector-02.webp',
    verifiedFromVideo: true,
    sole: 0.99,
    aspect: 1.5,
  },
  {
    slug: 'dune-03',
    code: 'DUNE 03',
    name: 'Dune 03',
    colour: 'beige',
    // DEMO copy
    description: 'Warm beige, built for everyday miles.',
    image: '/images/shoes/dune-03.webp',
    verifiedFromVideo: false,
    sole: 0.99,
    aspect: 1.5,
  },
  {
    slug: 'halo-04',
    code: 'HALO 04',
    name: 'Halo 04',
    colour: 'silver / grey',
    // DEMO copy
    description: 'Cool silver, light on its feet.',
    image: '/images/shoes/halo-04.webp',
    verifiedFromVideo: false,
    sole: 0.99,
    aspect: 1.5,
  },
  {
    slug: 'spike-05',
    code: 'SPIKE 05',
    name: 'Spike 05',
    colour: 'light-blue spiked',
    // DEMO copy
    description: 'Grip for wet ground, light-blue spike plate.',
    image: '/images/shoes/spike-05.webp',
    verifiedFromVideo: false,
    sole: 0.99,
    aspect: 1.5,
  },
  {
    slug: 'rift-06',
    code: 'RIFT 06',
    name: 'Rift 06',
    colour: 'olive + acid lime',
    description: 'Built for rough ground, finished in acid lime.',
    image: '/images/shoes/rift-06.webp',
    verifiedFromVideo: true,
    sole: 0.99,
    aspect: 1.5,
  },
  {
    slug: 'court-07',
    code: 'COURT 07',
    name: 'Court 07',
    colour: 'white / blue',
    // DEMO copy
    description: 'A court classic in white and blue.',
    image: '/images/shoes/court-07.webp',
    verifiedFromVideo: false,
    sole: 0.99,
    aspect: 1.5,
  },
  {
    slug: 'ember-08',
    code: 'EMBER 08',
    name: 'Ember 08',
    colour: 'mustard high-top',
    // DEMO copy
    description: 'A high-top in burnt mustard.',
    image: '/images/shoes/ember-08.webp',
    verifiedFromVideo: false,
    sole: 0.99,
    aspect: 1.5,
  },
  {
    slug: 'scarlet-09',
    code: 'SCARLET 09',
    name: 'Scarlet 09',
    colour: 'red',
    // DEMO copy
    description: 'Full red, impossible to miss.',
    image: '/images/shoes/scarlet-09.webp',
    verifiedFromVideo: false,
    sole: 0.99,
    aspect: 1.5,
  },
  {
    slug: 'verge-10',
    code: 'VERGE 10',
    name: 'Verge 10',
    colour: 'mint / grey / cream retro',
    description: 'A retro trainer with an oversized pull tab.',
    image: '/images/shoes/verge-10.webp',
    verifiedFromVideo: true,
    sole: 0.99,
    aspect: 1.5,
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
