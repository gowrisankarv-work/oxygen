import { matchRoute, toHref } from '@/router/paths';
import type { RouteDef } from '@/router/types';

export interface Crumb {
  label: string;
  href: string;
}

/**
 * Builds breadcrumbs from the URL segments using route labels:
 * "/services/publication-services" → Home › Services › Publication Services
 */
export function buildBreadcrumbs(routes: RouteDef[], pathname: string): Crumb[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: Crumb[] = [{ label: 'Home', href: '/' }];
  let path = '';
  for (const seg of segments) {
    path += `/${seg}`;
    const { route, params } = matchRoute(routes, path);
    if (route.path === '*') continue;
    crumbs.push({ label: route.label(params), href: toHref(path) });
  }
  return crumbs;
}
