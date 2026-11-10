# Decisions log

Design and technical decisions, assumptions and known limitations for the OXYGEN EDU-HUB website v1.0.0.

## 1. Build environment constraint (most important)

Package installation was impossible in the build environment (no npm registry access). The
original brief’s stack (Vite, React Router v7 framework mode, Radix UI, Motion, React Hook Form,
lucide-react, @fontsource, Vitest, Testing Library, @axe-core/playwright, typescript-eslint,
eslint-plugin-jsx-a11y, Husky) could not be installed. By instruction, only these pre-installed
packages were used — versions recorded from the environment (`npm ls --depth=0` equivalent):

| Package                              | Version |
| ------------------------------------ | ------- |
| react / react-dom                    | 19.2.8  |
| typescript                           | 6.0.3   |
| esbuild                              | 0.28.2  |
| tailwindcss (core)                   | 4.3.3   |
| zod                                  | 3.25.76 |
| clsx                                 | 2.1.1   |
| tailwind-merge                       | 3.6.0   |
| playwright (incl. `playwright/test`) | 1.63.0  |
| eslint                               | 10.1.0  |
| prettier                             | 3.8.1   |

These exact versions are pinned in `package.json`, so `npm install` on any machine reproduces the
same toolchain. No other dependency was added.

### Replacements built in-house

| Brief asked for                                | Built instead                                                                                                                                  | Where                                     |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Vite + React Router framework mode + prerender | esbuild client/server bundles + custom prerender                                                                                               | `scripts/build.ts`, `src/entry-*.tsx`     |
| React Router                                   | ~250-line History-API router: typed route table, `Link` with prefetch, dynamic params, scroll/hash handling, focus management, route announcer | `src/router/`                             |
| Tailwind Vite plugin / CLI                     | Tailwind v4 `compile()` + regex candidate scanner                                                                                              | `scripts/tailwind.ts`                     |
| Radix UI                                       | Native `<dialog>` (modal + drawer), `<details>` accordion, WAI-ARIA tabs, disclosure mega-menu, scroll-snap carousel, toast                    | `src/components/ui/`                      |
| Motion                                         | CSS keyframes + one shared IntersectionObserver (`Reveal`), rAF counters                                                                       | `src/styles/app.css`, `src/hooks/`        |
| React Hook Form                                | React 19 `useActionState` + Zod; `useReducer` state machine for the multi-step form                                                            | `src/components/forms/`                   |
| lucide-react                                   | 62 in-house SVG icons (24×24, 1.75 stroke, round caps)                                                                                         | `src/components/icons/Icon.tsx`           |
| @fontsource (self-hosted fonts)                | Google Fonts with `preconnect` + `display=swap` + metric-adjusted fallbacks                                                                    | `scripts/lib/html.ts`, `app.css`          |
| Vitest + RTL                                   | `node:test` + `renderToString`; interaction tests moved to Playwright                                                                          | `tests/`, `e2e/`                          |
| @axe-core/playwright                           | Custom Playwright a11y assertions on every route                                                                                               | `e2e/routes.spec.ts`                      |
| typescript-eslint + jsx-a11y                   | ESLint core rules on type-stripped output + in-house rules (img alt, iframe title, button type, noopener, tabindex, autofocus)                 | `scripts/lint.ts`                         |
| `@types/react`                                 | Minimal hand-written React/ReactDOM type declarations                                                                                          | `types/`                                  |
| rollup-plugin-visualizer                       | esbuild metafile report (`npm run analyze`)                                                                                                    | `scripts/build.ts`                        |
| Image toolchain (AVIF/WebP)                    | Original SVG illustrations; OG images + favicons rendered with Playwright                                                                      | `public/images`, `scripts/generate-og.ts` |

**Migrating later:** if packages can be installed in future, the code is written against standard
React 19 APIs, so swapping in Vite / React Router / Radix is incremental. The quickest wins:
install `@types/react @types/react-dom` and delete `types/react*`; add `typescript-eslint` and
`eslint-plugin-jsx-a11y` to `scripts/lint.ts`; add `@axe-core/playwright` to `e2e/routes.spec.ts`.

## 2. Tagline

Candidates (all play on oxygen as fuel for growth):

1. **“Fuel for Your Academic Journey”** ← chosen
2. “Breathe Life Into Your Ambitions”
3. “Guidance That Helps You Rise”

