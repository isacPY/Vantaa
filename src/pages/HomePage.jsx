import React from 'react';
import ProductGrid from '../components/ProductGrid';

// Home IS the showcase: the wall of shoes on shelves. No hero — the
// video opens straight on the collection.
export default function HomePage() {
  return (
    <main>
      <ProductGrid />
    </main>
  );
}
