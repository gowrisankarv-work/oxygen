import { test, expect, hydrated, dismissCookies, CONFIGURED } from './fixtures';

const isMobile = () => test.info().project.name.startsWith('mobile');

test.describe('navigation', () => {
  test('mega-menu reaches all four service pages (desktop)', async ({ page }) => {
    test.skip(isMobile(), 'desktop only');
    const services = ['Admission Expert', 'Career Guidance', 'Research & Innovations', 'Publication Services'];
    for (const name of services) {
      await page.goto('/');
      await hydrated(page);
      await dismissCookies(page);
      const trigger = page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Services' });
      await trigger.click();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await page
        .getByRole('navigation', { name: 'Main' })
        .getByRole('link', { name: new RegExp(`^${name.replace('&', '\\&')}`) })
        .click();
      await expect(page.locator('h1')).toHaveText(name);
      await expect(page).toHaveURL(/\/services\/[a-z-]+\/$/);
    }
  });

  test('mega-menu is keyboard operable and closes on Escape', async ({ page }) => {
    test.skip(isMobile(), 'desktop only');
    await page.goto('/about/');
    await hydrated(page);
    const trigger = page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Services' });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  });

  test('client-side navigation updates title, focus and announces the page', async ({ page }) => {
    test.skip(isMobile(), 'desktop only');
    await page.goto('/');
    await hydrated(page);
    await dismissCookies(page);
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'How We Work' }).click();
    await expect(page).toHaveTitle('How We Work — Our Approach | OXYGEN EDU-HUB');
    await expect(page.locator('#main-content')).toBeFocused();
    await expect(page.getByTestId('route-announcer')).toHaveText(/How We Work/);
    await page.goBack();
    await expect(page.locator('h1')).toContainText('Fuel for Your');
  });

  test('mobile drawer opens, traps focus, closes with Escape and returns focus', async ({ page }) => {
    test.skip(!isMobile(), 'mobile only');
    await page.goto('/');
    await hydrated(page);
    await dismissCookies(page);
    const burger = page.getByRole('button', { name: 'Open menu' });
    await burger.click();
    const dialog = page.getByRole('dialog', { name: 'Menu' });
    await expect(dialog).toBeVisible();
    // Background is inert while the modal dialog is open
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog')))).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('hidden');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(burger).toBeFocused();
    // Navigate via the drawer's services accordion
    await burger.click();
    await dialog.getByText('Services', { exact: true }).click();
    await dialog.getByRole('link', { name: 'Career Guidance' }).click();
    await expect(page.locator('h1')).toHaveText('Career Guidance');
    await expect(dialog).toBeHidden();
  });

  test('mobile sticky CTA bar is shown on small screens', async ({ page }) => {
    test.skip(!isMobile(), 'mobile only');
    await page.goto('/about/');
    const bar = page.getByRole('navigation', { name: 'Quick actions' });
    await expect(bar).toBeVisible();
    await expect(bar.getByRole('link', { name: 'Book Consultation' })).toHaveAttribute('href', '/book-consultation/');
  });
});

