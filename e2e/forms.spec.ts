import type { Page, Route } from 'playwright/test';
import { test, expect, hydrated, dismissCookies, CONFIGURED } from './fixtures';

/** Intercepts the form provider so nothing leaves the machine; captures the payload. */
async function mockProvider(page: Page, ok = true): Promise<{ bodies: Record<string, unknown>[] }> {
  const captured = { bodies: [] as Record<string, unknown>[] };
  await page.route('https://api.web3forms.com/submit', async (route: Route) => {
    captured.bodies.push(JSON.parse(route.request().postData() ?? '{}') as Record<string, unknown>);
    await route.fulfill({
      status: ok ? 200 : 500,
      contentType: 'application/json',
      body: JSON.stringify({ success: ok }),
      headers: { 'access-control-allow-origin': '*' },
    });
  });
  return captured;
}

const cf = (page: Page) => page.locator('#consultation-form');

async function fillStep1(page: Page) {
  await cf(page).getByLabel('Full name').fill('Asha Kumar');
  await cf(page)
    .getByLabel(/^Email/)
    .fill('asha@example.com');
  await cf(page).getByLabel('City').fill('Chennai');
  await cf(page).getByLabel('Phone number').fill('9876543210');
  await cf(page).getByRole('radio', { name: 'Student' }).check();
}

async function fillStep2(page: Page) {
  await cf(page).getByLabel('Current education level').selectOption('class-11-12');
  await cf(page).getByLabel('Timeline').selectOption('1-3-months');
  await cf(page)
    .getByLabel(/Target course/)
    .fill('B.Sc. Physics');
}

async function fillStep3(page: Page) {
  await page.getByRole('radio', { name: 'WhatsApp' }).check();
  await page.getByLabel('Preferred time slot').selectOption('evening');
  await cf(page)
    .getByRole('checkbox', { name: /I agree to the/ })
    .check();
}

test.describe('consultation form', () => {
  test('validates each step, keeps data between steps and shows a review screen', async ({ page }) => {
    await page.goto('/book-consultation/');
    await hydrated(page);
    await dismissCookies(page);

    // Empty step 1 → inline errors, focus on first invalid field
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Please enter your full name.')).toBeVisible();
    await expect(page.getByLabel('Full name')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByLabel('Full name')).toBeFocused();

    await fillStep1(page);
    await page.getByLabel('Phone number').fill('12345');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText(/valid phone number/)).toBeVisible();
    await page.getByLabel('Phone number').fill('9876543210');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 2: service required
    await expect(page.getByRole('heading', { name: 'What do you need help with?' })).toBeVisible();
    await fillStep2(page);
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText(/choose at least one service/)).toBeVisible();
    await page.getByRole('checkbox', { name: 'Admission Expert' }).check();

    // Back to step 1 keeps data
    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByLabel('Full name')).toHaveValue('Asha Kumar');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('checkbox', { name: 'Admission Expert' })).toBeChecked();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 3: consent required
    await page.getByRole('radio', { name: 'WhatsApp' }).check();
    await page.getByLabel('Preferred time slot').selectOption('evening');
    await page.getByRole('button', { name: 'Review details' }).click();
    await expect(page.getByText('Please agree to the Privacy Policy so we can respond to you.')).toBeVisible();
    await cf(page)
      .getByRole('checkbox', { name: /I agree to the/ })
      .check();
    await page.getByRole('button', { name: 'Review details' }).click();

    const review = page.getByTestId('consultation-review');
    await expect(review).toContainText('Asha Kumar');
    await expect(review).toContainText('+91 9876543210');
    await expect(review).toContainText('Admission Expert');
    await expect(review).toContainText('Evening');

    // Draft survives a reload (sessionStorage)
    await page.reload();
    await hydrated(page);
    await expect(page.getByLabel('Full name')).toHaveValue('Asha Kumar');
  });

  test('?service= pre-selects the service', async ({ page }) => {
    await page.goto('/book-consultation/?service=publication-services');
    await hydrated(page);
    await dismissCookies(page);
    await expect(page.getByTestId('preselected-service')).toContainText('Publication Services');
    await fillStep1(page);
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('checkbox', { name: 'Publication Services' })).toBeChecked();
  });

  test('submits to the (mocked) provider and redirects to thank-you', async ({ page }) => {
    const captured = await mockProvider(page);
    await page.goto(`${CONFIGURED}/book-consultation/?service=career-guidance`);
    await hydrated(page);
    await dismissCookies(page);
    await fillStep1(page);
    await page.getByRole('button', { name: 'Continue' }).click();
    await fillStep2(page);
    await page.getByRole('button', { name: 'Continue' }).click();
    await fillStep3(page);
    await page.getByRole('button', { name: 'Review details' }).click();
    await page.waitForTimeout(3200); // minimum time-to-submit bot check
    await page.getByRole('button', { name: /Confirm & book consultation/ }).click();
    await expect(page).toHaveURL(/\/thank-you\/\?from=consultation$/);
    await expect(page.locator('h1')).toHaveText('Your consultation request is in');
    expect(captured.bodies).toHaveLength(1);
    const body = captured.bodies[0]!;
    expect(body.access_key).toBe('e2e-test-access-key');
    expect(body.fullName).toBe('Asha Kumar');
    expect(body.services).toBe('Career Guidance');
    expect(body.consent).toBeUndefined();
    expect(body.company_website).toBeUndefined();
    // No personal data in the URL
    expect(page.url()).not.toContain('Asha');
  });

  test('falls back to email / WhatsApp when no provider is configured', async ({ page }) => {
    await page.goto('/book-consultation/');
    await hydrated(page);
    await dismissCookies(page);
    await fillStep1(page);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('checkbox', { name: 'Not sure yet' }).check();
    await fillStep2(page);
    await page.getByRole('button', { name: 'Continue' }).click();
    await fillStep3(page);
    await page.getByRole('button', { name: 'Review details' }).click();
    await page.waitForTimeout(3200);
    await page.getByRole('button', { name: /Confirm & book consultation/ }).click();
    const fallback = page.getByTestId('form-fallback');
    await expect(fallback).toBeVisible();
    const mail = await fallback.getByRole('link', { name: 'Send via Email' }).getAttribute('href');
    expect(mail).toMatch(/^mailto:info@oxygenedu-hub\.example\?subject=/);
    expect(decodeURIComponent(mail ?? '')).toContain('Name: Asha Kumar');
    const wa = await fallback.getByRole('link', { name: 'Send via WhatsApp' }).getAttribute('href');
    expect(wa).toMatch(/^https:\/\/wa\.me\/919876543210\?text=/);
  });

  test('blocks submissions that are too fast (bot check)', async ({ page }) => {
    await mockProvider(page);
    await page.goto(`${CONFIGURED}/book-consultation/`);
    await hydrated(page);
    await dismissCookies(page);
    await fillStep1(page);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('checkbox', { name: 'Career Guidance' }).check();
    await fillStep2(page);
    await page.getByRole('button', { name: 'Continue' }).click();
    await fillStep3(page);
    await page.getByRole('button', { name: 'Review details' }).click();
    // Submit immediately — typically < 3s after load in automation
    const elapsed = await page.evaluate(() => performance.now());
    test.skip(elapsed > 2800, 'form filled too slowly to exercise the timing check');
    await page.getByRole('button', { name: /Confirm & book consultation/ }).click();
    await expect(page.getByText(/That was quick!/)).toBeVisible();
  });
});

