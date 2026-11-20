import React, { useEffect, useRef, useState } from 'react';
import { brand } from '../config/brand';
import { products } from '../data/products';

// Local images live under the Vite base (/Vantaa/ on Pages, / in dev
// with the base set) — prepend it so an absolute path resolves.
function imgSrc(image) {
  if (/^https?:\/\//.test(image)) return image;
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}${image}`;
}

// Redesign 2026-11-15 (VANTA): the home screen IS the showcase — the
// wall of shoes on glass shelves under soft diffused light. No labels:
// the grid shows ONLY shoes, shelves and light. Names appear only on
// the detail page. Each shoe fills ~88% of its cell; the sole rests
// DIRECTLY on the shelf (the new cut-out images have the sole at the
// image bottom edge, so the image bottom = the shelf top, 0px gap).
// The wall is one container that the collection page scales/translates
// for the camera zoom; each tile fades/blurs as it leaves the viewport.

function ShelfShoe({ product, index, activeSlug, isNeighbour, isZoomed, onSelect, registerShoeRef }) {
  const isActive = product.slug === activeSlug;
  // Trailing orange glow: local state + a 90ms leave delay, so sweeping
  // the mouse across several shoes leaves 2–3 shelves glowing at once.
  // FAST fade-in (0.15s), SLOW fade-out (0.9s).
  const [lit, setLit] = useState(false);
  const leaveTimer = useRef(null);

  useEffect(() => () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  }, []);
  const handleEnter = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setLit(true);
  };
  const handleLeave = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setLit(false), 90);
  };

  // Zoom fade/blur (1.1s, same ease as the wall zoom): the active shoe
  // stays, its neighbours stay visible at 50% + blur 2px (cut off at
  // the screen edges), everything else fades out + blurs to 6px.
  let tileOpacity = 1;
  let tileBlur = 0;
  if (isZoomed) {
    if (isActive) {
      tileOpacity = 1;
      tileBlur = 0;
    } else if (isNeighbour) {
      tileOpacity = 0.5;
      tileBlur = 2;
    } else {
      tileOpacity = 0;
      tileBlur = 6;
    }
  }

  const glowStrong = isActive && isZoomed;

  return (
    <button
      type="button"
      onClick={() => onSelect(product.slug)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      className="showcase-cell cell-in group relative block w-full cursor-pointer text-left focus-visible:outline-none"
      style={{ animationDelay: `${0.1 + index * 0.05}s` }}
      aria-label={`View ${product.code} — ${product.colour}. ${product.description}`}
    >
      <div
        style={{
          opacity: tileOpacity,
          filter: `blur(${tileBlur}px)`,
          transition: 'opacity 1.1s cubic-bezier(0.65,0,0.25,1), filter 1.1s cubic-bezier(0.65,0,0.25,1)',
        }}
      >
        {/* Shoe. The wrapper is 3:2 and the image is 1200×800 (3:2), so
            it fills exactly; the sole is at the image bottom edge, which
            sits directly on the shelf top below. Lifts 3–4px on hover
            (only while unzoomed). */}
        <div
          ref={(el) => registerShoeRef(product.slug, el)}
          className="relative mx-auto aspect-[3/2] w-[98%] transition-transform duration-150 ease-out"
          style={{ transform: !isZoomed && lit ? 'translateY(-4px)' : 'translateY(0)' }}
        >
          <img
            src={imgSrc(product.image)}
            alt={`${product.code} — ${product.colour} shoe`}
            loading={index < 5 ? 'eager' : 'lazy'}
            className="shoe-img absolute inset-0 h-full w-full object-contain"
          />
          {/* Tiny soft contact shadow only. */}
          <span className="contact-shadow pointer-events-none absolute -bottom-1 left-1/2 h-3 w-3/4 -translate-x-1/2" aria-hidden="true" />
        </div>

        {/* Glass shelf + trailing orange glow. The glow sits on the shelf
            (line at the shelf top + blurred ellipse), never over the shoe. */}
        <div className={`relative mx-auto w-[92%] ${glowStrong ? 'glow-strong' : ''}`}>
          <div className="shelf-bar relative" aria-hidden="true" />
          <div className="shelf-reflection relative" aria-hidden="true" />
          <div
            data-testid="shelf-glow"
            className="pointer-events-none absolute inset-x-0 top-0"
            style={{
              opacity: lit || glowStrong ? 1 : 0,
              transitionProperty: 'opacity',
              transitionDuration: lit ? '0.15s' : '0.9s',
              transitionTimingFunction: 'ease-out',
            }}
            aria-hidden="true"
          >
            <div className="glow-line absolute top-0 left-1/2 h-[2px] w-[100%] -translate-x-1/2" />
            <div className="glow-ellipse absolute top-[2px] left-1/2 h-[20px] w-[110%] -translate-x-1/2" />
          </div>
        </div>
      </div>
      <span className="sr-only">{product.code}</span>
    </button>
  );
}

export default function ProductGrid({ activeSlug, isZoomed, isDetailOpen, onSelect, registerShoeRef, wallRef, wallTransform, wallOrigin, snap }) {
  const activeIndex = products.findIndex((p) => p.slug === activeSlug);

  const { scale, x, y } = wallTransform || { scale: 1, x: 0, y: 0 };

  return (
    <section
      id="collection"
      ref={wallRef}
      className="wall relative overflow-hidden"
      style={{
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        transformOrigin: wallOrigin || '50% 50%',
        transition: snap ? 'none' : 'transform 1.1s cubic-bezier(0.65,0,0.25,1)',
        willChange: 'transform',
      }}
      aria-label="The collection"
    >
      <div className="relative mx-auto flex min-h-[calc(100vh-64px)] w-[90vw] max-w-[1440px] flex-col px-4 pt-20 md:min-h-[calc(100vh-72px)]">
        {/* 5 soft diffused beams (one per column) + light pools, behind
            the shoes. Hidden below md (the grid is 2-col there). */}
        <div className="pointer-events-none absolute inset-x-4 top-0 hidden h-full md:block" aria-hidden="true">
          <div className="grid h-full grid-cols-5 gap-x-4">
            {[0, 1, 2, 3, 4].map((col) => (
              <div key={col} className="beam-breathe relative h-full" style={{ animationDelay: `${col * 0.5}s` }}>
                <div className="spotlight-pool absolute -top-10 left-1/2 h-[90px] w-[130%] -translate-x-1/2" />
                <div className="spotlight-beam absolute top-0 left-1/2 h-[72%] w-[110%] -translate-x-1/2" />
              </div>
            ))}
          </div>
        </div>

        {/* Eyebrow + heading, left-aligned with the grid, close above
            row 1. Fades out as soon as a product opens (isDetailOpen),
            not only once the wall scale passes 1 — so the detail title
            never overlaps it, even if the zoom is still starting. */}
        <div
          className="relative z-10 mb-6"
          style={{
            opacity: isDetailOpen ? 0 : 1,
            transition: 'opacity 0.5s ease',
          }}
        >
          <p className="mb-3 text-[10px] font-semibold tracking-[0.24em] text-cream-dim uppercase">
            Footwear&nbsp;&nbsp;/&nbsp;&nbsp;{brand.series}
          </p>
          <h1 className="text-[30px] leading-tight font-medium tracking-tight text-cream">
            {brand.tagline}
          </h1>
        </div>

        {/* Compact grid: 5 columns, ~16px gap, 2 rows, vertically
            centered in the space below the heading, no large void. */}
        <div className="relative z-10 flex flex-1 flex-col justify-center pb-8">
          <div className="grid w-full grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-3 lg:grid-cols-5">
            {products.map((p, i) => {
              const isNeighbour =
                activeIndex !== -1 &&
                (i === (activeIndex - 1 + products.length) % products.length ||
                  i === (activeIndex + 1) % products.length);
              return (
                <ShelfShoe
                  key={p.slug}
                  product={p}
                  index={i}
                  activeSlug={activeSlug}
                  isNeighbour={isNeighbour}
                  isZoomed={isZoomed}
                  onSelect={onSelect}
                  registerShoeRef={registerShoeRef}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom bar: series + the invite line from the video. Fades
            out as soon as a product opens (it is not part of the detail
            view). */}
        <div
          className="relative z-10 flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-5 pb-8 sm:flex-row sm:items-center"
          style={{
            opacity: isDetailOpen ? 0 : 1,
            transition: 'opacity 0.5s ease',
          }}
        >
          <p className="eyebrow text-cream">{brand.series} / {brand.seriesNote}</p>
          <p className="text-cream-dim">Explore the collection. Select a silhouette.</p>
        </div>
      </div>
    </section>
  );
}
