import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BAG_STORAGE_KEY } from '../config/brand';
import { getProduct } from '../data/products';

const BagContext = createContext(null);

function loadBag() {
  try {
    const raw = localStorage.getItem(BAG_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Drop anything that no longer matches a product (rebrand-safe).
    return parsed.filter((i) => i && getProduct(i.slug) && Number.isInteger(i.size) && Number.isInteger(i.qty) && i.qty > 0);
  } catch {
    return [];
  }
}

export function BagProvider({ children }) {
  const [items, setItems] = useState(loadBag);
  const [isOpen, setIsOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Private mode / storage full: bag still works for the session.
    }
  }, [items]);

  const add = useCallback((slug, size) => {
    setItems((prev) => {
      const found = prev.find((i) => i.slug === slug && i.size === size);
      if (found) {
        return prev.map((i) => (i.slug === slug && i.size === size ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { slug, size, qty: 1 }];
    });
    setJustAdded({ slug, size });
    setIsOpen(true);
  }, []);

  const setQty = useCallback((slug, size, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => !(i.slug === slug && i.size === size))
        : prev.map((i) => (i.slug === slug && i.size === size ? { ...i, qty } : i)),
    );
  }, []);

  const remove = useCallback((slug, size) => {
    setItems((prev) => prev.filter((i) => !(i.slug === slug && i.size === size)));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openBag = useCallback(() => setIsOpen(true), []);
  const closeBag = useCallback(() => {
    setIsOpen(false);
    setJustAdded(null);
  }, []);

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);

  const value = useMemo(
    () => ({ items, count, isOpen, justAdded, add, setQty, remove, clear, openBag, closeBag }),
    [items, count, isOpen, justAdded, add, setQty, remove, clear, openBag, closeBag],
  );

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag() {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error('useBag must be used inside BagProvider');
  return ctx;
}
