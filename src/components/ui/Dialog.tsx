/**
 * Modal dialog / slide-in drawer on the native <dialog> element (showModal):
 * the rest of the page becomes inert (focus is trapped), Esc closes it (cancel event),
 * clicking the backdrop closes it, focus returns to the trigger and page scroll is locked.
 */
import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/icons/Icon';
import { useLockBodyScroll } from '@/hooks/useScroll';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Visually hide the title (still the accessible name). */
  hideTitle?: boolean;
  description?: ReactNode;
  variant?: 'modal' | 'drawer';
  className?: string;
  children?: ReactNode;
  /** Optional content placed at the bottom of a drawer (sticky footer). */
  footer?: ReactNode;
}

export function Dialog({
  open,
  onClose,
  title,
  hideTitle,
  description,
  variant = 'modal',
  className,
  children,
  footer,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();
  useLockBodyScroll(open);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // When the dialog closes for any reason, return focus to the element that opened it
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onCloseEvt = () => {
      const target = returnFocus.current;
      returnFocus.current = null;
      if (target && document.contains(target)) target.focus({ preventScroll: true });
    };
    dialog.addEventListener('close', onCloseEvt);
    return () => dialog.removeEventListener('close', onCloseEvt);
  }, []);

  const isDrawer = variant === 'drawer';

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onKeyDown={(e) => {
        // Strict focus trap: native modal dialogs let Tab escape to the browser UI after the
        // last control; wrap focus between the first and last focusable elements instead.
        if (e.key !== 'Tab') return;
        const nodes = Array.from(
          e.currentTarget.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((n) => n.offsetParent !== null || n === document.activeElement);
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={cn(
        'bg-white p-0 text-ink shadow-lift backdrop:bg-ink/55',
        isDrawer
          ? 'drawer-panel m-0 ml-auto h-dvh max-h-dvh w-[min(24rem,100vw)] max-w-none'
          : 'pop-in m-auto w-[min(36rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] rounded-card',
        className,
      )}
    >
      {open && (
        <div className={cn('flex flex-col', isDrawer ? 'h-full' : 'max-h-[calc(100dvh-2rem)]')}>
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
            <div>
              <h2 id={titleId} className={cn('text-h3 tracking-[-0.01em]', hideTitle && 'sr-only')}>
                {title}
              </h2>
              {description && (
                <p id={descId} className="mt-1 text-small text-muted">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="-mr-2 grid size-11 shrink-0 place-items-center rounded-full text-purple-900 transition-colors hover:bg-surface"
              aria-label="Close"
            >
              <Icon name="close" size={22} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">{children}</div>
          {footer && <div className="border-t border-line px-5 py-4 sm:px-6">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}
