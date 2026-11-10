# OXYGEN EDU-HUB — corporate website

Production-ready, prerendered marketing website for **OXYGEN EDU-HUB** (Admission Expert ·
Career Guidance · Research & Innovations · Publication Services).

- React 19 + TypeScript (strict), bundled with **esbuild**
- **Tailwind CSS v4** compiled through its core `compile()` API
- A small in-house router with **static prerendering of every route** (incl. every article)
- Accessible in-house UI primitives (native `<dialog>`, `<details>`, WAI-ARIA tabs, carousel)
- Zod-validated forms using React 19 actions, with Web3Forms / Formspree or an email/WhatsApp fallback
- JSON-LD, sitemap.xml, robots.txt, OG images, favicons — all generated
- 58 unit tests (`node:test`) + 108 Playwright end-to-end checks (desktop + mobile)

> Why no Vite / React Router / Radix / Motion? This project was built in an environment where
> package installation was impossible. Everything those packages would have provided is built
> in-house with the installed tools. See **DECISIONS.md** for details and how to migrate later.

---

## 1. Setup

Requirements: **Node 20+** and npm.

```bash
npm install
cp .env.example .env      # then edit values (see §3)
npm run dev               # http://localhost:5173
```

The first time you run end-to-end tests on a new machine, install Playwright's browser:

```bash
npx playwright install chromium
```

## 2. Scripts

| Command                           | What it does                                                                                                     |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                     | Dev server with live reload (client-rendered, SPA fallback). Tailwind recompiles on save.                        |
| `npm run build`                   | Production build → `dist/` (CSS, hashed JS chunks, prerendered HTML for every route, sitemap, robots, manifest). |
| `npm run preview`                 | Serves `dist/` at http://localhost:4173 exactly like a static host (trailing slashes, 404 page).                 |
| `npm run typecheck`               | `tsc --noEmit` for the app and for scripts/tests.                                                                |
| `npm run lint`                    | ESLint (core rules + in-house accessibility/security rules).                                                     |
| `npm run format` / `format:check` | Prettier.                                                                                                        |
| `npm run test`                    | Unit & render tests (`node:test`).                                                                               |
| `npm run test:e2e`                | Playwright: builds two variants and runs all E2E, accessibility, SEO, link and hydration checks.                 |
| `npm run check:placeholders`      | Lists every sample/placeholder value still to be replaced (`--strict` exits 1 if any remain).                    |
| `npm run og`                      | Regenerates OG images + favicon set from `public/brand/emblem.svg`.                                              |
| `npm run analyze`                 | Build + bundle size report in `dist-stats/` (metafile viewable at esbuild.github.io/analyze).                    |
| `npm run verify`                  | Everything above in sequence (what CI runs).                                                                     |

## 3. Environment variables

All variables are **public** (embedded in the site). See `.env.example`.

| Variable                                | Purpose                                                                                                   |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `VITE_SITE_URL`                         | Production URL without trailing slash — canonical URLs, sitemap, OG tags. **Set this before going live.** |
| `VITE_FORM_PROVIDER`                    | `web3forms`, `formspree` or `mailto`. Auto-detected if empty.                                             |
| `VITE_FORM_ENDPOINT`                    | Formspree form URL (or a custom Web3Forms endpoint).                                                      |
| `VITE_FORM_ACCESS_KEY`                  | Web3Forms access key.                                                                                     |
| `VITE_TURNSTILE_SITE_KEY`               | Optional Cloudflare Turnstile site key (spam protection).                                                 |
| `VITE_GA4_ID` / `VITE_PLAUSIBLE_DOMAIN` | Optional analytics, loaded **only after cookie consent**.                                                 |

Without a form provider, every form still works: after validation the visitor gets one-tap
“Send via Email” and “Send via WhatsApp” buttons pre-filled with their enquiry.

## 4. Customisation

Everything you are likely to change lives in two places — **no company data is hard-coded in components**:

- `src/config/site.config.ts` — company details, contact, hours, socials, SEO defaults, feature flags, legal dates
- `src/content/*` — services, FAQs, testimonials, team, stats, values, process, articles, legal text, navigation
- `src/config/images.ts` — every image path, size and alt text
- `src/styles/app.css` — colour tokens, type scale, motion

**CONTENT_GUIDE.md** explains, in plain language, which file and field to edit for each change.
**HANDOVER.md** lists what the client must supply before launch.

### Project structure

```
public/            brand files, images, og images, favicons, _headers, _redirects
scripts/           build, dev, preview, tailwind, sitemap, lint, test, check-placeholders, generate-og
src/
  app/             App + Layout (global shell)
  router/          route table, router, path helpers
  components/
    ui/            Button, Card, Badge, Field, Accordion, Tabs, Dialog, Carousel, Toast, Reveal…
    layout/        TopBar, Header, MegaMenu, MobileNav, Footer, Breadcrumbs, PageHero, Floating, CookieBanner, BrandLogo
    sections/      Hero, service sections, shared sections, testimonials, articles, rich text
    forms/         ConsultationForm, ContactForm, QuickEnquiry, NewsletterForm, EnquiryModal
    icons/         in-house icon set
  config/ content/ lib/ hooks/ styles/ pages/
  entry-client.tsx entry-server.tsx
tests/             unit + render tests (node:test)
e2e/               Playwright specs
types/             minimal React type declarations (see DECISIONS.md)
```

## 5. Deployment

The build output (`dist/`) is fully static and deploys unchanged to **Vercel**, **Netlify** or
**Cloudflare Pages**. Security headers, caching and trailing-slash behaviour are pre-configured
(`vercel.json`, `netlify.toml`, `public/_headers`, `public/_redirects`).

1. Push the project to a Git repository (GitHub/GitLab/Bitbucket).
2. Import it in your host:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Node version:** 20
3. Add the environment variables from §3 (at minimum `VITE_SITE_URL` and your form provider key).
4. Deploy, then add your **custom domain** and enable **HTTPS** (automatic on all three hosts).
5. In **Google Search Console**, verify the domain and submit `https://your-domain/sitemap.xml`.
6. Optional: the included GitHub Actions workflow (`.github/workflows/ci.yml`) runs typecheck,
   lint, format check, unit tests, build and E2E tests on every push and pull request.

**Content Security Policy:** if you add a new third-party service (chat widget, video embed…),
add its domain to the CSP in **both** `vercel.json` and `public/_headers`. If you change the
one-line inline script in `scripts/lib/html.ts`, update its `sha256` hash in both files
(`npm run test` checks this).

## 6. Quality checks

- **Lighthouse:** run it in Chrome DevTools against `npm run preview` (mobile, incognito) or with
  PageSpeed Insights after deploying. Lighthouse is not part of the automated suite (not installed).
- **Accessibility:** Playwright checks every route for one H1, heading order, `lang`, labelled
  controls, named buttons/links, image alt text, `noopener` on new-tab links, no horizontal
  scroll, keyboard behaviour of menus/tabs/accordions/dialogs. Before launch, also do a manual
  pass with the axe DevTools browser extension and a screen reader (NVDA/VoiceOver).
- **Placeholders:** `npm run check:placeholders -- --strict` must pass before launch.
