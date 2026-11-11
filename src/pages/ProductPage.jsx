import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
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

export default function ProductPage({ slug }) {
  const product = getProduct(slug);
  const { prev, next, index } = getNeighbours(slug || '');
  // Track order: last shoe cloned before the first, first shoe cloned
  // after the last — so a neighbour always peeks in, even at the ends
  // of the collection (visual position of the current shoe is index + 1).
  const slides = [products[products.length - 1], ...products, products[0]];
  const { add } = useBag();
  const [size, setSize] = useState(product?.defaultSize ?? null);
  const [added, setAdded] = useState(false);
  const pageRef = useRef(null);
  const trackRef = useRef(null);
  const wrapRef = useRef(null);
  const prevIndexRef = useRef(index);
  const mountedRef = useRef(false);

  // Reset size when the shoe changes (VERGE 10 keeps its EU 45 default).
  useEffect(() => {
    setSize(product?.defaultSize ?? null);
    setAdded(false);
  }, [slug, product]);

  // Carousel: the track holds all 10 shoes, each 80% of the stage wide,
  // so the neighbours peek in at the edges — like the video.
  const trackX = () => {
    const wrap = wrapRef.current;
    if (!wrap) return 0;
    const w = wrap.offsetWidth;
    return w * 0.1 - (index + 1) * w * 0.8;
  };

  // Slide the track horizontally whenever the shoe changes (layout effect
  // so the first paint already shows the right position, no flash).
  useLayoutEffect(() => {
    const track = trackRef.current;
    const page = pageRef.current;
    if (!track || !page || !product) return;
    const prevReal = prevIndexRef.current;
    const direction = index >= prevReal ? 1 : -1;
    prevIndexRef.current = index;
    // Wrapping around the ends (VERGE 10 → MONOLITH 01 or back) must
    // snap, not sweep the track across all ten shoes.
    const wrapped =
      (prevReal === products.length - 1 && index === 0) ||
      (prevReal === 0 && index === products.length - 1);
    const target = trackX();
    if (prefersReducedMotion()) {
      gsap.set(track, { x: target, opacity: 1 });
      gsap.set(page.querySelector('.product-panel'), { clearProps: 'all', opacity: 1, y: 0 });
      mountedRef.current = true;
      return;
    }
    const ctx = gsap.context(() => {
      if (wrapped) {
        gsap.set(track, { x: target, opacity: 1 });
        mountedRef.current = true;
      } else if (!mountedRef.current) {
        // First view: the shoe slides in horizontally from the side.
        gsap.fromTo(track, { x: target + 160 * direction, opacity: 0 }, { x: target, opacity: 1, duration: 0.8, ease: 'power3.out' });
        mountedRef.current = true;
      } else {
        gsap.to(track, { x: target, duration: 0.7, ease: 'power3.inOut' });
      }
      gsap.fromTo('.product-panel', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.1 });
    }, page);
    return () => ctx.revert();
  }, [slug, product, index]);

  // Keep the track centred when the viewport width changes.
  useEffect(() => {
    const onResize = () => {
      if (trackRef.current) gsap.set(trackRef.current, { x: trackX() });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [index]);

  // Arrow keys move through the collection.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') navigate(`/product/${next.slug}`);
      if (e.key === 'ArrowLeft') navigate(`/product/${prev.slug}`);
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

  return (
    <main className="max-w-[1440px] mx-auto px-5 md:px-8 py-8 md:py-12">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 eyebrow text-cream-dim hover:text-accent transition-colors min-h-[44px] mb-6 md:mb-8"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to collection
      </button>

      <div ref={pageRef} className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Stage: horizontal carousel — current shoe centred on a glowing
            orange platform, neighbours peeking in at the edges. */}
        <div className="lg:col-span-7 relative">
          <div ref={wrapRef} className="relative w-full aspect-[4/5] sm:aspect-[4/3] overflow-hidden bg-ink-2">
            <div ref={trackRef} className="flex h-full will-change-transform">
              {slides.map((p, i) => {
                const active = i === index + 1;
                const clone = i === 0 || i === slides.length - 1;
                return (
                  <button
                    key={`${p.slug}-${i}`}
                    type="button"
                    onClick={() => { if (!active) navigate(`/product/${p.slug}`); }}
                    aria-label={active ? `${p.code} — current silhouette` : `View ${p.code}`}
                    aria-current={active || undefined}
                    aria-hidden={clone || undefined}
                    tabIndex={clone ? -1 : 0}
                    className="relative h-full w-[80%] shrink-0 overflow-hidden spotlight text-left focus-visible:outline-none"
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
                    {active && (
                      <>
                        {/* The glowing orange platform the shoe stands on. */}
                        <span
                          className="absolute left-1/2 bottom-[2%] -translate-x-1/2 w-[85%] h-[34%] rounded-full pointer-events-none"
                          style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,106,26,0.85) 0%, rgba(255,106,26,0.35) 55%, transparent 100%)' }}
                          aria-hidden="true"
                        />
                        <span className="absolute left-1/2 bottom-[6%] -translate-x-1/2 w-[62%] h-[3px] bg-accent/90 blur-[1px] pointer-events-none" aria-hidden="true" />
                      </>
                    )}
                    <span className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/70 to-transparent pointer-events-none" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
            <p className="absolute top-4 left-4 z-10 eyebrow text-cream/70 pointer-events-none">
              {String(index + 1).padStart(2, '0')} / 10 — Series 01
            </p>
            <button
              type="button"
              onClick={() => navigate(`/product/${prev.slug}`)}
              aria-label={`Previous shoe: ${prev.code}`}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-ink/70 border border-white/20 text-cream hover:text-accent hover:border-accent transition-colors"
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => navigate(`/product/${next.slug}`)}
              aria-label={`Next shoe: ${next.code}`}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-ink/70 border border-white/20 text-cream hover:text-accent hover:border-accent transition-colors"
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </div>
          <p className="eyebrow text-cream-dim mt-4 text-center">
            {prev.code} <span className="text-accent mx-1">←</span> {product.code} <span className="text-accent mx-1">→</span> {next.code}
          </p>
        </div>

        {/* Right-hand panel. */}
        <div className="product-panel lg:col-span-5 lg:sticky lg:top-24">
          <p className="eyebrow text-accent mb-3">Series 01 — {product.colour}</p>
          <h1 className="font-display font-black uppercase tracking-tight leading-[0.95] text-5xl md:text-6xl mb-4">
            {product.code}
          </h1>
          <p className="text-lg text-cream/90 leading-relaxed mb-8 max-w-md">{product.description}</p>

          <fieldset className="mb-8">
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
    </main>
  );
}
