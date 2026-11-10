/**
 * Component render checks via renderToString (no DOM needed).
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderToString } from 'react-dom/server';
import { App } from '../src/app/App';
import { routes } from '../src/router/routes';
import { expandRoutes } from '../src/router/paths';
import { loadRoute } from '../src/router/router';
import { siteConfig } from '../src/config/site.config';
import { StatsStrip } from '../src/components/sections/SharedSections';
import { TestimonialCard } from '../src/components/sections/TestimonialSections';
import { testimonials } from '../src/content/testimonials';
import { extractCandidates } from '../scripts/tailwind';

async function render(path: string): Promise<string> {
  for (const r of routes) await loadRoute(r);
  return renderToString(<App url={path} />);
}

describe('page rendering', () => {
  it('every page renders exactly one <h1>', async () => {
    for (const { path } of expandRoutes(routes).filter((e) => e.route.prerender)) {
      const html = await render(path);
      const count = (html.match(/<h1[\s>]/g) ?? []).length;
      assert.equal(count, 1, `${path} has ${count} h1`);
    }
    const nf = await render('/does-not-exist');
    assert.equal((nf.match(/<h1[\s>]/g) ?? []).length, 1);
  });
  it('contains no lorem ipsum', async () => {
    for (const { path } of expandRoutes(routes)) {
      assert.ok(!/lorem ipsum/i.test(await render(path)), path);
    }
  });
  it('shows ethics / no-guarantee messaging on services, why-choose-us and disclaimer', async () => {
    for (const p of ['/services/admission-expert', '/services/publication-services', '/why-choose-us', '/disclaimer']) {
      assert.match(await render(p), /guarantee/i, p);
    }
    assert.match(await render('/services/publication-services'), /Our Publication Ethics/);
  });
  it('shows the legal review banner while legalReviewed is false', async () => {
    assert.equal(siteConfig.legal.legalReviewed, false);
    assert.match(await render('/privacy-policy'), /to be reviewed by the client/);
  });
});

describe('feature flags & sample labels', () => {
  it('hides the stats strip by default', () => {
    assert.equal(siteConfig.features.showStats, false);
    assert.equal(renderToString(<StatsStrip />), '');
  });
  it('renders the stats strip when forced, with a sample label in dev builds', () => {
    const html = renderToString(<StatsStrip force />);
    assert.match(html, /data-testid="stats-strip"/);
    assert.match(html, /Sample figures/);
  });
  it('labels sample testimonials', () => {
    const t = testimonials[0]!;
    assert.match(renderToString(<TestimonialCard t={{ ...t, isSample: true }} />), /Sample testimonial/);
    assert.doesNotMatch(renderToString(<TestimonialCard t={{ ...t, isSample: false }} />), /Sample testimonial/);
  });
  it('home page renders sample-labelled testimonials and no stats strip', async () => {
    const html = await render('/');
    assert.match(html, /Sample testimonial/);
    assert.doesNotMatch(html, /data-testid="stats-strip"/);
  });
});

describe('tailwind candidate extractor', () => {
  it('finds variants, arbitrary values and opacity modifiers', () => {
    const c = extractCandidates(
      `<div className="lg:grid-cols-[1.08fr_0.92fr] hover:bg-purple-500/40 pt-[calc(var(--header-h)+2rem)] motion-safe:animate-blob">`,
    );
    for (const x of [
      'lg:grid-cols-[1.08fr_0.92fr]',
      'hover:bg-purple-500/40',
      'pt-[calc(var(--header-h)+2rem)]',
      'motion-safe:animate-blob',
    ]) {
      assert.ok(c.has(x), x);
    }
  });
});
