/**
 * A small History-API router.
 *
 * - `RouterProvider` owns the current location + matched route and the loaded page module.
 * - Navigation loads the target route's chunk first, then commits the new location, so the
 *   old page stays on screen until the new one is ready (no blank flashes).
 * - After a client-side navigation it scrolls (top or #hash), moves focus to <main>, updates
 *   document meta and announces the new page title in an aria-live region.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import type { AppLocation, PageComponent, Params, RouteDef, RouteMatch } from './types';
import { matchRoute, normalizePath, toHref } from './paths';

/* ----------------------------- module cache ----------------------------- */

const moduleCache = new Map<string, PageComponent>();
const pending = new Map<string, Promise<PageComponent>>();

/** Loads (and caches) a route's page component. Safe to call repeatedly — used for prefetching. */
export function loadRoute(route: RouteDef): Promise<PageComponent> {
  const cached = moduleCache.get(route.id);
  if (cached) return Promise.resolve(cached);
  const inflight = pending.get(route.id);
  if (inflight) return inflight;
  const p = route.load().then((mod) => {
    moduleCache.set(route.id, mod.default);
    pending.delete(route.id);
    return mod.default;
  });
  pending.set(route.id, p);
  return p;
}

/** Seeds the cache (used before hydration and during prerendering). */
export function primeRoute(route: RouteDef, component: PageComponent): void {
  moduleCache.set(route.id, component);
}

/* -------------------------------- context ------------------------------- */

export interface NavigateOptions {
  replace?: boolean;
  /** Skip scrolling (e.g. when only the query string changes). */
  preserveScroll?: boolean;
}

interface RouterState {
  location: AppLocation;
  match: RouteMatch;
  routes: RouteDef[];
  navigate: (to: string, opts?: NavigateOptions) => Promise<void>;
  prefetch: (to: string) => void;
  /** Increments after each completed client navigation (0 on first render). */
  navigationCount: number;
}

const RouterContext = createContext<RouterState | null>(null);

function useRouter(): RouterState {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('Router hooks must be used inside <RouterProvider>');
  return ctx;
}

export const useLocation = (): AppLocation => useRouter().location;
export const useParams = (): Params => useRouter().match.params;
export const useRouteMatch = (): RouteMatch => useRouter().match;
export const useNavigate = (): RouterState['navigate'] => useRouter().navigate;
export const useRoutes = (): RouteDef[] => useRouter().routes;
export const useNavigationCount = (): number => useRouter().navigationCount;
export const usePrefetch = (): RouterState['prefetch'] => useRouter().prefetch;

