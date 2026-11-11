import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'How does sizing run?',
    a: 'Series 01 runs in EU 40–46 and fits true to size for most people. If you are between sizes, we recommend sizing up — the shop can confirm fit for a specific silhouette before you visit.',
  },
  {
    q: 'Can I try shoes on before buying?',
    a: 'Yes — that is the point of the bag. Add the silhouettes you like, request the bag, and the shop will have your sizes ready to try when you visit.',
  },
  {
    q: 'Do you deliver?',
    a: 'Delivery depends on the shop. This template is built for a local footwear shop, so collection from the showroom is the default — delivery options are confirmed when the shop follows up on your bag request.',
  },
  {
    q: 'What is the returns policy?',
    a: 'Returns are handled by the shop directly, not through this site. Unworn pairs in their original condition can be returned or exchanged — ask in store or when the shop contacts you.',
  },
  {
    q: 'Is this a real shop?',
    a: 'This is a demo template — the photos, copy and contact details are placeholders to show how the shop would look online. Real photos, stock and contact details go in after the shop owner takes it over.',
  },
  {
    q: 'How do I contact the shop?',
    a: 'Use the Contacts page — send a message through the form or visit the showroom during opening hours (Tue–Sat, 10:00–18:00).',
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <main className="max-w-[900px] mx-auto px-5 md:px-8 py-12 md:py-20">
      <p className="eyebrow text-accent mb-4">FAQ</p>
      <h1 className="font-display font-black uppercase tracking-tight leading-[0.95] text-5xl md:text-7xl mb-4">
        Questions
      </h1>
      <p className="text-cream-dim text-lg leading-relaxed mb-10 max-w-xl">
        Sizing, trying on, delivery and returns — the short answers.
      </p>
      <div className="border-t border-white/10">
        {FAQS.map((item, i) => {
          const open = openIndex === i;
          return (
            <div key={item.q} className="border-b border-white/10">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? -1 : i)}
                aria-expanded={open}
                aria-controls={`faq-panel-${i}`}
                className="w-full flex items-center justify-between gap-4 py-5 min-h-[56px] text-left"
              >
                <span className="font-display font-bold text-xl md:text-2xl tracking-wide">{item.q}</span>
                <ChevronDown
                  size={20}
                  aria-hidden="true"
                  className={`shrink-0 text-accent transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                />
              </button>
              {open && (
                <p id={`faq-panel-${i}`} className="pb-6 pr-8 text-cream/85 leading-relaxed max-w-2xl">
                  {item.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
