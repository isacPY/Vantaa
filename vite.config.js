import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages: repo is isacPY/Vantaa (created 2026-11-12, double-a),
// so the site lives under /Vantaa/.
// Hash routing (see src/App.jsx) means deep links work on Pages without
// server-side rewrites; public/404.html is a belt-and-braces fallback.
export default defineConfig({
  base: '/Vantaa/',
  plugins: [tailwindcss(), react()],
  server: { port: 5173, host: true },
  preview: { port: 4173, host: true },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core': ['react', 'react-dom'],
          'gsap-core': ['gsap'],
          'lenis-core': ['lenis'],
          icons: ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
    target: 'esnext',
    cssMinify: true,
  },
  optimizeDeps: {
    include: ['gsap', 'gsap/ScrollTrigger', 'lenis', 'lucide-react'],
  },
});
