import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products } from '../data/products';
import { navigate } from './Header';

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function imgSrc(image) {
  if (/^https?:\/\//.test(image)) return image;
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}${image}`;
}

export function ShoeCard({ product, index, eager }) {
  return (
    <button
      type="button"
      onClick={() => navigate(`/product/${product.slug}`)}
      className="reveal group relative block w-full text-left focus-visible:outline-none"
      aria-label={`View ${product.code} — ${product.colour}. ${product.description}`}
    >
      <span className="relative block w-full aspect-[4/5] overflow-hidden spotlight">
        <img
          src={imgSrc(product.image)}
          alt={`${product.code} — ${product.colour} shoe`}
          loading={eager ? 'eager' : 'lazy'}
          className="shoe-img absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark gradient so the label stays readable over any photo. */}
        <span className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/75 to-transparent" aria-hidden="true" />
        <span className="shoe-glow absolute left-1/2 bottom-0 -translate-x-1/2 w-[75%] h-[32%]" aria-hidden="true" />
        <span className="absolute top-3 left-3 eyebrow text-cream/70">{String(index + 1).padStart(2, '0')}</span>
        <span className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <span className="font-display font-extrabold tracking-wide text-lg md:text-xl leading-none">{product.code}</span>
          <span className="eyebrow text-cream/70 hidden sm:block">View →</span>
        </span>
      </span>
      <span className="block mt-3 text-sm text-cream-dim leading-snug">{product.description}</span>
    </button>
  );
}

export default function ProductGrid() {
  const gridRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const root = gridRef.current;
    if (!root) return;
    if (prefersReducedMotion()) {
      gsap.set(root.querySelectorAll('.reveal'), { clearProps: 'all', opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });
      // Slow pan/zoom drift across the collection, like the video's
      // slow camera move over the grid — transform only, very subtle.
      const inner = innerRef.current;
      if (inner) {
        gsap.to(inner, { scale: 1.035, duration: 16, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="collection" ref={gridRef} className="max-w-[1440px] mx-auto px-5 md:px-8 py-10 md:py-16" aria-label="The collection">
      <div className="flex items-end justify-between gap-4 mb-8 md:mb-10">
        <div>
          <p className="eyebrow text-accent mb-2">The collection</p>
          <h2 className="font-display font-black uppercase tracking-tight leading-none text-4xl md:text-6xl">
            Series 01
          </h2>
        </div>
        <p className="eyebrow text-cream-dim text-right hidden sm:block">10 silhouettes</p>
      </div>

      <div ref={innerRef} className="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-5 md:gap-y-10 will-change-transform">
        {products.map((p, i) => (
          <ShoeCard key={p.slug} product={p} index={i} eager={i < 5} />
        ))}
      </div>

      <div className="mt-12 md:mt-16 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="eyebrow text-cream">Series 01 / 10 silhouettes</p>
        <p className="text-cream-dim">Explore the collection. Select a silhouette.</p>
      </div>
    </section>
  );
}
