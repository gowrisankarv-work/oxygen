import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { observeOnce } from '@/hooks/useInView';

type RevealTag = 'div' | 'li' | 'section' | 'article' | 'span' | 'figure';

export interface RevealProps {
  as?: RevealTag;
  /** Stagger index — each step adds ~70ms delay (see app.css). */
  index?: number;
  className?: string;
  children?: ReactNode;
  id?: string;
}

/**
 * Fade + translate-up on first scroll into view.
 * The visible state is written straight to the DOM (data-visible) — no re-render, no hydration
 * mismatch. Server HTML is fully visible; the hidden start state only applies under html.js.
 */
export function Reveal({ as: Tag = 'div', index = 0, className, children, id }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeOnce(el, () => {
      el.setAttribute('data-visible', '');
    });
  }, []);
  return (
    <Tag
      ref={ref as React.RefObject<never>}
      id={id}
      data-reveal=""
      className={className}
      style={index ? { '--i': index } : undefined}
    >
      {children}
    </Tag>
  );
}
