import React from 'react';
import { brand } from '../config/brand';
import { navigate } from './Header';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-4">
      <div className="max-w-[1440px] mx-auto px-5 md:px-8 py-10 md:py-14">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div>
            <p className="font-display font-black text-3xl tracking-[0.22em] mb-3">{brand.name}</p>
            <p className="text-cream-dim max-w-xs leading-relaxed">{brand.tagline}</p>
          </div>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-col gap-3">
              {brand.nav.map((item) => (
                <li key={item.route}>
                  <a
                    href={`#${item.route}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.route);
                    }}
                    className="eyebrow text-cream hover:text-accent transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="text-sm text-cream-dim leading-relaxed">
            <p>{brand.series} — {brand.seriesNote.toLowerCase()}</p>
            <p>{brand.email}</p>
            <p>{brand.hours}</p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-2">
          <p className="text-xs text-cream-dim">{brand.footerNote}</p>
          <p className="text-xs text-cream-dim">© {new Date().getFullYear()} {brand.name}. Demo template.</p>
        </div>
      </div>
    </footer>
  );
}