test.describe('widgets', () => {
  test('WhatsApp links use the configured number and page-aware encoded text', async ({ page }) => {
    await page.goto('/services/publication-services/');
    await hydrated(page);
    const href = isMobile()
      ? await page
          .getByRole('navigation', { name: 'Quick actions' })
          .getByRole('link', { name: 'WhatsApp' })
          .getAttribute('href')
      : await page.getByTestId('whatsapp-float').getAttribute('href');
    expect(href).toBe(
      `https://wa.me/919876543210?text=${encodeURIComponent("Hi Oxygen Edu-Hub, I'd like to know more about Publication Services.")}`,
    );
  });

  test('cookie banner appears; analytics loads only after consent', async ({ page }) => {
    await page.goto(`${CONFIGURED}/`);
    await hydrated(page);
    await expect(page.getByTestId('cookie-banner')).toBeVisible();
    expect(await page.locator('script[data-analytics]').count()).toBe(0);
    expect(await page.evaluate(() => typeof window.gtag)).toBe('undefined');
    await page.getByRole('button', { name: 'Accept' }).click();
    await expect(page.getByTestId('cookie-banner')).toBeHidden();
    await expect(page.locator('script[data-analytics="ga4"]')).toHaveCount(1);
    // Choice persists across reloads
    await page.reload();
    await hydrated(page);
    await expect(page.getByTestId('cookie-banner')).toBeHidden();
  });

  test('rejecting cookies keeps analytics unloaded', async ({ page }) => {
    await page.goto(`${CONFIGURED}/faq/`);
    await hydrated(page);
    await page.getByRole('button', { name: 'Reject non-essential' }).click();
    await page.reload();
    await hydrated(page);
    expect(await page.locator('script[data-analytics]').count()).toBe(0);
  });

  test('FAQ search filters results', async ({ page }) => {
    await page.goto('/faq/');
    await hydrated(page);
    await dismissCookies(page);
    const total = await page.locator('#main-content details').count();
    expect(total).toBeGreaterThanOrEqual(20);
    await expect(page.getByTestId('faq-count')).toContainText(`${total} questions`);
    await page.getByLabel('Search FAQs').fill('refund');
    await expect(page.getByTestId('faq-count')).toContainText('match');
    const count = await page.locator('#main-content details').count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(total);
    await page.getByLabel('Search FAQs').fill('zzzzqq');
    await expect(page.getByText('No questions match your search')).toBeVisible();
  });

  test('accordion opens one item at a time on the home FAQ', async ({ page }) => {
    await page.goto('/');
    await hydrated(page);
    await dismissCookies(page);
    const items = page.locator('details[id^="faq-"]');
    await items.nth(0).locator('summary').click();
    await expect(items.nth(0)).toHaveAttribute('open', '');
    await items.nth(1).locator('summary').click();
    await expect(items.nth(1)).toHaveAttribute('open', '');
    await expect(items.nth(0)).not.toHaveAttribute('open', '');
  });

  test('tabs support arrow keys, Home and End', async ({ page }) => {
    await page.goto('/');
    await hydrated(page);
    await dismissCookies(page);
    const list = page.getByRole('tablist', { name: 'Who we help' });
    await list.getByRole('tab', { name: 'Students' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(list.getByRole('tab', { name: 'Parents' })).toHaveAttribute('aria-selected', 'true');
    await expect(list.getByRole('tab', { name: 'Parents' })).toBeFocused();
    await page.keyboard.press('End');
    await expect(list.getByRole('tab', { name: 'Faculty & Researchers' })).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Home');
    await expect(list.getByRole('tab', { name: 'Students' })).toHaveAttribute('aria-selected', 'true');
    await expect(
      page.getByRole('tabpanel').filter({ visible: true }).getByRole('heading', { name: 'Students' }),
    ).toBeVisible();
  });

  test('testimonial carousel has pause control and labelled slides', async ({ page }) => {
    await page.goto('/');
    await hydrated(page);
    const carousel = page.getByRole('region', { name: 'Testimonials' });
    await expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
    await expect(carousel.getByRole('group', { name: '1 of 8' })).toBeAttached();
    await expect(carousel.getByText('Sample testimonial').first()).toBeAttached();
    await expect(
      carousel.getByRole('button', { name: /Pause automatic slide show|Play automatic slide show/ }),
    ).toBeVisible();
    await carousel.getByRole('button', { name: 'Go to slide 3' }).click();
    await expect(carousel.getByRole('button', { name: 'Go to slide 3' })).toHaveAttribute('aria-current', 'true');
  });

  test('stats strip is hidden by default', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('stats-strip')).toHaveCount(0);
  });

  test('legal pages show the template review banner', async ({ page }) => {
    await page.goto('/privacy-policy/');
    await expect(page.getByTestId('legal-review-banner')).toContainText('to be reviewed by the client');
  });

  test('enquiry modal opens from data-enquire triggers with the service pre-selected', async ({ page }) => {
    await page.goto('/services/');
    await hydrated(page);
    await dismissCookies(page);
    await page.locator('[data-enquire][data-service="career-guidance"]').click();
    const dialog = page.getByRole('dialog', { name: 'Enquire about Career Guidance' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel('Service')).toHaveValue('career-guidance');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
});
