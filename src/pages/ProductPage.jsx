import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowLeft, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { SIZES } from '../config/brand';
import { getNeighbours, getProduct } from '../data/products';
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
  const { add } = useBag();
  const [size, setSize] = useState(product?.defaultSize ?? null);
  const [added, setAdded] = useState(false);
  const stageRef = useRef(null);
  const pageRef = useRef(null);
  const prevIndexRef = useRef(index);

  // Reset size when the shoe changes (VERGE 10 keeps its EU 45 default).
  useEffect(() => {
    setSize(product?.defaultSize ?? null);
    setAdded(false);
  }, [slug, product]);

  // Slide in horizontally from the side entered from (transform only).
  useEffect(() => {
    const stage = stageRef.current;
    const page = pageRef.current;
    if (!stage || !page || !product) return;
    const direction = index >= prevIndexRef.current ? 1 : -1;
    prevIndexRef.current = index;
    if (prefersReducedMotion()) {
      gsap.set([stage, page.querySelector('.product-panel')], { clearProps: 'all', opacity: 1, x: 0, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(stage, { x: 80 * direction, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' });
      gsap.fromTo('.product-panel', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.15 });
    }, page);
    return () => ctx.revert();
  }, [slug, product, index]);

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
        {/* Stage: shoe slides in on an orange-glowing platform; prev/next peek at the edges. */}
        <div className="lg:col-span-7 relative">
          <div ref={stageRef} className="relative">
            <div className="platform-glow absolute left-1/2 bottom-[-6%] -translate-x-1/2 w-[75%] h-[40%] rounded-full" aria-hidden="true" />
            <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] overflow-hidden spotlight">
              <img
                key={product.slug}
                src={imgSrc(product.image)}
                alt={`${product.code} — ${product.colour} shoe`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/70 to-transparent" aria-hidden="true" />
              <p className="absolute top-4 left-4 eyebrow text-cream/70">
                {String(index + 1).padStart(2, '0')} / 10 — Series 01
              </p>
            </div>
          </div>

          {/* Prev / next peeking shoes — clickable navigation. */}
          <div className="flex items-stretch justify-between gap-3 mt-4">
            <button
              type="button"
              onClick={() => navigate(`/product/${prev.slug}`)}
              aria-label={`Previous shoe: ${prev.code}`}
              className="group flex items-center gap-3 min-h-[64px] text-left flex-1 max-w-[48%] border border-white/10 hover:border-accent/60 transition-colors p-2"
            >
              <ChevronLeft size={20} className="shrink-0 text-cream-dim group-hover:text-accent" aria-hidden="true" />
              <span className="relative block w-14 h-14 shrink-0 overflow-hidden bg-ink-2">
                <img src={imgSrc(prev.image)} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
              </span>
              <span className="min-w-0">
                <span className="block eyebrow text-cream-dim">Prev</span>
                <span className="block font-display font-bold tracking-wide truncate">{prev.code}</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigate(`/product/${next.slug}`)}
              aria-label={`Next shoe: ${next.code}`}
              className="group flex items-center justify-end gap-3 min-h-[64px] text-right flex-1 max-w-[48%] border border-white/10 hover:border-accent/60 transition-colors p-2"
            >
              <span className="min-w-0">
                <span className="block eyebrow text-cream-dim">Next</span>
                <span className="block font-display font-bold tracking-wide truncate">{next.code}</span>
              </span>
              <span className="relative block w-14 h-14 shrink-0 overflow-hidden bg-ink-2">
                <img src={imgSrc(next.image)} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
              </span>
              <ChevronRight size={20} className="shrink-0 text-cream-dim group-hover:text-accent" aria-hidden="true" />
            </button>
          </div>
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
