import type { ReactNode } from 'react';
import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/cn';

/** Bullet list with the brand shield-check motif (trust bullets). */
export function ShieldList({
  items,
  className,
  onDark,
  compact,
}: {
  items: ReactNode[];
  className?: string;
  onDark?: boolean;
  compact?: boolean;
}) {
  return (
    <ul className={cn(compact ? 'space-y-2' : 'space-y-3', className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <Icon
            name="shield-check"
            size={compact ? 18 : 20}
            className={cn('mt-[0.2em]', onDark ? 'text-gold-400' : 'text-trust-600')}
          />
          <span className={cn(onDark ? 'text-white/90' : 'text-ink')}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Simple check-mark list (used for inclusions / deliverables). */
export function CheckList({ items, className, columns }: { items: ReactNode[]; className?: string; columns?: 1 | 2 }) {
  return (
    <ul className={cn('grid gap-x-8 gap-y-2.5', columns === 2 && 'sm:grid-cols-2', className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="mt-[0.3em] grid size-5 shrink-0 place-items-center rounded-full bg-purple-700/10 text-purple-700">
            <Icon name="check" size={13} strokeWidth={2.5} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
