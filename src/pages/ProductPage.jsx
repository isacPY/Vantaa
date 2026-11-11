import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { SIZES } from '../config/brand';
import { getNeighbours, getProduct, products } from '../data/products';
import { useBag } from '../state/store';
import { navigate } from '../components/Header';

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function imgSrc(image) {
  if (/^https?:\/\//.test(image)) return image;
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}${image}`;
}

// Each slide is 78% of the stage width, so the neighbours peek in ~11%
// on each side — the full-screen inspect view from the video.
const SLIDE = 0.78;
const PEEK = (1 - SLIDE) / 2;

// Inspect: one shoe, huge, centred on a glowing orange platform, the
// neighbours peeking at the screen edges, the details docked right.
// The track position is pure arithmetic from the measured stage width,
// driven by a CSS transition — no animation library state to go stale,
// so the slide always lands on the right shoe.
export default function ProductPage({ slug }) {
  const product = getProduct(slug);
  const { prev, next, index } = getNeighbours(slug || '');
  // Track order: last shoe cloned before the first, first shoe cloned
  // after the last — so a neighbour always peeks in, even at the ends.
  const slides = [products[products.length - 1], ...products, products[0]];
  const { add } = useBag();
  const [size, setSize] = useState(product?.defaultSize ?? null);
  const [added, setAdded] = useState(false);
  const wrapRef = useRef(null);
  const [stageW, setStageW] = useState(0);

  // Measure the stage; the track position follows from it.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const update = () => setStageW(wrap.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  // Reset size when the shoe changes (VERGE 10 keeps its EU 45 default).
  useEffect(() => {
    setSize(product?.defaultSize ?? null);
    setAdded(false);
  }, [slug, product]);

  // Navigate, snapping the track instantly when wrapping around the
  // ends (VERGE 10 → MONOLITH 01 or back). The snap is done on the DOM
  // node BEFORE the route changes, so it cannot be undone by render
  // batching: the next render writes the same transform value, and a
  // transition never runs because the value does not change.
  const goTo = (targetSlug) => {
    const target = getNeighbours(targetSlug);
    const wraps =
      (index === products.length - 1 && target.index === 0) ||
      (index === 0 && target.index === products.length - 1);
    if (wraps && wrapRef.current) {
      const track = wrapRef.current.firstElementChild;
      if (track) {
        const x = stageW * PEEK - (target.index + 1) * stageW * SLIDE;
        track.style.transition = 'none';
        track.style.transform = `translateX(${x}px)`;
      }
    }
    navigate(`/product/${targetSlug}`);
  };

  // Arrow keys move through the collection.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goTo(next.slug);
      if (e.key === 'ArrowLeft') goTo(prev.slug);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  if (!product) {
    return (
      <main className="max-w-[1440px] mx-auto px-5 md:px-8 py-20 text-center">
        <p className="eyebrow text-accent mb-4">Not found</p>
        <h1 className="font-display font-black text-4xl uppercase mb-4">No such silhouette</h1>
        <p className="text-cream-dim mb-8">That shoe is not part of Series 01.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="bg-cream text-ink font-semibold px-6 py-3 min-h-[44px]"
        >
          Back to the collection
        </button>
      </main>
    );
  }

  const handleAdd = () => {
    if (size == null) return;
    add(product.slug, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  // Track offset that centres the current shoe (visual position index + 1).
  const trackX = stageW * PEEK - (index + 1) * stageW * SLIDE;
  const reduced = prefersReducedMotion();

  return (
    <main className="flex-1">
      <div className="max-w-[1440px] mx-auto px-5 md:px-8 pt-6 md:pt-8">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 eyebrow text-cream-dim hover:text-accent transition-colors min-h-[44px] mb-4 md:mb-6"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back to collection
        </button>
      </div>

      <div className="relative">
        {/* Full-width stage: the shoe fills the screen, neighbours peek. */}
        <div ref={wrapRef} className="relative w-full h-[56vh] md:h-[68vh] overflow-hidden bg-ink-2">
          <div
            className="flex h-full will-change-transform"
            style={{
              transform: `translateX(${trackX}px)`,
              transition: reduced ? 'none' : 'transform 0.9s cubic-bezier(0.45, 0, 0.55, 1)',
            }}
          >
            {slides.map((p, i) => {
              const active = i === index + 1;
              const clone = i === 0 || i === slides.length - 1;
              return (
                <button
                  key={`${p.slug}-${i}`}
                  type="button"
                  onClick={() => { if (!active) goTo(p.slug); }}
                  aria-label={active ? `${p.code} — current silhouette` : `View ${p.code}`}
                  aria-current={active || undefined}
                  aria-hidden={clone || undefined}
                  tabIndex={clone ? -1 : 0}
                  className="relative h-full w-[78%] shrink-0 overflow-hidden spotlight text-left focus-visible:outline-none"
                >
                  <img
                    src={imgSrc(p.image)}
                    alt={active ? `${p.code} — ${p.colour} shoe` : ''}
                    aria-hidden={!active}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Neighbours sit dimmed until they slide into the middle. */}
                  <span
                    className="absolute inset-0 bg-ink transition-opacity duration-500"
                    style={{ opacity: active ? 0 : 0.55 }}
                    aria-hidden="true"
                  />
                  <span className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/70 to-transparent pointer-events-none" aria-hidden="true" />
                  {active && (
                    <>
                      {/* The glowing orange platform the shoe stands on.
                          Painted after the bottom gradient so the gradient
                          never dims it — it must read on light photos too. */}
                      <span
                        className="absolute left-1/2 bottom-[1%] -translate-x-1/2 w-[100%] h-[24%] rounded-full pointer-events-none"
                        style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,106,26,0.4) 0%, transparent 70%)' }}
                        aria-hidden="true"
                      />
                      <span
                        className="absolute left-1/2 bottom-[2%] -translate-x-1/2 w-[90%] h-[36%] rounded-full pointer-events-none"
                        style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,106,26,0.95) 0%, rgba(255,106,26,0.45) 55%, transparent 100%)' }}
                        aria-hidden="true"
                      />
                      <span className="absolute left-1/2 bottom-[6%] -translate-x-1/2 w-[62%] h-[3px] bg-accent blur-[1px] pointer-events-none" aria-hidden="true" />
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Dark scrim so the white title reads on light photos too. */}
          <span
            className="absolute inset-x-0 top-0 h-44 md:h-56 z-[5] pointer-events-none"
            style={{ background: 'linear-gradient(180deg, rgba(11,11,12,0.88) 0%, rgba(11,11,12,0.5) 55%, transparent 100%)' }}
            aria-hidden="true"
          />
          {/* Title over the stage, top-left — like the video. */}
          <div className="absolute top-5 left-5 md:top-8 md:left-8 z-10 pointer-events-none">
            <p className="eyebrow text-accent mb-2">Series 01 — {product.colour}</p>
            <h1 className="font-display font-black uppercase tracking-tight leading-[0.95] text-4xl md:text-6xl">
              {product.code}
            </h1>
            <p className="eyebrow text-cream/70 mt-3">
              {String(index + 1).padStart(2, '0')} / 10 — Series 01
            </p>
          </div>

          <button
            type="button"
            onClick={() => goTo(prev.slug)}
            aria-label={`Previous shoe: ${prev.code}`}
            className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-ink/70 border border-white/20 text-cream hover:text-accent hover:border-accent transition-colors"
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(next.slug)}
            aria-label={`Next shoe: ${next.code}`}
            className="absolute right-3 md:right-[352px] top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-ink/70 border border-white/20 text-cream hover:text-accent hover:border-accent transition-colors"
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </div>

        {/* Details docked to the right of the stage on desktop, below on mobile. */}
        <div
          key={product.slug}
          className="animate-fade-up mx-5 md:mx-0 mt-6 md:mt-0 md:absolute md:right-8 md:top-1/2 md:-translate-y-1/2 md:w-[320px] md:bg-ink/80 md:backdrop-blur md:border md:border-white/10 md:p-6 z-10"
        >
          <p className="text-base md:text-lg text-cream/90 leading-relaxed mb-6 max-w-md">{product.description}</p>

          <fieldset className="mb-6">
            <legend className="eyebrow text-cream mb-3">
              {size == null ? 'Choose a size' : `Size — EU ${size}`}
            </legend>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a size, EU 40 to 46">
              {SIZES.map((s) => {
                const selected = size === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    aria-pressed={selected}
                    aria-label={`Size EU ${s}${selected ? ', selected' : ''}`}
                    className={`min-h-[48px] min-w-[56px] px-3 font-semibold border transition-colors ${
                      selected
                        ? 'bg-cream text-ink border-cream'
                        : 'border-white/25 text-cream hover:border-accent hover:text-accent'
                    }`}
                  >
                    EU {s}
                  </button>
                );
              })}
            </div>
            {size == null && (
              <p className="text-sm text-cream-dim mt-3" role="status">
                Select a size to add this silhouette to your bag.
              </p>
            )}
          </fieldset>

          <button
            type="button"
            onClick={handleAdd}
            disabled={size == null}
            aria-label={size == null ? 'Add to bag — select a size first' : `Add ${product.code}, size EU ${size} to bag`}
            className={`w-full flex items-center justify-center gap-2 font-semibold px-6 py-4 min-h-[52px] transition-colors ${
              size == null
                ? 'bg-white/10 text-cream/40 cursor-not-allowed'
                : added
                  ? 'bg-accent text-ink'
                  : 'bg-cream text-ink hover:bg-accent hover:text-ink'
            }`}
          >
            {added ? (
              <>
                <Check size={18} aria-hidden="true" /> Added to your bag
              </>
            ) : (
              'Add to bag'
            )}
          </button>
          <p className="text-xs text-cream-dim mt-4 leading-relaxed">
            No buying online here — the bag is a shortlist. Request the bag and the shop follows up.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 md:px-8 py-6 md:py-8">
        <p className="eyebrow text-cream-dim text-center">
          {prev.code} <span className="text-accent mx-1">←</span> {product.code} <span className="text-accent mx-1">→</span> {next.code}
        </p>
      </div>
    </main>
  );
}