test.describe('contact form', () => {
  test('shows inline errors, then the email/WhatsApp fallback when the endpoint is unset', async ({ page }) => {
    await page.goto('/contact/');
    await hydrated(page);
    await dismissCookies(page);
    const form = page.getByRole('form', { name: 'Contact form' });
    await page.waitForTimeout(3200);
    await form.getByRole('button', { name: 'Send message' }).click();
    await expect(form.getByText('Please enter your full name.')).toBeVisible();
    await expect(form.getByText(/valid email address|enter your email/)).toBeVisible();
    await form.getByLabel('Full name').fill('Ravi Shankar');
    await form.getByLabel(/^Email/).fill('ravi@example.com');
    await form.getByLabel('Your message').fill('I would like help choosing a PhD topic.');
    await form.getByRole('checkbox', { name: /I agree to the/ }).check();
    await form.getByRole('button', { name: 'Send message' }).click();
    const fallback = page.getByTestId('form-fallback');
    await expect(fallback).toBeVisible();
    await expect(fallback.getByRole('link', { name: 'Send via Email' })).toHaveAttribute('href', /^mailto:/);
    await expect(fallback.getByRole('link', { name: 'Send via WhatsApp' })).toHaveAttribute(
      'href',
      /^https:\/\/wa\.me\//,
    );
  });

  test('submits to the mocked endpoint and goes to thank-you', async ({ page }) => {
    const captured = await mockProvider(page);
    await page.goto(`${CONFIGURED}/contact/`);
    await hydrated(page);
    await dismissCookies(page);
    const form = page.getByRole('form', { name: 'Contact form' });
    await form.getByLabel('Full name').fill('Ravi Shankar');
    await form.getByLabel(/^Email/).fill('ravi@example.com');
    await form.getByLabel('Service of interest').selectOption('research-innovations');
    await form.getByLabel('Your message').fill('I would like help choosing a PhD topic.');
    await form.getByRole('checkbox', { name: /I agree to the/ }).check();
    await page.waitForTimeout(3200);
    await form.getByRole('button', { name: 'Send message' }).click();
    await expect(page).toHaveURL(/\/thank-you\/\?from=contact$/);
    expect(captured.bodies[0]?.name).toBe('Ravi Shankar');
    expect(captured.bodies[0]?.page).toBe('Contact page');
  });

  test('shows the fallback when the provider returns an error', async ({ page }) => {
    await mockProvider(page, false);
    await page.goto(`${CONFIGURED}/contact/`);
    await hydrated(page);
    await dismissCookies(page);
    const form = page.getByRole('form', { name: 'Contact form' });
    await form.getByLabel('Full name').fill('Ravi Shankar');
    await form.getByLabel(/^Email/).fill('ravi@example.com');
    await form.getByLabel('Your message').fill('Testing the error path.');
    await form.getByRole('checkbox', { name: /I agree to the/ }).check();
    await page.waitForTimeout(3200);
    await form.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByTestId('form-fallback')).toContainText('unavailable');
  });
});

test.describe('newsletter', () => {
  test('validates email and consent', async ({ page }) => {
    await page.goto('/');
    await hydrated(page);
    await dismissCookies(page);
    const form = page.getByRole('form', { name: 'Newsletter sign-up' });
    await form.getByLabel('Email address').fill('not-an-email');
    await page.waitForTimeout(3200);
    await form.getByRole('button', { name: 'Subscribe' }).click();
    await expect(form.getByText(/valid email address/)).toBeVisible();
    await expect(form.getByText('Please agree to the Privacy Policy so we can respond to you.')).toBeVisible();
  });
});
