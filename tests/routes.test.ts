import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { routes } from '../src/router/routes';
import { expandRoutes, matchRoute, normalizePath, toHref } from '../src/router/paths';
import { articles } from '../src/content/articles';
import { services } from '../src/content/services';
import { resolveSeo, formatTitle, serializeJsonLd } from '../src/lib/seo';
import { buildRouteSchema } from '../src/lib/route-schema';
import { buildBreadcrumbs } from '../src/lib/breadcrumbs';
import { faqPageSchema, organizationSchema } from '../src/lib/schema';

const REQUIRED = [
  '/',
  '/about',
  '/services',
  '/services/admission-expert',
  '/services/career-guidance',
  '/services/research-innovations',
  '/services/publication-services',
  '/how-we-work',
  '/why-choose-us',
  '/testimonials',
  '/resources',
  '/faq',
  '/contact',
  '/book-consultation',
  '/thank-you',
  '/careers',
  '/privacy-policy',
  '/terms-and-conditions',
  '/refund-cancellation-policy',
  '/disclaimer',
  '/sitemap',
];

describe('route table integrity', () => {
  it('has unique ids and paths', () => {
    assert.equal(new Set(routes.map((r) => r.id)).size, routes.length);
    assert.equal(new Set(routes.map((r) => r.path)).size, routes.length);
  });
  it('contains every required route and a 404', () => {
    const paths = expandRoutes(routes).map((e) => e.path);
    for (const p of REQUIRED) assert.ok(paths.includes(p), `missing ${p}`);
    assert.ok(routes.some((r) => r.path === '*'));
  });
  it('prerenders every article slug and service', () => {
    const paths = expandRoutes(routes)
      .filter((e) => e.route.prerender)
      .map((e) => e.path);
    for (const a of articles) assert.ok(paths.includes(`/resources/${a.slug}`));
    for (const s of services) assert.ok(paths.includes(`/services/${s.slug}`));
  });
  it('every route has a title and a 150–160 character description', () => {
    for (const e of expandRoutes(routes)) {
      const m = e.route.meta(e.params);
      assert.ok(m.title.length > 2, `${e.path} title`);
      const len = m.description.length;
      assert.ok(len >= 150 && len <= 160, `${e.path} description is ${len} chars`);
    }
  });
  it('titles are unique across indexable pages', () => {
    const titles = expandRoutes(routes)
      .filter((e) => !e.route.meta(e.params).noindex)
      .map((e) => e.route.meta(e.params).title);
    assert.equal(new Set(titles).size, titles.length);
  });
  it('excludes thank-you and dev-only routes from the production sitemap', () => {
    const thanks = routes.find((r) => r.id === 'thank-you');
    assert.equal(thanks?.sitemap, false);
    assert.equal(thanks?.meta({}).noindex, true);
    const sg = routes.find((r) => r.id === 'styleguide');
    if (sg) assert.equal(sg.sitemap, false);
  });
});

describe('matching & URLs', () => {
  it('matches static and dynamic routes, unknown slugs → 404', () => {
    assert.equal(matchRoute(routes, '/about/').route.id, 'about');
    assert.equal(matchRoute(routes, '/services/career-guidance').params.slug, 'career-guidance');
    assert.equal(matchRoute(routes, '/services/unknown').route.path, '*');
    assert.equal(matchRoute(routes, '/nope').route.path, '*');
  });
  it('normalises paths and uses trailing-slash hrefs', () => {
    assert.equal(normalizePath('/About//'), '/about');
    assert.equal(toHref('/faq#fees'), '/faq/#fees');
    assert.equal(toHref('/book-consultation?service=x'), '/book-consultation/?service=x');
    assert.equal(toHref('/'), '/');
    assert.equal(toHref('https://x.com'), 'https://x.com');
  });
});

describe('SEO + schema builders', () => {
  it('applies the title template', () => {
    assert.equal(formatTitle('About Us'), 'About Us | OXYGEN EDU-HUB');
  });
  it('resolves canonical URLs with trailing slashes and noindex for 404', () => {
    const seo = resolveSeo(matchRoute(routes, '/about'), '/about');
    assert.ok(seo.canonical.endsWith('/about/'));
    assert.equal(seo.noindex, false);
    assert.equal(resolveSeo(matchRoute(routes, '/missing'), '/missing').noindex, true);
  });
  it('emits the right JSON-LD per route', () => {
    const types = (p: string) => buildRouteSchema(matchRoute(routes, p), p).map((b) => JSON.stringify(b['@type']));
    assert.ok(types('/').includes('"WebSite"'));
    assert.ok(types('/services/publication-services').includes('"Service"'));
    assert.ok(types('/services/publication-services').includes('"FAQPage"'));
    assert.ok(types('/faq').includes('"FAQPage"'));
    assert.ok(types('/about').includes('"BreadcrumbList"'));
    assert.ok(types(`/resources/${articles[0]!.slug}`).includes('"Article"'));
    assert.ok(types('/contact').includes('"ProfessionalService"'));
  });
  it('omits empty social links from sameAs', () => {
    const org = organizationSchema();
    assert.ok(!('sameAs' in org) || (org.sameAs as string[]).every((u) => u.length > 0));
  });
  it('builds FAQPage and breadcrumbs correctly', () => {
    const faq = faqPageSchema([{ q: 'Q?', a: 'A.' }]);
    assert.deepEqual((faq.mainEntity as { name: string }[])[0]!.name, 'Q?');
    const crumbs = buildBreadcrumbs(routes, '/services/publication-services');
    assert.deepEqual(
      crumbs.map((c) => c.label),
      ['Home', 'Services', 'Publication Services'],
    );
  });
  it('escapes "<" in serialised JSON-LD', () => {
    assert.ok(!serializeJsonLd({ a: '</script>' }).includes('</script>'));
  });
});
