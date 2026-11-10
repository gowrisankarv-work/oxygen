/**
 * Services mega-menu — disclosure pattern: a button (aria-expanded/aria-controls) and a panel.
 * Opens on click, and with hover intent on mouse pointers. Closes on Esc (focus returns to
 * the button), outside click, focus leaving the menu, or navigation.
 */
import { useEffect, useId, useRef, useState } from 'react';
import { services } from '@/content/services';
import { Link, useLocation } from '@/router/router';
import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/cn';

export function MegaMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const rootRef = useRef<HTMLLIElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const hoverOpen = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpen(true), 120);
  };
  const hoverClose = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpen(false), 220);
  };

  return (
    <li
      ref={rootRef}
      className="static"
      onPointerEnter={hoverOpen}
      onPointerLeave={hoverClose}
      onBlurCapture={(e) => {
        if (open && rootRef.current && !rootRef.current.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex min-h-11 items-center gap-1 rounded-full px-3.5 py-2 text-[0.95rem] font-medium transition-colors hover:text-purple-500',
          active || open ? 'text-purple-700' : 'text-ink',
        )}
      >
        Services
        <Icon name="chevron-down" size={16} className={cn('transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <div id={`${id}-panel`} hidden={!open} className="pop-in absolute inset-x-0 top-full pt-2">
        <div className="container-site">
          <div className="rounded-card border border-line bg-white p-4 shadow-lift lg:p-5">
            <ul className="grid grid-cols-2 gap-2 xl:grid-cols-4">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/services/${s.slug}`}
                    className="group flex h-full gap-4 rounded-xl p-4 transition-colors hover:bg-surface"
                    onClick={() => setOpen(false)}
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-signature text-white shadow-soft transition-transform duration-300 group-hover:rotate-[-6deg]">
                      <Icon name={s.icon} size={22} />
                    </span>
                    <span>
                      <span className="block font-display font-semibold text-purple-900">{s.title}</span>
                      <span className="mt-1 block text-small text-muted">{s.tagline}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface px-4 py-3">
              <p className="text-small text-muted">Not sure which service fits? Start with a free consultation.</p>
              <Link
                to="/services"
                onClick={() => setOpen(false)}
                className="group inline-flex items-center gap-1.5 text-small font-semibold text-purple-700 hover:text-purple-500"
              >
                View all services
                <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
