/**
 * Shared fixtures:
 *  - external fonts/analytics/maps are stubbed so tests are deterministic and offline-safe
 *  - every console error, page error and hydration warning is collected and asserted empty
 */
import { test as base, expect, type Page } from 'playwright/test';

export const CONFIGURED = 'http://localhost:4174';

export const ROUTES = [
  '/',
  '/about/',
  '/services/',
  '/services/admission-expert/',
  '/services/career-guidance/',
  '/services/research-innovations/',
  '/services/publication-services/',
  '/how-we-work/',
  '/why-choose-us/',
  '/testimonials/',
  '/resources/',
  '/resources/how-to-choose-the-right-course-after-12th/',
  '/resources/statement-of-purpose-checklist/',
  '/resources/how-to-spot-a-predatory-journal/',
  '/resources/beginners-guide-to-research-methodology/',
  '/faq/',
  '/contact/',
  '/book-consultation/',
  '/thank-you/',
  '/careers/',
  '/privacy-policy/',
  '/terms-and-conditions/',
  '/refund-cancellation-policy/',
  '/disclaimer/',
  '/sitemap/',
];

export async function stubExternal(page: Page): Promise<void> {
  await page.route(/fonts\.googleapis\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await page.route(/fonts\.gstatic\.com/, (r) => r.fulfill({ status: 204, body: '' }));
  await page.route(/googletagmanager\.com|google-analytics\.com|plausible\.io/, (r) =>
    r.fulfill({ status: 200, contentType: 'text/javascript', body: '/* analytics stub */' }),
  );
}

/** Waits until React has hydrated the prerendered page. */
export async function hydrated(page: Page): Promise<void> {
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
}

/** Dismisses the cookie banner so it doesn't cover controls. */
export async function dismissCookies(page: Page): Promise<void> {
  const reject = page.getByRole('button', { name: 'Reject non-essential' });
  if (await reject.isVisible().catch(() => false)) await reject.click();
}

export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on('console', (m) => {
        const t = m.text();
        if (m.type() === 'error' || (m.type() === 'warning' && /hydrat|did not match|Warning:/i.test(t)))
          errors.push(`[${m.type()}] ${t}`);
      });
      page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
      await stubExternal(page);
      await use(errors);
    },
    { auto: true },
  ],
});

export { expect };
