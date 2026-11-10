import { absoluteUrl, siteConfig } from '@/config/site.config';
import { toHref } from '@/router/paths';
import type { RouteMatch } from '@/router/types';

export interface ResolvedSeo {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogType: 'website' | 'article';
  noindex: boolean;
}

/** Applies the "%s | OXYGEN EDU-HUB" template. */
export function formatTitle(title: string, absolute = false): string {
  if (absolute) return title;
  return siteConfig.seo.titleTemplate.replace('%s', title);
}

/** Resolves final SEO values for a matched route at a concrete pathname. */
export function resolveSeo(match: RouteMatch, pathname: string): ResolvedSeo {
  const meta = match.route.meta(match.params);
  const isNotFound = match.route.path === '*';
  return {
    title: formatTitle(meta.title, meta.absoluteTitle),
    description: meta.description,
    canonical: absoluteUrl(isNotFound ? '/404/' : toHref(pathname)),
    ogImage: absoluteUrl(meta.ogImage ?? siteConfig.seo.ogImage),
    ogType: meta.ogType ?? 'website',
    noindex: Boolean(meta.noindex) || isNotFound,
  };
}

function esc(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Serialises JSON-LD safely for embedding in a <script> tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

/** Static <head> tags for a route (used by the prerender step). */
export function renderHeadTags(seo: ResolvedSeo, jsonLd: unknown[]): string {
  const tags = [
    `<title>${esc(seo.title)}</title>`,
    `<meta name="description" content="${esc(seo.description)}">`,
    `<link rel="canonical" href="${esc(seo.canonical)}">`,
    `<meta name="robots" content="${seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">`,
    `<meta property="og:site_name" content="${esc(siteConfig.companyName)}">`,
    `<meta property="og:locale" content="${esc(siteConfig.seo.locale)}">`,
    `<meta property="og:type" content="${seo.ogType}">`,
    `<meta property="og:title" content="${esc(seo.title)}">`,
    `<meta property="og:description" content="${esc(seo.description)}">`,
    `<meta property="og:url" content="${esc(seo.canonical)}">`,
    `<meta property="og:image" content="${esc(seo.ogImage)}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(seo.title)}">`,
    `<meta name="twitter:description" content="${esc(seo.description)}">`,
    `<meta name="twitter:image" content="${esc(seo.ogImage)}">`,
  ];
  if (siteConfig.seo.twitterHandle) {
    tags.push(`<meta name="twitter:site" content="${esc(siteConfig.seo.twitterHandle)}">`);
  }
  for (const block of jsonLd) {
    tags.push(`<script type="application/ld+json">${serializeJsonLd(block)}</script>`);
  }
  return tags.join('\n    ');
}

/** Client-side meta updates after navigation (titles, description, canonical, OG, robots). */
export function applySeoToDocument(seo: ResolvedSeo): void {
  document.title = seo.title;
  const setMeta = (attr: 'name' | 'property', key: string, value: string) => {
    let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  };
  setMeta('name', 'description', seo.description);
  setMeta('name', 'robots', seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
  setMeta('property', 'og:title', seo.title);
  setMeta('property', 'og:description', seo.description);
  setMeta('property', 'og:url', seo.canonical);
  setMeta('property', 'og:type', seo.ogType);
  setMeta('property', 'og:image', seo.ogImage);
  setMeta('name', 'twitter:title', seo.title);
  setMeta('name', 'twitter:description', seo.description);
  setMeta('name', 'twitter:image', seo.ogImage);
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = seo.canonical;
}
