import React from 'react';
import { brand } from '../config/brand';
import { navigate } from '../components/Header';

export default function AboutPage() {
  return (
    <main className="max-w-[1440px] mx-auto px-5 md:px-8 py-12 md:py-20">
      <p className="eyebrow text-accent mb-4">About</p>
      <h1 className="font-display font-black uppercase tracking-tight leading-[0.95] text-5xl md:text-7xl max-w-3xl mb-8">
        Form, fit from within.
      </h1>
      <div className="grid md:grid-cols-12 gap-8 md:gap-10">
        <div className="md:col-span-7 flex flex-col gap-6 text-lg leading-relaxed text-cream/90 max-w-2xl">
          <p>
            VANTA started with a simple frustration: shoes are judged from the outside, but
            they are lived in from the inside. A silhouette can look right and still feel
            wrong — so every pair in Series 01 is built around the foot first, and the
            shape follows.
          </p>
          <p>
            Ten silhouettes, one series. No seasonal noise, no endless drops — a tight
            collection where each shoe earns its place under the spotlight. If it does not
            fit the way it should, it does not make the series.
          </p>
          <p>
            This site is the shop window for that idea: the shoes, lit like they are the
            only ones in the room, and a bag that works like a shortlist — pick the pairs
            you want to try, request the bag, and the shop takes it from there.
          </p>
        </div>
        <aside className="md:col-span-5">
          <div className="border border-white/10 p-6 md:p-8 flex flex-col gap-6 spotlight">
            <div>
              <p className="eyebrow text-cream-dim mb-2">The series</p>
              <p className="font-display font-extrabold text-2xl tracking-wide">SERIES 01 — 10 SILHOUETTES</p>
            </div>
            <div>
              <p className="eyebrow text-cream-dim mb-2">The rule</p>
              <p className="leading-relaxed text-cream/90">One strong silhouette per shoe. Nothing decorative, nothing filler.</p>
            </div>
            <div>
              <p className="eyebrow text-cream-dim mb-2">The fit</p>
              <p className="leading-relaxed text-cream/90">Sizes EU 40–46. If you are between sizes, the shop advises sizing up.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="bg-cream text-ink font-semibold px-6 py-3 min-h-[44px] hover:bg-accent hover:text-ink transition-colors self-start"
            >
              Visit or contact the shop
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
