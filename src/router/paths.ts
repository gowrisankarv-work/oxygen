import type { Params, RouteDef, RouteMatch } from './types';

/**
 * URL policy: canonical URLs use a trailing slash ("/about/"), matching how static hosts
 * serve `about/index.html`. Route patterns are stored without it. See DECISIONS.md.
 */
export function normalizePath(pathname: string): string {
  let p = pathname.split(/[?#]/)[0] ?? '/';
  if (!p.startsWith('/')) p = `/${p}`;
  p = p.replace(/\/{2,}/g, '/');
  if (p.length > 1) p = p.replace(/\/+$/, '');
  p = p.replace(/\/index\.html$/, '') || '/';
  return p.toLowerCase();
}

/** Converts an internal path ("/about", "/faq#fees") into a canonical href ("/about/", "/faq/#fees"). */
export function toHref(to: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(to)) return to;
  const match = /^([^?#]*)(\?[^#]*)?(#.*)?$/.exec(to);
  const pathPart = match?.[1] || '/';
  const search = match?.[2] ?? '';
  const hash = match?.[3] ?? '';
  let p = normalizePath(pathPart);
  if (p !== '/' && !/\.[a-z0-9]+$/i.test(p)) p = `${p}/`;
  return `${p}${search}${hash}`;
}

/** Builds a concrete path from a pattern and params. */
export function buildPath(pattern: string, params: Params = {}): string {
  return pattern.replace(/:([a-zA-Z]+)/g, (_, key: string) => encodeURIComponent(params[key] ?? ''));
}

function matchPattern(pattern: string, pathname: string): Params | null {
  const a = pattern.split('/').filter(Boolean);
  const b = pathname.split('/').filter(Boolean);
  if (a.length !== b.length) return null;
  const params: Params = {};
  for (let i = 0; i < a.length; i++) {
    const seg = a[i] as string;
    const val = b[i] as string;
    if (seg.startsWith(':')) params[seg.slice(1)] = decodeURIComponent(val);
    else if (seg !== val) return null;
  }
  return params;
}

/** Finds the route for a pathname. Dynamic params must be listed in `staticPaths`. */
export function matchRoute(routes: RouteDef[], pathname: string): RouteMatch {
  const path = normalizePath(pathname);
  let notFound: RouteDef | undefined;
  for (const route of routes) {
    if (route.path === '*') {
      notFound = route;
      continue;
    }
    const params = matchPattern(route.path, path);
    if (!params) continue;
    if (route.staticPaths) {
      const valid = route.staticPaths().some((p) => Object.keys(params).every((k) => p[k] === params[k]));
      if (!valid) continue;
    }
    return { route, params };
  }
  if (!notFound) throw new Error('Route table must include a "*" route');
  return { route: notFound, params: {} };
}

/** Expands every prerenderable route into concrete paths. */
export function expandRoutes(routes: RouteDef[]): { route: RouteDef; params: Params; path: string }[] {
  const out: { route: RouteDef; params: Params; path: string }[] = [];
  for (const route of routes) {
    if (route.path === '*') continue;
    if (route.staticPaths) {
      for (const params of route.staticPaths()) out.push({ route, params, path: buildPath(route.path, params) });
    } else {
      out.push({ route, params: {}, path: route.path });
    }
  }
  return out;
}
