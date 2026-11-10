import { useEffect, useRef, useState } from 'react';

/**
 * One shared IntersectionObserver for the whole app (cheaper than one per element).
 * Callbacks fire once when the element first enters the viewport, then unsubscribe.
 */
type Callback = () => void;
const callbacks = new WeakMap<Element, Callback>();
let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return null;
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const cb = callbacks.get(entry.target);
          if (cb) {
            cb();
            callbacks.delete(entry.target);
            observer?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
  }
  return observer;
}

/** Calls `onEnter` once when the element scrolls into view (immediately if IO is unavailable). */
export function observeOnce(el: Element, onEnter: Callback): () => void {
  const io = getObserver();
  if (!io) {
    onEnter();
    return () => undefined;
  }
  callbacks.set(el, onEnter);
  io.observe(el);
  return () => {
    callbacks.delete(el);
    io.unobserve(el);
  };
}

/** React hook: returns [ref, inView] — inView flips to true once and stays true. */
export function useInView<T extends Element>(): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeOnce(el, () => setInView(true));
  }, []);
  return [ref, inView];
}
