/**
 * Accordion built on native <details>/<summary> (keyboard + screen reader support for free).
 * `single` makes it a controlled group where opening one item closes the others.
 */
import { useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/icons/Icon';

export interface AccordionItemData {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItemData[];
  single?: boolean;
  /** Ids open initially (uncontrolled) or the single open id. */
  defaultOpen?: string[];
  className?: string;
  /** Heading level wrapped around each summary text for document outline. */
  headingLevel?: 'h3' | 'h4';
}

export function Accordion({ items, single, defaultOpen = [], className, headingLevel: H = 'h3' }: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpen);

  return (
    <div className={cn('divide-y divide-line rounded-card border border-line bg-white', className)}>
      {items.map((item) => {
        const open = openIds.includes(item.id);
        return (
          <details
            key={item.id}
            id={item.id}
            open={open}
            onToggle={(e) => {
              const isOpen = (e.currentTarget as HTMLDetailsElement).open;
              setOpenIds((prev) => {
                if (isOpen === prev.includes(item.id)) return prev;
                if (isOpen) return single ? [item.id] : [...prev, item.id];
                return prev.filter((x) => x !== item.id);
              });
            }}
            className="group/acc"
          >
            <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface/70 sm:px-6">
              <H className="font-sans text-base font-semibold text-purple-900 sm:text-[1.05rem]">{item.title}</H>
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface text-purple-700 transition-transform duration-300 ease-premium group-open/acc:rotate-180">
                <Icon name="chevron-down" size={18} />
              </span>
            </summary>
            <div className="px-5 pb-5 text-muted sm:px-6">{item.content}</div>
          </details>
        );
      })}
    </div>
  );
}
