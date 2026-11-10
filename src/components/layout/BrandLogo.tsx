/**
 * Brand logo. By default renders the client's official logo files from /public/brand
 * (configured in site.config.ts → brand.files). Setting `brand.logoSource = 'svg-component'`
 * falls back to the built-in text-based version below.
 * Never stretch or recolour the logo — sizes scale proportionally via `size`.
 */
import { siteConfig } from '@/config/site.config';
import { cn } from '@/lib/cn';

export interface BrandLogoProps {
  variant?: 'full' | 'wordmark' | 'emblem';
  theme?: 'light' | 'dark';
  /** Height of the emblem in px; the wordmark scales with it. */
  size?: number;
  className?: string;
}

export function Emblem({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      {/* circular "G"-style growth arrow */}
      <path
        d="M36.4 9.6A19 19 0 1 0 43 24"
        fill="none"
        className="stroke-trust-600"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <path d="M38.2 25.6h9.4L42.9 19.3Z" className="fill-trust-600" transform="rotate(8 43 23)" />
      {/* shield */}
      <path d="M24 12.3l8.6 3.3v6.4c0 5.5-3.6 9.7-8.6 11.3-5-1.6-8.6-5.8-8.6-11.3v-6.4Z" className="fill-trust-600" />
      {/* check */}
      <path
        d="m19.6 22.9 3.1 3.1 5.8-6.2"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Wordmark({ theme, size }: { theme: 'light' | 'dark'; size: number }) {
  const scale = size / 40;
  return (
    <span className="flex flex-col items-start leading-none" style={{ fontSize: `${scale}rem` }}>
      <span
        className={cn(
          'border-b-[0.09em] pb-[0.06em] font-display text-[1.75em] font-bold tracking-[-0.045em]',
          theme === 'dark' ? 'border-gold-400 text-white' : 'border-trust-600 text-purple-700',
        )}
        style={{ lineHeight: 0.95 }}
      >
        øx
        <span className="relative">g</span>
        <span className="relative inline-block">
          n
          <span className="absolute inset-x-[0.06em] top-[0.08em] h-[0.09em] rounded-full bg-current" />
        </span>
      </span>
      <span
        className={cn(
          'mt-[0.28em] pl-[0.05em] text-[0.62em] font-bold tracking-[0.32em]',
          theme === 'dark' ? 'text-white/90' : 'text-purple-900',
        )}
      >
        EDU-HUB
      </span>
    </span>
  );
}

export function BrandLogo({ variant = 'full', theme = 'light', size = 40, className }: BrandLogoProps) {
  if (siteConfig.brand.logoSource === 'files') {
    const f = siteConfig.brand.files;
    const file =
      variant === 'emblem'
        ? f.emblem
        : variant === 'wordmark'
          ? f.wordmarkWhite
          : theme === 'dark'
            ? f.fullDark
            : f.full;
    // `size` is the rendered height; width follows the file's aspect ratio (never stretched).
    const width = Math.round((file.width / file.height) * size);
    return (
      <img
        src={file.src}
        alt=""
        width={width}
        height={size}
        decoding="async"
        className={cn('block max-w-none select-none', className)}
      />
    );
  }
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)} aria-hidden="true">
      {variant !== 'wordmark' && <Emblem size={size} />}
      {variant !== 'emblem' && <Wordmark theme={theme} size={size} />}
    </span>
  );
}
