import type { ReactNode } from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { cn } from '@/lib/cn';
import type { ImageAsset } from '@/config/images';

export interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  image?: ImageAsset;
  children?: ReactNode;
  /** Hide breadcrumbs (e.g. 404). */
  noBreadcrumbs?: boolean;
  className?: string;
}

/** Reusable inner-page banner: breadcrumbs, eyebrow, H1, subtitle, gradient blobs, optional image. */
export function PageHero({ eyebrow, title, subtitle, image, children, noBreadcrumbs, className }: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden bg-surface pt-[calc(var(--header-h)+var(--topbar-h)+2.5rem)] pb-14 lg:pt-[calc(var(--header-h)+var(--topbar-h)+4rem)] lg:pb-20',
        className,
      )}
    >
      {/* decorative blobs + slash pattern */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-20 size-[26rem] bg-signature opacity-25 blur-3xl motion-safe:animate-blob" />
        <div className="absolute -bottom-32 -left-24 size-80 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="pattern-slash absolute inset-y-0 right-0 w-1/2 text-purple-700 opacity-[0.05]" />
      </div>
      <div className={cn('container-site', image && 'grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]')}>
        <div className="max-w-3xl">
          {!noBreadcrumbs && <Breadcrumbs className="mb-6" />}
          {eyebrow && <p className="eyebrow mb-3 text-purple-500">{eyebrow}</p>}
          <h1 className="text-h1 tracking-[-0.02em]">{title}</h1>
          {subtitle && <p className="mt-5 max-w-2xl text-body text-muted">{subtitle}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
        {image && (
          <div className="relative mx-auto hidden w-full max-w-md lg:block">
            <div aria-hidden="true" className="absolute inset-6 -z-10 bg-signature opacity-30 blur-2xl" />
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              decoding="async"
              fetchPriority="high"
              className="h-auto w-full rounded-[2rem] shadow-lift"
            />
          </div>
        )}
      </div>
    </section>
  );
}
