import type { ImageAsset } from '@/config/images';
import { cn } from '@/lib/cn';

/** Image with explicit dimensions (no layout shift), lazy by default, async decoding. */
export function Img({
  asset,
  className,
  priority,
  alt,
  sizes,
}: {
  asset: ImageAsset;
  className?: string;
  /** Above-the-fold LCP image: eager + fetchpriority=high. */
  priority?: boolean;
  /** Override alt (use "" for purely decorative usage). */
  alt?: string;
  sizes?: string;
}) {
  return (
    <img
      src={asset.src}
      alt={alt ?? asset.alt}
      width={asset.width}
      height={asset.height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      sizes={sizes}
      className={cn('h-auto max-w-full', className)}
    />
  );
}
