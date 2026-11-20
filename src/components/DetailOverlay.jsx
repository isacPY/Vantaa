import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronLeft } from 'lucide-react';
import { SIZES } from '../config/brand';
import { getNeighbours } from '../data/products';
import { useBag } from '../state/store';

// Detail UI overlay (redesign 2026-11-15, VANTA). The shoe itself is
// the zoomed wall's shoe — this component only renders the UI over it,
// transparent, fading/sliding in after the 1.1s camera zoom (0.5s), or
// immediately on a direct visit. Title ~48px (36px mobile), bold,
// white, tight tracking, top-left, with a small breadcrumb above and a
// 2-line muted description under it (max-width 280px). Right panel:
// Size / Colorway rows + cream Add to bag pill — NO price row (VANTA
// has no prices anywhere; the bag is a shortlist, "Request this bag").
// On mobile the panel is a compact bottom sheet. Pointer events only
// on interactive children so the wall's shoes stay clickable
// (neighbours at the edges).
function OptionsPanel({ product }) {
  const { add } = useBag();
  const [size, setSize] = useState(product?.defaultSize ?? null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setSize(product?.defaultSize ?? null);
    setAdded(false);
  }, [product]);

  const handleAdd = () => {
    if (size == null) return;
    add(product.slug, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="animate-fade-up">
      {/* Size row. */}
      <div className="border-b border-white/10 pb-4">
        <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-cream-dim uppercase">
          {size == null ? 'Choose a size' : `Size — EU ${size}`}
        </p>
        <div className="grid grid-cols-7 gap-1.5" role="group" aria-label="Choose a size, EU 40 to 46">
          {SIZES.map((s) => {
            const selected = size === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={selected}
                aria-label={`Size EU ${s}${selected ? ', selected' : ''}`}
                className={`flex min-h-[36px] items-center justify-center text-xs font-semibold transition-colors ${
                  selected
                    ? 'bg-accent text-ink'
                    : 'bg-white/5 text-cream hover:bg-white/10 hover:text-accent'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
        {size == null && (
          <p className="mt-3 text-xs text-cream-dim" role="status">
            Select a size to add this silhouette to your bag.
          </p>
        )}
      </div>

      {/* Colorway row. */}
      <div className="flex items-center justify-between border-b border-white/10 py-4">
        <span className="text-[10px] font-semibold tracking-[0.2em] text-cream-dim uppercase">Colorway</span>
        <span className="flex items-center gap-2 text-xs font-medium text-cream">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full border border-white/30"
            style={{ background: 'var(--color-accent)' }}
            aria-hidden="true"
          />
          {product.colour}
        </span>
      </div>

      {/* Add to bag — cream pill, orange on hover. */}
      <button
        type="button"
        onClick={handleAdd}
        disabled={size == null}
        aria-label={size == null ? 'Add to bag — select a size first' : `Add ${product.code}, size EU ${size} to bag`}
        className={`mt-5 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors ${
          size == null
            ? 'cursor-not-allowed bg-white/10 text-cream/40'
            : added
              ? 'bg-accent text-ink'
              : 'bg-cream text-ink hover:bg-accent hover:text-ink'
        }`}
      >
        {added ? (
          <>
            <Check size={16} aria-hidden="true" /> Added to your bag
          </>
        ) : (
          'Add to bag'
        )}
      </button>
      <p className="mt-4 text-xs leading-relaxed text-cream-dim">
        No buying online here — the bag is a shortlist. Request the bag and the shop follows up.
      </p>
    </div>
  );
}

export default function DetailOverlay({ product, index, direct, onClose, onPrev, onNext }) {
  const { prev, next } = getNeighbours(product.slug);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30"
      style={{
        opacity: 0,
        animation: `fadeUp 0.5s ease ${direct ? 0 : 1.1}s both`,
      }}
      role="dialog"
      aria-label={`${product.code} — ${product.colour}`}
    >
      <div className="relative mx-auto h-full w-full max-w-[1440px] px-6 md:px-8">
        {/* Left: back, breadcrumb, title, 2-line description. */}
        <div
          key={product.slug}
          className="absolute top-24 left-6 max-w-[320px] md:left-8"
          style={{ animation: 'fadeUp 0.4s ease both' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="pointer-events-auto flex items-center gap-1.5 text-xs font-semibold text-cream-dim transition-colors hover:text-cream"
            aria-label="Back to the collection"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <p className="mt-5 text-[10px] font-semibold tracking-[0.24em] text-cream-dim uppercase">
            Series 01&nbsp;&nbsp;/&nbsp;&nbsp;Item {String(index + 1).padStart(2, '0')}
          </p>
          <h1 className="mt-3 font-display text-[36px] leading-[1.02] font-bold tracking-tight text-cream md:text-[48px]">
            {product.code}
          </h1>
          <p className="mt-4 max-w-[280px] text-sm leading-relaxed text-cream-dim">
            {product.description}
          </p>
        </div>

        {/* Right: options panel (desktop). */}
        <div className="pointer-events-auto absolute top-24 right-8 hidden w-[300px] md:block">
          <OptionsPanel key={product.slug} product={product} />
        </div>

        {/* Mobile options panel (compact bottom sheet). */}
        <div className="pointer-events-auto absolute inset-x-6 bottom-16 md:hidden">
          <OptionsPanel key={product.slug} product={product} />
        </div>

        {/* Bottom row: counter, hint, prev/next arrows. */}
        <div className="pointer-events-none absolute inset-x-6 bottom-5 flex items-end justify-between text-[11px] tracking-[0.14em] text-cream-dim uppercase md:inset-x-8">
          <span>
            {String(index + 1).padStart(2, '0')} / {String(10).padStart(2, '0')}
          </span>
          <span className="hidden md:block">← → to browse · Esc to go back</span>
          <div className="pointer-events-auto flex gap-2">
            <button
              type="button"
              onClick={onPrev}
              aria-label={`Previous: ${prev.code}`}
              className="rounded-full border border-white/20 bg-white/5 p-3 text-cream transition-colors hover:border-cream/40"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label={`Next: ${next.code}`}
              className="rounded-full border border-white/20 bg-white/5 p-3 text-cream transition-colors hover:border-cream/40"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
