import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import DetailOverlay from '../components/DetailOverlay';
import { navigate } from '../components/Header';
import { getNeighbours, getProduct, products } from '../data/products';

// Collection page (redesign 2026-11-15, VANTA): the wall + the detail
// overlay in ONE tree, so clicking a shoe can CAMERA-ZOOM the wall
// instead of navigating to a separate inspect page. The wall scales
// 1 → ~3.2 with transform-origin at the clicked shoe, translated so
// the shoe ends centered horizontally in the lower-middle of the
// viewport (1.1s, cubic-bezier(0.65,0,0.25,1)). Back / Esc / browser
// back reverses (zoom out). Direct visits to #/product/:slug show the
// detail immediately (snap, no zoom). Prev/next pans the zoomed wall
// (same origin/scale, new translate). Uses transform + opacity +
// filter only — no layout jumps. GSAP is VANTA's animation library;
// the wall zoom itself is a CSS transform transition (exact easing).

export default function CollectionPage({ slug }) {
  const activeSlug = slug || null;
  const [wallTransform, setWallTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [wallOrigin, setWallOrigin] = useState('50% 50%');
  const [snap, setSnap] = useState(false);
  const [directVisit, setDirectVisit] = useState(() => slug != null);

  const wallRef = useRef(null);
  const shoeEls = useRef(new Map());
  const measuredRef = useRef(null);
  const originPointRef = useRef(null);
  const scaleRef = useRef(1);
  const wallRectRef = useRef(null);
  // Mirrors wallTransform, updated synchronously (not via an effect) so
  // onSelect can tell zoomed vs unzoomed even before the re-render.
  const transformRef = useRef({ scale: 1, x: 0, y: 0 });
  const firstSlugEffect = useRef(true);
  // Slug already zoomed/panned by a click — the [slug] effect skips it
  // so the transform isn't applied twice.
  const handledSlugRef = useRef(null);

  useEffect(() => {
    transformRef.current = wallTransform;
  }, [wallTransform]);

  const registerShoeRef = useCallback((slugKey, el) => {
    if (el) shoeEls.current.set(slugKey, el);
    else shoeEls.current.delete(slugKey);
  }, []);

  // Measure the wall rect + every shoe's wall-local centre. Only valid
  // while the wall is untransformed — called at click time and on mount
  // (before the snap zoom), never while zoomed.
  const measureAll = useCallback(() => {
    const wall = wallRef.current;
    if (!wall) return null;
    const rect = wall.getBoundingClientRect();
    const shoes = new Map();
    shoeEls.current.forEach((el, key) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      shoes.set(key, {
        x: r.left + r.width / 2 - rect.left,
        y: r.top + r.height / 2 - rect.top,
        width: r.width,
      });
    });
    return { wallRect: rect, shoes };
  }, []);

  const targetPoint = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Mobile: shoe sits higher (0.46) so it clears the bottom-sheet panel.
    return { x: vw / 2, y: vh * (vw < 768 ? 0.46 : 0.62) };
  }, []);

  // Zoom the wall to a shoe. Origin = the shoe's centre; translate =
  // target − the shoe's screen centre (untransformed), so the shoe
  // lands on the target and stays there while the wall scales around it.
  const zoomFor = useCallback((slugKey, opts = {}) => {
    const m = measureAll();
    if (!m) return;
    const shoe = m.shoes.get(slugKey);
    if (!shoe) return;
    const vw = window.innerWidth;
    const target = targetPoint();
    const scale = Math.min(3.2, (vw * 0.85) / shoe.width);
    const origin = `${(shoe.x / m.wallRect.width) * 100}% ${(shoe.y / m.wallRect.height) * 100}%`;
    const tx = target.x - (m.wallRect.left + shoe.x);
    const ty = target.y - (m.wallRect.top + shoe.y);
    measuredRef.current = m;
    originPointRef.current = { x: shoe.x, y: shoe.y };
    scaleRef.current = scale;
    wallRectRef.current = m.wallRect;
    setWallOrigin(origin);
    const next = { scale, x: tx, y: ty };
    transformRef.current = next;
    setWallTransform(next);
    setSnap(!!opts.snap);
    if (opts.snap) setTimeout(() => setSnap(false), 50);
  }, [measureAll, targetPoint]);

  // Pan the zoomed wall to another shoe: origin and scale stay fixed
  // at the first-clicked shoe; only the translate changes.
  // translate = (T − W0) − s·P + (s−1)·O.
  const panFor = useCallback((slugKey) => {
    const m = measuredRef.current;
    const O = originPointRef.current;
    const s = scaleRef.current;
    const wallRect = wallRectRef.current;
    if (!m || !O || !s || !wallRect) return;
    const shoe = m.shoes.get(slugKey);
    if (!shoe) return;
    const target = targetPoint();
    const tx = (target.x - wallRect.left) - s * shoe.x + (s - 1) * O.x;
    const ty = (target.y - wallRect.top) - s * shoe.y + (s - 1) * O.y;
    const next = { scale: s, x: tx, y: ty };
    transformRef.current = next;
    setWallTransform(next);
  }, [targetPoint]);

  // Direct visit: snap to the zoomed state before paint (no animation).
  useLayoutEffect(() => {
    if (slug && getProduct(slug)) {
      zoomFor(slug, { snap: true });
    }
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Route changes (hash): zoom to a product, pan while zoomed, or zoom
  // out back to the grid. The first run is skipped (mount handled above).
  // A slug already handled by a click (onSelect zooms synchronously)
  // is skipped so the transform isn't applied twice.
  useEffect(() => {
    if (firstSlugEffect.current) {
      firstSlugEffect.current = false;
      return;
    }
    if (slug === handledSlugRef.current) {
      handledSlugRef.current = null;
      return;
    }
    if (slug == null) {
      const next = { scale: 1, x: 0, y: 0 };
      transformRef.current = next;
      setWallTransform(next);
      setDirectVisit(false);
      return;
    }
    if (!getProduct(slug)) return;
    setDirectVisit(false);
    if (transformRef.current.scale === 1) zoomFor(slug);
    else panFor(slug);
  }, [slug, zoomFor, panFor]);

  const onSelect = useCallback((slugKey) => {
    if (slugKey === activeSlug) return; // clicking the active shoe is a no-op
    setDirectVisit(false);
    // Zoom/pan synchronously on click: the hashchange → effect chain
    // takes ~1s to apply the transform, which feels laggy. The [slug]
    // effect skips this slug (handledSlugRef) so it isn't double-applied.
    handledSlugRef.current = slugKey;
    if (transformRef.current.scale === 1) zoomFor(slugKey);
    else panFor(slugKey);
    navigate(`/product/${slugKey}`);
  }, [activeSlug, zoomFor, panFor]);

  const onClose = useCallback(() => {
    navigate('/');
  }, []);

  const onPrev = useCallback(() => {
    if (!activeSlug) return;
    const { prev } = getNeighbours(activeSlug);
    if (prev) onSelect(prev.slug);
  }, [activeSlug, onSelect]);

  const onNext = useCallback(() => {
    if (!activeSlug) return;
    const { next } = getNeighbours(activeSlug);
    if (next) onSelect(next.slug);
  }, [activeSlug, onSelect]);

  // Esc closes, arrow keys step through the collection.
  useEffect(() => {
    if (!activeSlug) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onNext();
      else if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeSlug, onClose, onNext, onPrev]);

  // Lock body scroll while a product is open.
  useEffect(() => {
    if (activeSlug) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeSlug]);

  const product = activeSlug ? getProduct(activeSlug) : null;

  if (activeSlug && !product) {
    return (
      <main className="mx-auto max-w-[1440px] px-5 py-20 text-center md:px-8">
        <p className="eyebrow mb-4 text-accent">Not found</p>
        <h1 className="font-display mb-4 text-4xl font-black uppercase">No such silhouette</h1>
        <p className="mb-8 text-cream-dim">That shoe is not part of Series 01.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="min-h-[44px] bg-cream px-6 py-3 font-semibold text-ink"
        >
          Back to the collection
        </button>
      </main>
    );
  }

  const activeIndex = product ? products.findIndex((p) => p.slug === product.slug) : -1;

  return (
    <main className="flex-1">
      <ProductGrid
        activeSlug={activeSlug}
        isZoomed={wallTransform.scale > 1}
        isDetailOpen={activeSlug != null}
        onSelect={onSelect}
        registerShoeRef={registerShoeRef}
        wallRef={wallRef}
        wallTransform={wallTransform}
        wallOrigin={wallOrigin}
        snap={snap}
      />
      {product && (
        <DetailOverlay
          product={product}
          index={activeIndex}
          direct={directVisit}
          onClose={onClose}
          onPrev={onPrev}
          onNext={onNext}
        />
      )}
    </main>
  );
}
