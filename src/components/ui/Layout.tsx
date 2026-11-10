import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Reveal } from './Reveal';

/* ------------------------------- Container ------------------------------- */
export function Container({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cn('container-site', className)}>{children}</div>;
}

/* -------------------------------- Section -------------------------------- */
export type SectionTone = 'white' | 'surface' | 'navy' | 'dark' | 'gradient';

const tones: Record<SectionTone, string> = {
  white: 'bg-white',
  surface: 'bg-surface',
  navy: 'on-dark bg-navy-800 text-white',
  dark: 'on-dark bg-purple-900 text-white',
  gradient: 'on-dark bg-signature-deep text-white',
};

export interface SectionProps {
  id?: string;
  tone?: SectionTone;
  /** Vertical spacing: default 64px mobile / 112px desktop. */
  spacing?: 'default' | 'compact' | 'none';
  className?: string;
  containerClassName?: string;
  children?: ReactNode;
  /** Accessible name for the region (use when there is no visible heading id). */
  labelledBy?: string;
  as?: 'section' | 'div';
}

export function Section({
  id,
  tone = 'white',
  spacing = 'default',
  className,
  containerClassName,
  children,
  labelledBy,
  as: Tag = 'section',
}: SectionProps) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        'relative',
        tones[tone],
        spacing === 'default' && 'py-16 lg:py-28',
        spacing === 'compact' && 'py-12 lg:py-16',
        className,
      )}
    >
      <div className={cn('container-site relative', containerClassName)}>{children}</div>
    </Tag>
  );
}

/* ---------------------------- SectionHeading ----------------------------- */
export interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  /** Heading level — keep a logical outline (one H1 per page). */
  level?: 'h1' | 'h2' | 'h3';
  id?: string;
  /** Light text for dark sections. */
  onDark?: boolean;
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  level: H = 'h2',
  id,
  onDark,
  className,
  children,
}: SectionHeadingProps) {
  return (
    <Reveal className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', 'mb-10 lg:mb-14', className)}>
      {eyebrow && <p className={cn('eyebrow mb-3', onDark ? 'text-gold-400' : 'text-purple-500')}>{eyebrow}</p>}
      <H
        id={id}
        className={cn(
          H === 'h1' ? 'text-h1' : H === 'h2' ? 'text-h2' : 'text-h3',
          'tracking-[-0.02em]',
          onDark && 'text-white',
        )}
      >
        {title}
      </H>
      {description && (
        <p className={cn('mt-4 text-body', onDark ? 'text-white/85' : 'text-muted', align === 'center' && 'mx-auto')}>
          {description}
        </p>
      )}
      {children}
    </Reveal>
  );
}

/* ---------------------------------- Card --------------------------------- */
export interface CardProps {
  className?: string;
  children?: ReactNode;
  /** Adds hover lift, purple border and deeper shadow. */
  interactive?: boolean;
  as?: 'div' | 'article' | 'li';
}

export function Card({ className, children, interactive, as: Tag = 'div' }: CardProps) {
  return (
    <Tag
      className={cn(
        'relative rounded-card border border-line bg-white p-6 shadow-card lg:p-7',
        interactive &&
          'group transition-[transform,box-shadow,border-color] duration-300 ease-premium hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-lift focus-within:border-purple-500/40',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/* ---------------------------------- Badge -------------------------------- */
export type BadgeTone = 'purple' | 'gold' | 'sample' | 'trust' | 'navy' | 'light';

const badgeTones: Record<BadgeTone, string> = {
  purple: 'bg-surface text-purple-700 ring-1 ring-purple-700/10',
  gold: 'bg-gold-400/20 text-purple-900 ring-1 ring-gold-400/40',
  sample: 'bg-white text-error-600 ring-1 ring-error-600/30',
  trust: 'bg-trust-600/10 text-purple-900 ring-1 ring-trust-600/25',
  navy: 'bg-navy-800 text-white',
  light: 'bg-white/15 text-white ring-1 ring-white/25',
};

export function Badge({
  tone = 'purple',
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide',
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Small "Sample" label used on placeholder testimonials, stats and team members. */
export function SampleLabel({ children = 'Sample', className }: { children?: ReactNode; className?: string }) {
  return (
    <Badge tone="sample" className={cn('uppercase', className)}>
      {children}
    </Badge>
  );
}
