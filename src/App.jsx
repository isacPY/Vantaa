import React, { useEffect, useMemo, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Header from './components/Header';
import Footer from './components/Footer';
import BagDrawer from './components/BagDrawer';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import AboutPage from './pages/AboutPage';
import FaqPage from './pages/FaqPage';
import ContactPage from './pages/ContactPage';

gsap.registerPlugin(ScrollTrigger);

// Hash routing (GitHub Pages: no server rewrites).
// Routes: #/  #/product/:slug  #/about  #/faq  #/contact
function parseHash() {
  const raw = (window.location.hash || '#/').replace(/^#/, '') || '/';
  const path = raw.startsWith('/') ? raw : `/${raw}`;
  if (path === '/') return { route: '/', slug: null };
  const productMatch = path.match(/^\/product\/([\w-]+)\/?$/);
  if (productMatch) return { route: '/product', slug: productMatch[1] };
  if (path === '/about') return { route: '/about', slug: null };
  if (path === '/faq') return { route: '/faq', slug: null };
  if (path === '/contact') return { route: '/contact', slug: null };
  return { route: '/not-found', slug: null };
}

function useLenis() {
  useEffect(() => {
    // Same rule as Firnature: skip Lenis for prefers-reduced-motion,
    // viewport < 768px, or coarse pointer < 1024px.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.innerWidth < 768;
    const coarse = window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 1024;
    if (reduced || small || coarse) return undefined;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
}

export default function App() {
  const [location, setLocation] = useState(parseHash);
  useLenis();

  useEffect(() => {
    const onHash = () => setLocation(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Scroll to top on every route change; refresh ScrollTrigger after render.
  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => clearTimeout(t);
  }, [location.route, location.slug]);

  const page = useMemo(() => {
    switch (location.route) {
      case '/':
        return <HomePage />;
      case '/product':
        return <ProductPage slug={location.slug} />;
      case '/about':
        return <AboutPage />;
      case '/faq':
        return <FaqPage />;
      case '/contact':
        return <ContactPage />;
      default:
        return (
          <main className="max-w-[1440px] mx-auto px-5 md:px-8 py-20 text-center">
            <p className="eyebrow text-accent mb-4">Not found</p>
            <h1 className="font-display font-black text-4xl uppercase mb-4">Page not found</h1>
            <p className="text-cream-dim mb-8">That page is not part of VANTA.</p>
            <a href="#/" className="inline-block bg-cream text-ink font-semibold px-6 py-3 min-h-[44px]">
              Back to the collection
            </a>
          </main>
        );
    }
  }, [location.route, location.slug]);

  const currentRoute =
    location.route === '/product' ? `/product/${location.slug}` : location.route === '/not-found' ? '/' : location.route;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-ink text-cream flex flex-col">
        <Header currentRoute={currentRoute} />
        <div className="flex-1">{page}</div>
        <Footer />
        <BagDrawer />
      </div>
    </ErrorBoundary>
  );
}
