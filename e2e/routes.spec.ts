import { test, expect, ROUTES, hydrated } from './fixtures';

test.describe('every route', () => {
  for (const path of ROUTES) {
    test(`${path} renders, hydrates cleanly and passes basic a11y checks`, async ({ page, consoleErrors }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await hydrated(page);

      // One H1 and a correct, unique-style title
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page).toHaveTitle(/OXYGEN EDU-HUB/);

      // Document language and landmarks
      expect(await page.getAttribute('html', 'lang')).toBe('en-IN');
      await expect(page.locator('main#main-content')).toHaveCount(1);
      await expect(page.locator('header').first()).toBeAttached();
      await expect(page.locator('footer')).toBeAttached();

      // A11y: images have alt, form controls are labelled, buttons/links have accessible names
      const issues = await page.evaluate(() => {
        const problems: string[] = [];
        const visible = (el: Element) => !(el as HTMLElement).closest('[aria-hidden="true"]');
        document.querySelectorAll('img').forEach((img) => {
          if (!img.hasAttribute('alt')) problems.push(`img without alt: ${img.getAttribute('src')}`);
        });
        document.querySelectorAll('input:not([type="hidden"]), select, textarea').forEach((el) => {
          if (!visible(el)) return;
          const id = el.getAttribute('id');
          const labelled =
            (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) ||
            el.closest('label') ||
            el.getAttribute('aria-label') ||
            el.getAttribute('aria-labelledby');
          if (!labelled) problems.push(`unlabelled control: ${el.outerHTML.slice(0, 80)}`);
        });
        document.querySelectorAll('button, a[href]').forEach((el) => {
          if (!visible(el)) return;
          const name = (el.getAttribute('aria-label') || el.textContent || '').trim();
          if (!name) problems.push(`unnamed ${el.tagName.toLowerCase()}: ${el.outerHTML.slice(0, 80)}`);
        });
        document.querySelectorAll('a[target="_blank"]').forEach((a) => {
          if (!(a.getAttribute('rel') || '').includes('noopener'))
            problems.push(`target=_blank without noopener: ${a.getAttribute('href')}`);
        });
        // Heading order: no skipped levels (h2 → h4)
        let last = 1;
        document.querySelectorAll('main h1, main h2, main h3, main h4').forEach((h) => {
          const level = Number(h.tagName[1]);
          if (level > last + 1) problems.push(`heading jump h${last}→h${level}: ${h.textContent?.slice(0, 40)}`);
          last = level;
        });
        return problems;
      });
      expect(issues, issues.join('\n')).toEqual([]);

      // No horizontal scroll
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);

      expect(consoleErrors, consoleErrors.join('\n')).toEqual([]);
    });
  }

  test('unknown URL shows the custom 404 with status 404', async ({ page }) => {
    const res = await page.goto('/this-page-does-not-exist/');
    expect(res?.status()).toBe(404);
    await hydrated(page);
    await expect(page.locator('h1')).toHaveText(/couldn’t find that page/);
    await expect(page.getByRole('link', { name: 'Back to home' })).toBeVisible();
  });

  test('unknown service slug resolves to the 404 page', async ({ page }) => {
    const res = await page.goto('/services/not-a-service/');
    expect(res?.status()).toBe(404);
  });
});

test.describe('SEO', () => {
  test('key routes have unique meta, canonical, OG tags and valid JSON-LD', async ({ page }) => {
    const seen = new Set<string>();
    for (const path of [
      '/',
      '/about/',
      '/services/publication-services/',
      '/faq/',
      '/resources/how-to-spot-a-predatory-journal/',
    ]) {
      await page.goto(path);
      const title = await page.title();
      expect(seen.has(title)).toBe(false);
      seen.add(title);
      const desc = await page.getAttribute('meta[name="description"]', 'content');
      expect(desc?.length).toBeGreaterThanOrEqual(150);
      expect(desc?.length).toBeLessThanOrEqual(160);
      expect(await page.getAttribute('link[rel="canonical"]', 'href')).toMatch(
        new RegExp(`${path.replace(/\//g, '\\/')}$`),
      );
      expect(await page.getAttribute('meta[property="og:locale"]', 'content')).toBe('en_IN');
      expect(await page.getAttribute('meta[property="og:image"]', 'content')).toMatch(/\/og\/.+\.jpg$/);
      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(blocks.length).toBeGreaterThan(1);
      const types = blocks.map((b) => JSON.parse(b) as { '@type': string | string[] }).flatMap((b) => b['@type']);
      expect(types).toContain('EducationalOrganization');
      if (path === '/') expect(types).toContain('WebSite');
      if (path.startsWith('/services/'))
        expect(types).toEqual(expect.arrayContaining(['Service', 'FAQPage', 'BreadcrumbList']));
      if (path === '/faq/') expect(types).toContain('FAQPage');
      if (path.startsWith('/resources/')) expect(types).toContain('Article');
    }
  });

  test('thank-you page is noindex; sitemap.xml and robots.txt exist', async ({ page, request }) => {
    await page.goto('/thank-you/');
    expect(await page.getAttribute('meta[name="robots"]', 'content')).toContain('noindex');
    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).toContain('/services/publication-services/');
    expect(sitemap).toContain('/resources/how-to-spot-a-predatory-journal/');
    expect(sitemap).not.toContain('/thank-you/');
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/);
    for (const f of [
      '/favicon.ico',
      '/favicon.svg',
      '/apple-touch-icon.png',
      '/icon-192.png',
      '/icon-512.png',
      '/site.webmanifest',
      '/og/default.jpg',
    ]) {
      expect((await request.get(f)).status(), f).toBe(200);
    }
  });
});

test.describe('links', () => {
  test('every internal link on every page resolves', async ({ page, request }) => {
    test.skip(test.info().project.name !== 'desktop-chromium', 'run once');
    const hrefs = new Set<string>();
    for (const path of ROUTES) {
      await page.goto(path);
      const links = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href') ?? ''));
      for (const h of links) if (h.startsWith('/') && !h.startsWith('//')) hrefs.add(h.split('#')[0]!);
    }
    const broken: string[] = [];
    for (const h of hrefs) {
      const res = await request.get(h, { maxRedirects: 0 });
      if (res.status() !== 200) broken.push(`${h} → ${res.status()}`);
    }
    expect(broken, broken.join('\n')).toEqual([]);
    expect(hrefs.size).toBeGreaterThan(25);
  });
});
