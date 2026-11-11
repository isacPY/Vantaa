import React, { useState } from 'react';
import { Check, Clock, Mail, MapPin } from 'lucide-react';
import { brand } from '../config/brand';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Front-end only: no backend, never sends — shows a confirmation state.
    setSent(true);
  };

  return (
    <main className="max-w-[1440px] mx-auto px-5 md:px-8 py-12 md:py-20">
      <p className="eyebrow text-accent mb-4">Contacts</p>
      <h1 className="font-display font-black uppercase tracking-tight leading-[0.95] text-5xl md:text-7xl mb-10">
        Talk to the shop
      </h1>

      <div className="grid md:grid-cols-12 gap-10 md:gap-12">
        <div className="md:col-span-5 flex flex-col gap-6">
          <p className="text-lg leading-relaxed text-cream/90 max-w-md">
            Questions about fit, stock, or a silhouette in Series 01 — ask here, or come
            and try them on in the showroom.
          </p>
          <ul className="flex flex-col gap-5">
            <li className="flex items-start gap-3">
              <MapPin size={20} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <span className="block eyebrow text-cream-dim mb-1">Showroom</span>
                <span className="leading-relaxed">{brand.showroom}</span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={20} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <span className="block eyebrow text-cream-dim mb-1">Email</span>
                <a href={`mailto:${brand.email}`} className="leading-relaxed hover:text-accent transition-colors">
                  {brand.email}
                </a>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Clock size={20} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <span className="block eyebrow text-cream-dim mb-1">Hours</span>
                <span className="leading-relaxed">{brand.hours}</span>
              </span>
            </li>
          </ul>
          <p className="text-sm text-cream-dim leading-relaxed">
            Demo contact details — the real showroom address and email go in after the
            shop owner takes over this template.
          </p>
        </div>

        <div className="md:col-span-7">
          {sent ? (
            <div className="border border-white/10 spotlight p-8 md:p-10 text-center" role="status">
              <Check size={32} className="text-accent mx-auto mb-4" aria-hidden="true" />
              <h2 className="font-display font-extrabold text-2xl tracking-wide mb-3">Message received</h2>
              <p className="text-cream/85 leading-relaxed max-w-md mx-auto">
                Thanks, {form.name ? `${form.name} — ` : ''}your message is noted. The shop will
                reply to {form.email || 'your email'}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setForm({ name: '', email: '', message: '' });
                }}
                className="mt-6 border border-white/25 font-semibold px-6 py-3 min-h-[44px] hover:border-accent hover:text-accent transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label htmlFor="contact-name" className="eyebrow text-cream block mb-2">Your name</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full bg-ink-2 border border-white/20 text-cream placeholder:text-cream-dim/60 px-4 py-3 min-h-[48px] focus:border-accent outline-none"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="eyebrow text-cream block mb-2">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full bg-ink-2 border border-white/20 text-cream placeholder:text-cream-dim/60 px-4 py-3 min-h-[48px] focus:border-accent outline-none"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="eyebrow text-cream block mb-2">Message</label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Which silhouette, which size, what do you want to know?"
                  className="w-full bg-ink-2 border border-white/20 text-cream placeholder:text-cream-dim/60 px-4 py-3 outline-none resize-y focus:border-accent"
                />
              </div>
              <button
                type="submit"
                className="bg-cream text-ink font-semibold px-6 py-3 min-h-[48px] self-start hover:bg-accent hover:text-ink transition-colors"
              >
                Send message
              </button>
              <p className="text-xs text-cream-dim">Demo form — nothing is sent anywhere.</p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
