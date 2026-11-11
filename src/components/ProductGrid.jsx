import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { brand } from '../config/brand';
import { products } from '../data/products';
import { navigate } from './Header';

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function imgSrc(image) {
  if (/^https?:\/\//.test(image)) return image;
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}${image}`;
}

// The home screen IS the showcase — the video's wall of shoes on glass
// shelves under spotlights. No hero, no cards, no descriptions: the shoes
// are the page. Hovering a shoe lights the orange glow under it, like the
// video; clicking it opens the full-screen inspect view.
function ShelfShoe({ product, index, eager }) {
  return (
    <button
      type="button"
      onClick={() => navigate(`/product/${product.slug}`)}
      className="showcase-cell group relative block w-full text-left focus-visible:outline-none"
      aria-label={`View ${product.code} — ${product.colour}. ${product.description}`}
    >
      {/* Pool of light on the wall behind the shoe. */}
      <span
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(62% 55% at 50% 36%, rgba(242,237,227,0.14) 0%, transparent 72%)' }}
        aria-hidden="true"
      />
      {/* Spotlight cone falling from above — bright enough to read. */}
      <span
        className="absolute inset-x-0 top-0 bottom-8 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(242,237,227,0.34) 0%, rgba(242,237,227,0.12) 45%, transparent 82%)',
          clipPath: 'polygon(26% 0, 74% 0, 100% 100%, 0 100%)',
        }}
        aria-hidden="true"
      />
      <span className="relative block w-full aspect-[4/3] overflow-hidden">
        <img
          src={imgSrc(product.image)}
          alt={`${product.code} — ${product.colour} shoe`}
          loading={eager ? 'eager' : 'lazy'}
          className="shoe-img absolute inset-0 w-full h-full object-cover"
        />
        {/* Orange glow under the shoe — lights up on hover, like the video. */}
        <span className="shoe-glow absolute left-1/2 bottom-0 -translate-x-1/2 w-[75%] h-[32%]" aria-hidden="true" />
        <span className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink/60 to-transparent" aria-hidden="true" />
      </span>
      {/* The glass shelf the shoe sits on — a ledge with a bright top
          edge, a translucent body and a drop shadow, like the video. */}
      <span
        className="relative block mx-auto w-[88%] h-[7px] rounded-[1px]"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.28) 22%, rgba(255,255,255,0.07) 100%)',
          boxShadow: '0 14px 26px rgba(0,0,0,0.85), 0 2px 6px rgba(0,0,0,0.6)',
        }}
        aria-hidden="true"
      />
      <span className="sr-only">{product.code}</span>
    </button>
  );
}

export default function ProductGrid() {
  const wallRef = useRef(null);
  const driftRef = useRef(null);

  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    if (prefersReducedMotion()) return;
    // Entrance: the shoes rise onto their shelves, one after another.
    const intro = gsap.from(wall.querySelectorAll('.showcase-cell'), {
      y: 28, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.05, delay: 0.1,
    });
    // Slow drift across the wall, like the video's slow camera move.
    const drift = driftRef.current
      ? gsap.to(driftRef.current, { scale: 1.06, duration: 24, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      : null;
    return () => {
      intro.kill();
      drift?.kill();
    };
  }, []);

  return (
    <section id="collection" ref={wallRef} className="relative overflow-hidden" aria-label="The collection">
      {/* Dark gallery wall. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, #17171a 0%, #0b0b0c 70%, #0b0b0c 100%)' }}
        aria-hidden="true"
      />
      <div className="relative max-w-[1440px] mx-auto px-5 md:px-8 pt-8 md:pt-12 pb-8 md:pb-10 flex flex-col min-h-[calc(100vh-65px)]">
        <div>
          <p className="eyebrow text-cream-dim mb-2">Footwear / {brand.series}</p>
          <h1 className="font-display font-black tracking-tight leading-[0.95] text-4xl md:text-6xl">
            {brand.tagline}
          </h1>
        </div>

        <div ref={driftRef} className="flex-1 flex items-center will-change-transform py-8 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12 w-full">
            {products.map((p, i) => (
              <ShelfShoe key={p.slug} product={p} index={i} eager={i < 5} />
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="eyebrow text-cream">{brand.series} / {brand.seriesNote}</p>
          <p className="text-cream-dim">Explore the collection. Select a silhouette.</p>
        </div>
      </div>
    </section>
  );
}
