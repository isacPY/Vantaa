import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDown } from 'lucide-react';
import { brand } from '../config/brand';
import { heroProduct } from '../data/products';
import { navigate } from './Header';

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function Hero() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) {
      gsap.set(root.querySelectorAll('.word-inner, .hero-shoe, .hero-glow, .hero-meta'), { clearProps: 'all', opacity: 1, x: 0, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from('.word-inner', { yPercent: 110, duration: 0.9, ease: 'power3.out', stagger: 0.06, delay: 0.1 });
      gsap.from('.hero-shoe', { x: -60, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.15 });
      gsap.from('.hero-glow', { scale: 0.6, opacity: 0, duration: 1.1, ease: 'power2.out', delay: 0.3 });
      gsap.from('.hero-meta', { y: 16, opacity: 0, duration: 0.7, ease: 'power2.out', stagger: 0.08, delay: 0.45 });
    }, root);
    return () => ctx.revert();
  }, []);

  const words = brand.tagline.replace('.', '').split(' ');

  return (
    <section ref={rootRef} className="relative overflow-hidden" aria-label="Featured shoe">
      <div className="max-w-[1440px] mx-auto px-5 md:px-8 pt-10 md:pt-16 pb-8 md:pb-12">
        <div className="flex items-center justify-between gap-4 mb-6 md:mb-8">
          <p className="hero-meta eyebrow text-cream-dim">Footwear / {brand.series}</p>
          <p className="hero-meta eyebrow text-cream-dim hidden sm:block">{brand.seriesNote}</p>
        </div>

        <h1 className="font-display font-black uppercase leading-[0.95] tracking-tight text-[13.5vw] sm:text-[11vw] lg:text-[9rem] mb-8 md:mb-10">
          {words.map((w, i) => (
            <span key={i} className="word-mask mr-[0.22em]">
              <span className="word-inner">{w}</span>
            </span>
          ))}
          <span className="word-mask">
            <span className="word-inner text-accent">.</span>
          </span>
        </h1>

        <div className="grid md:grid-cols-12 gap-8 md:gap-6 items-end">
          {/* Spotlight shoe — VERGE 10, best hero shot (mint on pure black). */}
          <div className="md:col-span-7 relative">
            <div className="hero-glow platform-glow absolute left-1/2 bottom-[-8%] -translate-x-1/2 w-[80%] h-[45%] rounded-full" aria-hidden="true" />
            <button
              type="button"
              onClick={() => navigate(`/product/${heroProduct.slug}`)}
              className="hero-shoe group relative block w-full text-left focus-visible:outline-none"
              aria-label={`View ${heroProduct.code} — ${heroProduct.description}`}
            >
              <span className="relative block w-full aspect-[4/5] sm:aspect-[16/10] md:aspect-[4/3] overflow-hidden spotlight">
                <img
                  src={/^https?:\/\//.test(heroProduct.image) ? heroProduct.image : `${import.meta.env.BASE_URL.replace(/\/$/, '')}${heroProduct.image}`}
                  alt={`${heroProduct.code} — ${heroProduct.colour} retro trainer`}
                  className="shoe-img absolute inset-0 w-full h-full object-cover"
                />
                <span className="shoe-glow absolute left-1/2 bottom-0 -translate-x-1/2 w-[70%] h-[35%]" aria-hidden="true" />
                <span className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/70 to-transparent" aria-hidden="true" />
                <span className="absolute bottom-4 left-4 md:bottom-5 md:left-5">
                  <span className="block eyebrow text-accent mb-1">Spotlight</span>
                  <span className="block font-display font-extrabold text-2xl md:text-3xl tracking-wide">{heroProduct.code}</span>
                </span>
                <span className="absolute bottom-4 right-4 md:bottom-5 md:right-5 eyebrow text-cream/80">View silhouette →</span>
              </span>
            </button>
          </div>

          <div className="md:col-span-5 flex flex-col gap-6 md:pb-2">
            <p className="hero-meta text-lg md:text-xl leading-relaxed text-cream/90 max-w-md">
              {heroProduct.description} Ten silhouettes, one series — each shoe lit like it is
              the only one in the room.
            </p>
            <div className="hero-meta flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate(`/product/${heroProduct.slug}`)}
                className="bg-cream text-ink font-semibold px-6 py-3 min-h-[44px] hover:bg-accent hover:text-ink transition-colors"
              >
                View {heroProduct.code}
              </button>
              <a
                href="#collection"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('collection')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
                }}
                className="inline-flex items-center gap-2 border border-white/25 text-cream font-semibold px-6 py-3 min-h-[44px] hover:border-accent hover:text-accent transition-colors"
              >
                Explore the collection <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
            <p className="hero-meta eyebrow text-cream-dim">
              {brand.series} — {brand.seriesNote.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
