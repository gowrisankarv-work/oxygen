import type { ReactNode } from 'react';

export type Params = Record<string, string>;

export type PageComponent = () => ReactNode;

export interface PageModule {
  default: PageComponent;
}

export interface RouteMeta {
  /** Page title without the site suffix; the title template is applied automatically. */
  title: string;
  /** 150–160 character meta description. */
  description: string;
  noindex?: boolean;
  /** Absolute path (from site root) to a 1200×630 OG image. */
  ogImage?: string;
  ogType?: 'website' | 'article';
  /** Use the title as-is, without "| OXYGEN EDU-HUB" (home page). */
  absoluteTitle?: boolean;
}

export interface SitemapOptions {
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface RouteDef {
  /** Stable identifier used for schema builders and tests. */
  id: string;
  /** Path pattern without trailing slash, e.g. "/resources/:slug". "*" = not found. */
  path: string;
  load: () => Promise<PageModule>;
  /** Source file of the page module (relative to project root) — used to modulepreload its chunk. */
  source: string;
  meta: (params: Params) => RouteMeta;
  /** Breadcrumb / sitemap label. */
  label: (params: Params) => string;
  /** Prerender to static HTML at build time. */
  prerender: boolean;
  /** Include in sitemap.xml (false = excluded). */
  sitemap: SitemapOptions | false;
  /** For dynamic routes: every valid parameter set. Unknown params resolve to 404. */
  staticPaths?: () => Params[];
  /** Only available in development builds. */
  devOnly?: boolean;
  /** Group used by the HTML sitemap page. */
  group: 'main' | 'services' | 'resources' | 'legal' | 'utility';
}

export interface RouteMatch {
  route: RouteDef;
  params: Params;
}

export interface AppLocation {
  pathname: string;
  search: string;
  hash: string;
}
