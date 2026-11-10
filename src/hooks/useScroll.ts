import { useEffect, useState } from 'react';

export interface ScrollState {
  y: number;
  direction: 'up' | 'down';
}

/** Tracks scroll position and direction (rAF-throttled). Server/initial value: top, "up". */
export function useScrollState(threshold = 6): ScrollState {
  const [state, setState] = useState<ScrollState>({ y: 0, direction: 'up' });
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const delta = y - last;
      if (Math.abs(delta) < threshold && y > 0) return;
      setState({ y, direction: delta > 0 && y > 0 ? 'down' : 'up' });
      last = y;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return state;
}

/** Locks page scroll while `locked` is true (used by the drawer and modals). */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const html = document.documentElement;
    const scrollbar = window.innerWidth - html.clientWidth;
    const prevOverflow = html.style.overflow;
    const prevPadding = html.style.paddingRight;
    html.style.overflow = 'hidden';
    if (scrollbar > 0) html.style.paddingRight = `${scrollbar}px`;
    return () => {
      html.style.overflow = prevOverflow;
      html.style.paddingRight = prevPadding;
    };
  }, [locked]);
}

/** True when the user asked the OS to reduce motion. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
