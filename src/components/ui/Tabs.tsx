/**
 * Tabs following the WAI-ARIA Authoring Practices:
 * role=tablist/tab/tabpanel, roving tabindex, Arrow keys / Home / End, automatic activation.
 */
import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  label: string;
  defaultValue?: string;
  /** Controlled value. */
  value?: string;
  onValueChange?: (id: string) => void;
  className?: string;
  listClassName?: string;
  panelClassName?: string;
  variant?: 'pill' | 'underline';
}

export function Tabs({
  items,
  label,
  defaultValue,
  value,
  onValueChange,
  className,
  listClassName,
  panelClassName,
  variant = 'pill',
}: TabsProps) {
  const uid = useId();
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id ?? '');
  const active = value ?? internal;
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string, focus = false) => {
    if (value === undefined) setInternal(id);
    onValueChange?.(id);
    if (focus) tabRefs.current[id]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const idx = items.findIndex((t) => t.id === active);
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % items.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    if (next < 0) return;
    e.preventDefault();
    const target = items[next];
    if (target) select(target.id, true);
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className={cn(
          'flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]',
          variant === 'underline' && 'gap-6 border-b border-line',
          listClassName,
        )}
      >
        {items.map((t) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[t.id] = el;
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(t.id)}
              className={cn(
                'min-h-11 shrink-0 font-semibold whitespace-nowrap transition-colors duration-200',
                variant === 'pill' &&
                  (selected
                    ? 'rounded-full bg-purple-700 px-5 py-2.5 text-small text-white shadow-soft'
                    : 'rounded-full border border-line bg-white px-5 py-2.5 text-small text-purple-900 hover:border-purple-500/40'),
                variant === 'underline' &&
                  (selected
                    ? '-mb-px border-b-2 border-purple-700 py-3 text-purple-700'
                    : '-mb-px border-b-2 border-transparent py-3 text-muted hover:text-purple-700'),
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {items.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${uid}-panel-${t.id}`}
          aria-labelledby={`${uid}-tab-${t.id}`}
          hidden={t.id !== active}
          tabIndex={0}
          className={cn('mt-8 focus-visible:outline-offset-8', panelClassName)}
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
