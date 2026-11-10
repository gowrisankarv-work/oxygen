/**
 * Accessible carousel: CSS scroll-snap track + prev/next buttons, dots and an explicit
 * pause/play control. Auto-advances every 7s (never under reduced motion), pausing on
 * hover and keyboard focus. Arrow keys move between slides when the region has focus.
 */
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/icons/Icon';
import { prefersReducedMotion } from '@/hooks/useScroll';

export interface CarouselProps {
  label: string;
  slides: ReactNode[];
  /** Tailwind width classes for each slide (controls slides per view). */
  slideClassName?: string;
  autoPlayMs?: number;
  className?: string;
}

export function Carousel({
  label,
  slides,
  slideClassName = 'w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]',
  autoPlayMs = 7000,
  className,
}: CarouselProps) {
  const id = useId();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!prefersReducedMotion() && slides.length > 1) setPlaying(true);
  }, [slides.length]);

  const scrollTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[i] as HTMLElement | undefined;
    if (!slide) return;
    track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, []);

  const go = useCallback(
    (i: number) => {
      const next = (i + slides.length) % slides.length;
      setIndex(next);
      scrollTo(next);
    },
    [slides.length, scrollTo],
  );

  // Keep index in sync when the user swipes/scrolls the track
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const children = Array.from(track.children) as HTMLElement[];
        const left = track.scrollLeft + track.offsetLeft;
        let best = 0;
        let bestDist = Infinity;
        children.forEach((c, i) => {
          const d = Math.abs(c.offsetLeft - left);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setIndex(best);
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      track.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!playing || hovered || focused) return;
    const t = window.setTimeout(() => go(index + 1), autoPlayMs);
    return () => window.clearTimeout(t);
  }, [playing, hovered, focused, index, go, autoPlayMs]);

  const ctrl =
    'grid size-11 place-items-center rounded-full border border-line bg-white text-purple-700 shadow-card transition-colors hover:border-purple-500 hover:bg-surface';

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className={cn('relative', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          go(index + 1);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          go(index - 1);
        }
      }}
    >
      <div
        ref={trackRef}
        id={`${id}-track`}
        aria-live={playing && !hovered && !focused ? 'off' : 'polite'}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            className={cn('shrink-0 snap-start', slideClassName)}
          >
            {slide}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1" role="group" aria-label="Choose slide">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
              aria-controls={`${id}-track`}
              className="grid size-6 place-items-center rounded-full"
            >
              <span
                className={cn(
                  'block h-2 rounded-full transition-all duration-300',
                  i === index ? 'w-6 bg-purple-700' : 'w-2 bg-purple-700/25',
                )}
              />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={ctrl}
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause automatic slide show' : 'Play automatic slide show'}
          >
            {playing ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            className={ctrl}
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            aria-controls={`${id}-track`}
          >
            <Icon name="chevron-left" size={20} />
          </button>
          <button
            type="button"
            className={ctrl}
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            aria-controls={`${id}-track`}
          >
            <Icon name="chevron-right" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
