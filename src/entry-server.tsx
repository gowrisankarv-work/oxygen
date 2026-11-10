/**
 * Server entry — imported by scripts/build.ts to prerender every route to static HTML.
 * Never shipped to the browser.
 */
import { renderToString } from 'react-dom/server';
import { App } from '@/app/App';
import { siteConfig } from '@/config/site.config';
import { routes } from '@/router/routes';
import { expandRoutes, matchRoute, toHref } from '@/router/paths';
import { loadRoute } from '@/router/router';
import { renderHeadTags, resolveSeo } from '@/lib/seo';
import { buildRouteSchema } from '@/lib/route-schema';
import { getPreloadImages } from '@/lib/preload';

export { siteConfig, routes };

export const notFoundSource = routes.find((r) => r.path === '*')?.source ?? '';

/** Every concrete path to prerender (dynamic routes expanded via staticPaths). */
export function getPrerenderPaths(): { path: string; source: string }[] {
  return expandRoutes(routes)
    .filter((e) => e.route.prerender)
    .map((e) => ({ path: e.path, source: e.route.source }));
}

/** Entries for sitemap.xml — excludes noindex and non-sitemap routes. */
export function getSitemapEntries(): { path: string; priority: number; changefreq: string; lastmod?: string }[] {
  return expandRoutes(routes)
    .filter((e) => e.route.sitemap && !e.route.meta(e.params).noindex)
    .map((e) => {
      const opts = e.route.sitemap as { priority: number; changefreq: string };
      return { path: toHref(e.path), priority: opts.priority, changefreq: opts.changefreq };
    });
}

export interface RenderResult {
  html: string;
  head: string;
  preloadImages: { href: string; type?: string }[];
}

export async function renderPage(url: string): Promise<RenderResult> {
  const match = matchRoute(routes, url);
  await loadRoute(match.route);
  const html = renderToString(<App url={url} />);
  const seo = resolveSeo(match, url);
  const jsonLd = buildRouteSchema(match, url);
  return { html, head: renderHeadTags(seo, jsonLd), preloadImages: getPreloadImages(match) };
}
