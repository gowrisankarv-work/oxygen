/**
 * Build-time constants injected by esbuild `define` (see scripts/lib/env.ts).
 * Values come from `.env` / process environment at build time — never put secrets here.
 */
interface OxygenBuildEnv {
  /** true for `npm run dev` and test bundles, false for production builds. */
  DEV: boolean;
  /** "development" | "production" | "test" */
  MODE: string;
  VITE_SITE_URL: string;
  VITE_FORM_PROVIDER: string;
  VITE_FORM_ENDPOINT: string;
  VITE_FORM_ACCESS_KEY: string;
  VITE_GA4_ID: string;
  VITE_PLAUSIBLE_DOMAIN: string;
  VITE_TURNSTILE_SITE_KEY: string;
  /** ISO date of the build, used for sitemap lastmod. */
  BUILD_DATE: string;
}

declare const __ENV__: OxygenBuildEnv;

interface Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  plausible?: (...args: unknown[]) => void;
  turnstile?: {
    render: (el: HTMLElement, opts: Record<string, unknown>) => string;
    reset: (id?: string) => void;
  };
  __OXYGEN_HYDRATED__?: boolean;
}
