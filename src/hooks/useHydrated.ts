import { useEffect, useState } from 'react';

/**
 * false during prerender and the first client render (hydration), true afterwards.
 * Use it before reading anything that differs between build time and the browser
 * (query string, storage, today's date) so hydration always matches the static HTML.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
