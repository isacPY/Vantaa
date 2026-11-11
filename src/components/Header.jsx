import React, { useEffect, useRef, useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { brand } from '../config/brand';
import { useBag } from '../state/store';

export function navigate(route) {
  window.location.hash = `#${route}`;
}

export default function Header({ currentRoute }) {
  const { count, openBag } = useBag();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const isActive = (route) => {
    if (route === '/') return currentRoute === '/';
    return currentRoute === route || currentRoute.startsWith(`${route}/`);
  };

  return (
    <header className="sticky top-0 z-40 bg-ink/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1440px] mx-auto px-5 md:px-8 h-16 md:h-[72px] flex items-center justify-between gap-4">
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
            setMenuOpen(false);
          }}
          className="font-display font-black text-2xl md:text-[28px] tracking-[0.22em] text-cream leading-none"
          aria-label="VANTA — home"
        >
          {brand.name}
        </a>

        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {brand.nav.map((item) => (
            <a
              key={item.route}
              href={`#${item.route}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.route);
              }}
              aria-current={isActive(item.route) ? 'page' : undefined}
              className={`eyebrow transition-colors ${
                isActive(item.route) ? 'text-accent' : 'text-cream hover:text-accent'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openBag}
            aria-label={`Open your bag, ${count} item${count === 1 ? '' : 's'}`}
            className="relative flex items-center gap-2 min-h-[44px] min-w-[44px] px-3 border border-white/20 text-cream hover:border-accent hover:text-accent transition-colors"
          >
            <ShoppingBag size={18} aria-hidden="true" />
            <span className="eyebrow hidden sm:inline">Bag</span>
            {count > 0 && (
              <span
                className="absolute -top-2 -right-2 bg-accent text-ink text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full"
                aria-hidden="true"
              >
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="md:hidden flex items-center justify-center min-h-[44px] min-w-[44px] border border-white/20 text-cream"
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          ref={menuRef}
          className="md:hidden border-t border-white/10 bg-ink px-5 py-4 flex flex-col"
          aria-label="Mobile navigation"
        >
          {brand.nav.map((item, i) => (
            <a
              key={item.route}
              href={`#${item.route}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.route);
                setMenuOpen(false);
              }}
              aria-current={isActive(item.route) ? 'page' : undefined}
              className={`flex items-baseline gap-3 py-3 min-h-[44px] border-b border-white/5 last:border-0 ${
                isActive(item.route) ? 'text-accent' : 'text-cream'
              }`}
            >
              <span className="text-xs text-cream-dim font-mono">0{i + 1}</span>
              <span className="font-display font-bold text-xl tracking-wide">{item.label}</span>
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
