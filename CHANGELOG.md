# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses semantic versioning.

## [1.1.0] — 2026-11-09

### Changed

- Replaced the temporary text logo with the client's official logo (transparent PNGs in
  `public/brand/`), used in the header, footer, favicons, app icons and Open Graph images.
- Brand tokens aligned to the logo: purple-700 → #52017F, trust red → #DC3940.

## [1.0.0] — 2026-11-09

### Added

- Complete corporate website for OXYGEN EDU-HUB with 25 prerendered pages: home (12 sections),
  about, services overview, four service detail pages, how we work, why choose us, testimonials,
  resources + four articles, FAQ (23 questions), contact, multi-step consultation booking,
  thank-you, careers, privacy, terms, refund & cancellation, disclaimer, HTML sitemap and a custom 404.
- Global shell: top bar, sticky header with services mega-menu, mobile drawer, footer with
  newsletter, floating WhatsApp button with page-aware messages, sticky mobile CTA bar,
  back-to-top, cookie consent, breadcrumbs, skip link, route announcer.
- Forms: consultation (3 steps + review, draft persistence, `?service=` pre-selection), contact,
  quick enquiry (service sidebar + global “Enquire now” modal), newsletter. Web3Forms/Formspree
  support with email/WhatsApp fallback, honeypot, time-to-submit check, optional Turnstile.
- SEO: per-route meta, canonical, Open Graph/Twitter, JSON-LD, sitemap.xml, robots.txt,
  OG images, favicon set and web manifest.
- Design system: brand tokens, fluid type scale, in-house icons and accessible UI primitives,
  dev-only `/styleguide`.
- Tooling: esbuild build/dev/preview, Tailwind v4 core compiler, ESLint with in-house a11y rules,
  Prettier, 58 unit tests, Playwright E2E (desktop + mobile), placeholder audit, OG generator,
  Vercel/Netlify/Cloudflare configs with security headers, GitHub Actions CI.
- Documentation: README, CONTENT_GUIDE, DECISIONS, HANDOVER.
