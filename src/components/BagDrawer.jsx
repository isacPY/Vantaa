import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { useBag } from '../state/store';
import { getProduct } from '../data/products';
import { navigate } from './Header';

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function imgSrc(image) {
  if (/^https?:\/\//.test(image)) return image;
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}${image}`;
}

export default function BagDrawer() {
  const { items, isOpen, closeBag, setQty, remove, clear, justAdded } = useBag();
  const drawerRef = useRef(null);
  const closeRef = useRef(null);
  const [requested, setRequested] = useState(false);

  // Reset the request confirmation whenever the bag opens or changes.
  useEffect(() => {
    if (isOpen) setRequested(false);
  }, [isOpen, items.length]);

  // Slide in / out (transform only). Escape closes. Focus the close button
  // on open; focus is returned to the bag button on close via the header.
  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (prefersReducedMotion()) {
        gsap.set(drawer, { x: 0 });
      } else {
        gsap.fromTo(drawer, { x: '100%' }, { x: '0%', duration: 0.35, ease: 'power3.out' });
      }
      closeRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeBag();
      // Simple focus trap: keep Tab inside the drawer.
      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll(
          'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeBag]);

  if (!isOpen) return null;

  const count = items.reduce((n, i) => n + i.qty, 0);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Your bag">
      <button
        type="button"
        aria-label="Close bag"
        onClick={closeBag}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm cursor-default"
      />
      <aside
        ref={drawerRef}
        className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-cream text-ink flex flex-col shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 md:px-6 h-16 border-b border-ink/10">
          <h2 className="font-display font-black tracking-[0.18em] text-lg">
            YOUR BAG {count > 0 && <span className="text-accent">({count})</span>}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeBag}
            aria-label="Close bag"
            className="flex items-center justify-center min-h-[44px] min-w-[44px] hover:text-accent transition-colors"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
            <p className="font-display font-extrabold text-2xl tracking-wide">Your bag is empty</p>
            <p className="text-ink/60 leading-relaxed">Your bag is empty — explore the collection and pick a silhouette.</p>
            <button
              type="button"
              onClick={() => {
                closeBag();
                navigate('/');
                setTimeout(() => document.getElementById('collection')?.scrollIntoView(), 50);
              }}
              className="bg-ink text-cream font-semibold px-6 py-3 min-h-[44px] hover:bg-accent hover:text-ink transition-colors"
            >
              Explore the collection
            </button>
          </div>
        ) : (
          <>
            <ul className="bag-scroll flex-1 overflow-y-auto px-5 md:px-6 py-4 flex flex-col gap-4">
              {items.map((item) => {
                const product = getProduct(item.slug);
                if (!product) return null;
                const isNew = justAdded && justAdded.slug === item.slug && justAdded.size === item.size;
                return (
                  <li
                    key={`${item.slug}-${item.size}`}
                    className={`flex gap-4 border border-ink/10 p-3 ${isNew ? 'border-accent' : ''}`}
                  >
                    <span className="relative block w-20 h-24 shrink-0 overflow-hidden bg-ink">
                      <img
                        src={imgSrc(product.image)}
                        alt={`${product.code} thumbnail`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-start justify-between gap-2">
                        <span className="font-display font-extrabold tracking-wide leading-tight">{product.code}</span>
                        <button
                          type="button"
                          onClick={() => remove(item.slug, item.size)}
                          aria-label={`Remove ${product.code}, size EU ${item.size} from bag`}
                          className="flex items-center justify-center min-h-[36px] min-w-[36px] text-ink/50 hover:text-accent transition-colors"
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </span>
                      <span className="block text-sm text-ink/60 mt-0.5">EU {item.size}</span>
                      <span className="flex items-center gap-1 mt-2">
                        <button
                          type="button"
                          onClick={() => setQty(item.slug, item.size, item.qty - 1)}
                          aria-label={`Decrease quantity of ${product.code}, size EU ${item.size}`}
                          className="flex items-center justify-center min-h-[36px] min-w-[36px] border border-ink/20 hover:border-accent"
                        >
                          <Minus size={14} aria-hidden="true" />
                        </button>
                        <span className="min-w-[36px] text-center font-semibold" aria-label={`Quantity ${item.qty}`}>
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(item.slug, item.size, item.qty + 1)}
                          aria-label={`Increase quantity of ${product.code}, size EU ${item.size}`}
                          className="flex items-center justify-center min-h-[36px] min-w-[36px] border border-ink/20 hover:border-accent"
                        >
                          <Plus size={14} aria-hidden="true" />
                        </button>
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-ink/10 px-5 md:px-6 py-5 flex flex-col gap-3">
              {requested ? (
                <p className="bg-ink text-cream text-center font-semibold px-4 py-3 min-h-[44px]" role="status">
                  Request noted — the shop will be in touch.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setRequested(true)}
                  className="bg-ink text-cream font-semibold px-6 py-3 min-h-[44px] hover:bg-accent hover:text-ink transition-colors"
                >
                  Request this bag
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  closeBag();
                  navigate('/');
                }}
                className="text-sm text-ink/60 hover:text-accent underline underline-offset-4 self-center min-h-[44px] px-2"
              >
                Continue exploring
              </button>
              <button
                type="button"
                onClick={clear}
                className="text-xs text-ink/40 hover:text-accent self-center min-h-[32px] px-2"
              >
                Clear bag
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