Chosen because it is the most direct expression of “oxygen = fuel”, covers all four services
(the _academic journey_ spans admissions through publication), and is calm and credible rather
than hype. Option 3 is used as a secondary line on the home page (“…helps you breathe easier — and
rise”). Change it in `site.config.ts → tagline`.

## 3. Design decisions

- **Style:** premium academic-corporate — white/soft-lavender surfaces (~70%), purple family
  (~20%), red/gold/magenta accents (~10%). Signature gradient only on decorative blobs, icon chips
  and CTA banners — never behind body text.
- **CTA banner gradient:** the brief’s signature gradient ends in magenta (#D61F8C), where white
  text measures 4.74:1 and violet-400 measures 4.23:1 (fails AA for small text). Text-bearing
  banners use a **deeper variant** (`--gradient-signature-deep`, #2A0A52 → #A3166B) that keeps
  every point ≥ 7:1. The original gradient is still used for decorative elements.
- **WhatsApp green:** brand WhatsApp green (#25D366) fails with white text; a darker
  `--whatsapp-700: #127A45` (5.39:1) is used.
- **Red is “trust”, not “error”:** shield-check icons use `--brand-red-600`; form errors use
  `--error-600: #B42318`.
- **Logo:** the client's official logo (supplied as a JPG with a blue frame) was extracted into
  transparent PNGs — full colour, a white version for dark backgrounds, the wordmark alone and
  the emblem alone (`public/brand/`). The white enclosed tick inside the shield is preserved so
  it stays visible on dark backgrounds. Favicons, app icons and OG images are generated from
  these files. The text-based `<BrandLogo>` fallback remains available
  (`brand.logoSource = 'svg-component'`). Vector originals are still recommended.
- **Brand colours match the logo:** `--brand-purple-700` is the logo purple **#52017F** and
  `--brand-red-600` the emblem red **#DC3940** (sampled from the artwork).
- **Third reference image not used:** the white “On” mark supplied alongside the logo is the
  registered trademark of On (the Swiss sportswear brand, on-running.com), not part of the
  OXYGEN EDU-HUB identity, so it is deliberately not used anywhere. Note that the “oxgn”
  wordmark’s slashed “ø” is stylistically very close to On’s logo — the client should confirm
  trademark clearance with a professional before investing further in the mark.
- **Imagery:** original SVG illustrations (diverse Indian students, parents and mentors in flat
  style) instead of stock photos — no licensing risk, no identifiable institutions. Listed in
  `public/images/CREDITS.md` with recommended replacements.
- **Article covers** are generated (gradient + category icon) so new articles never need an image.
- **“Most chosen” engagement badge** was deliberately not used: it would be an unverified claim.

### Contrast audit (WCAG 2.2 AA)

| Pair                          | Colours            | Ratio                                                        |
| ----------------------------- | ------------------ | ------------------------------------------------------------ |
| Body ink on white             | #17142B / #FFFFFF  | 17.93:1                                                      |
| Muted text on white           | #6B6880 / #FFFFFF  | 5.36:1                                                       |
| Muted text on surface         | #6B6880 / #F8F7FC  | 5.03:1                                                       |
| Purple-700 on white           | #52017F / #FFFFFF  | 12.58:1                                                      |
| Purple-500 links on white     | #6D28D9 / #FFFFFF  | 7.10:1                                                       |
| White on purple-700 (buttons) | #FFFFFF / #52017F  | 12.58:1                                                      |
| White on purple-900 (footer)  | #FFFFFF / #2A0A52  | 16.62:1                                                      |
| White 80% on purple-900       | ≈#D4CEDC / #2A0A52 | 10.81:1                                                      |
| Gold on purple-900 / navy     | #F4B915            | 9.34:1 / 8.26:1                                              |
| White on navy                 | #FFFFFF / #13245A  | 14.71:1                                                      |
| Error text on white           | #B42318 / #FFFFFF  | 6.57:1                                                       |
| Trust red (icons, non-text)   | #DC3940 / #FFFFFF  | 4.47:1                                                       |
| White on WhatsApp button      | #FFFFFF / #127A45  | 5.39:1                                                       |
| Purple-900 on gold button     | #2A0A52 / #F4B915  | 9.34:1                                                       |
| White on deep gradient end    | #FFFFFF / #A3166B  | 7.28:1                                                       |
| ⚠ White on violet-400         | #FFFFFF / #8B5CF6  | 4.23:1 — used only for icons and large (≥24px bold) initials |

## 4. Technical decisions

- **URLs:** canonical URLs use a **trailing slash** (`/about/`), matching how every static host
  serves `about/index.html`. Hosts redirect `/about` → `/about/` (301). Internal links always emit
  the trailing-slash form, so there are no redirect hops.
- **Prerendering:** every indexable route (incl. all four service pages and every article slug)
  is rendered to static HTML with per-route `<head>` (title, description, canonical, OG/Twitter,
  JSON-LD). The initial route chunk loads _before_ `hydrateRoot`, and anything that differs between
  build time and the browser (query strings, storage, dates) is read after hydration
  (`useHydrated`) — so hydration never mismatches. Playwright fails on any hydration warning.
- **Reveal animations:** server HTML is fully visible; hidden start states apply only after an
  inline script adds `.js` to `<html>`. That one-line script is allowed by a CSP `sha256` hash.
- **JSON-LD** is built at prerender time only (never shipped to the browser): Organization +
  EducationalOrganization and ProfessionalService (LocalBusiness) sitewide, WebSite on home,
  Service + FAQPage on service pages, FAQPage on /faq and home, Article on articles,
  BreadcrumbList on inner pages. Empty social links are omitted from `sameAs`.
- **Forms:** `submitForm(payload, formType)` posts JSON to Web3Forms or Formspree when configured;
  otherwise (or on error) returns a fallback with pre-filled `mailto:` and WhatsApp links. Spam
  protection: hidden honeypot (silently “succeeds” for bots), 3-second minimum time-to-submit,
  optional Turnstile. No personal data in URLs or logs; the thank-you URL only carries `?from=`.
- **Validation UX:** errors are _added_ on blur and _cleared while typing_. (Clearing on blur
  caused the layout to shift under the pointer, so a click on the next checkbox could miss —
  found by the E2E suite.)
- **Analytics** scripts are injected only after “Accept”; consent is stored in localStorage
  (try/catch, in-memory fallback).
- **404:** `dist/404.html` is prerendered; all three hosts serve it with status 404.
- **Security headers** (CSP, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options/
  frame-ancestors, HSTS) are in `vercel.json` and `public/_headers` (Netlify, Cloudflare Pages).
  `style-src 'unsafe-inline'` is needed for React `style` attributes (animation stagger values).
- **Styleguide** at `/styleguide` exists only in development builds.

## 5. Assumptions

- Market: India; Indian English; `en-IN`; `og:locale en_IN`; phone default +91.
- Pricing is not published (`features.showPricing = false`) — pages say “Pricing shared after consultation”.
- Study-abroad visa documentation guidance is offered but marked **Optional** (flag `showStudyAbroadVisa`).
- Psychometric assessment uses an unnamed “partner tool” (no vendor claims).
- Turnaround times on /how-we-work are placeholders to be confirmed.
- The refund policy uses common Indian service-business terms (24h for sessions, 48h for packages, 7–10 working days) — **must be confirmed by the client and their legal advisor**.

## 6. Known limitations

- **Lighthouse** could not be run in the build environment (not installed). Expected mobile
  scores are high (static HTML, ~70 KB CSS, small route chunks, SVG imagery, no layout-shifting
  animation), but run Lighthouse / PageSpeed Insights after deploying and record the results.
- **Initial JS** is ~385 KB uncompressed (~115 KB gzip): React DOM (~180 KB) plus Zod (used by the
  footer newsletter on every page). If Lighthouse flags it, lazy-load the newsletter form.
- **Fonts** load from Google Fonts (no `@fontsource`); the CSP allows those domains. To self-host,
  add the woff2 files to `/public/fonts` and replace the `<link>` in `scripts/lib/html.ts`.
- **AVIF/WebP:** no image toolchain was available; current images are SVG. Add AVIF/WebP variants
  when real photography is supplied (see HANDOVER.md).
- **OG images and favicons** were rendered without web fonts (system sans-serif fallback). Run
  `npm run og` on a machine with internet access to regenerate them with Sora/Inter.
- **Lint line numbers** refer to type-stripped output and can be off by a few lines.