export function useSearchParams(): URLSearchParams {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function parseLocation(href: string): AppLocation {
  const url = new URL(href, 'https://placeholder.local');
  return { pathname: normalizePath(url.pathname), search: url.search, hash: url.hash };
}

/* ------------------------------- provider ------------------------------- */

interface RouterProviderProps {
  routes: RouteDef[];
  /** Initial URL (path + search + hash). On the server this is the prerendered path. */
  url: string;
  children: ReactNode;
  /** Called after each client navigation commits (used for meta + analytics). */
  onNavigated?: (match: RouteMatch, location: AppLocation) => void;
}

export function RouterProvider({ routes, url, children, onNavigated }: RouterProviderProps) {
  const [state, setState] = useState(() => {
    const location = parseLocation(url);
    return { location, match: matchRoute(routes, location.pathname), count: 0 };
  });
  const navId = useRef(0);
  const pendingScroll = useRef<{ hash: string; preserve: boolean } | null>(null);
  const onNavigatedRef = useRef(onNavigated);
  onNavigatedRef.current = onNavigated;
  const locationRef = useRef(state.location);
  locationRef.current = state.location;

  const commit = useCallback(
    async (href: string, mode: 'push' | 'replace' | 'pop', preserveScroll = false) => {
      const location = parseLocation(href);
      const match = matchRoute(routes, location.pathname);
      const id = ++navId.current;
      await loadRoute(match.route);
      if (id !== navId.current) return; // a newer navigation won
      if (mode !== 'pop') {
        const full = `${toHref(location.pathname)}${location.search}${location.hash}`;
        if (mode === 'push') window.history.pushState({}, '', full);
        else window.history.replaceState({}, '', full);
      }
      pendingScroll.current = { hash: location.hash, preserve: preserveScroll || mode === 'pop' };
      setState((s) => ({ location, match, count: s.count + 1 }));
    },
    [routes],
  );

  const navigate = useCallback(
    (to: string, opts: NavigateOptions = {}) => commit(to, opts.replace ? 'replace' : 'push', opts.preserveScroll),
    [commit],
  );

  const prefetch = useCallback(
    (to: string) => {
      const { route } = matchRoute(routes, parseLocation(to).pathname);
      void loadRoute(route).catch(() => undefined);
    },
    [routes],
  );

  // Back/forward buttons
  useEffect(() => {
    const onPop = () => {
      // Pure in-page hash jumps (e.g. table-of-contents links) are handled by the browser.
      const next = parseLocation(window.location.href);
      const cur = locationRef.current;
      if (next.pathname === cur.pathname && next.search === cur.search) return;
      void commit(window.location.href, 'pop');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [commit]);

  // Post-navigation effects: scroll, focus, callbacks
  useEffect(() => {
    if (state.count === 0) return;
    const scroll = pendingScroll.current;
    pendingScroll.current = null;
    if (scroll && !scroll.preserve) {
      const target = scroll.hash ? document.getElementById(decodeURIComponent(scroll.hash.slice(1))) : null;
      if (target) target.scrollIntoView({ block: 'start' });
      else window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
    if (!scroll?.hash) {
      const main = document.getElementById('main-content');
      main?.focus({ preventScroll: true });
    }
    onNavigatedRef.current?.(state.match, state.location);
  }, [state]);

  const value = useMemo<RouterState>(
    () => ({
      location: state.location,
      match: state.match,
      routes,
      navigate,
      prefetch,
      navigationCount: state.count,
    }),
    [state, routes, navigate, prefetch],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

/* --------------------------------- view --------------------------------- */

/** Renders the matched page. The component must already be loaded (see loadRoute/primeRoute). */
export function RouteView() {
  const { match } = useRouter();
  const Page = moduleCache.get(match.route.id);
  if (!Page) return null;
  return <Page />;
}

/* --------------------------------- link --------------------------------- */

type AnchorProps = React.HTMLAttributes<HTMLAnchorElement>;

export interface LinkProps extends Omit<AnchorProps, 'href'> {
  to: string;
  replace?: boolean;
  children?: ReactNode;
}

function isModifiedEvent(e: MouseEvent<HTMLAnchorElement>): boolean {
  return e.metaKey || e.altKey || e.ctrlKey || e.shiftKey || e.button !== 0;
}

/**
 * Internal link. Renders a real <a href> (works without JS), intercepts same-origin clicks,
 * respects modifier keys / target / download, and prefetches the route chunk on hover/focus.
 */
export function Link({ to, replace, onClick, onMouseEnter, onFocus, target, rel, children, ...rest }: LinkProps) {
  const { navigate, prefetch } = useRouter();
  const href = toHref(to);
  const isExternal = /^(https?:|mailto:|tel:)/.test(to);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || isExternal || isModifiedEvent(e)) return;
    if (target && target !== '_self') return;
    if (rest.download !== undefined) return;
    e.preventDefault();
    void navigate(to, { replace });
  };

  return (
    <a
      {...rest}
      href={href}
      target={target}
      rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
      onClick={handleClick}
      onMouseEnter={(e) => {
        onMouseEnter?.(e);
        if (!isExternal) prefetch(to);
      }}
      onFocus={(e) => {
        onFocus?.(e);
        if (!isExternal) prefetch(to);
      }}
    >
      {children}
    </a>
  );
}
