/**
 * E2E tests run against TWO production builds served by scripts/preview.ts:
 *   :4173  dist/      — default build: no form provider (mailto/WhatsApp fallback), no analytics
 *   :4174  dist-e2e/  — form provider + GA4 configured with test values; the provider endpoint
 *                       is intercepted (mocked) by the tests, nothing leaves the machine.
 * Browsers: Playwright Chromium on desktop + a mobile viewport. If Playwright's own browser
 * is not installed, set PW_CHANNEL=chrome to use the system Chrome.
 */
import { defineConfig, devices } from 'playwright/test';

const channel = process.env.PW_CHANNEL || undefined;

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  expect: { timeout: 7_000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
    ...(channel ? { channel } : {}),
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
  webServer: [
    {
      command: 'node scripts/run.mjs build && node scripts/run.mjs preview --port=4173 --dir=dist',
      url: 'http://localhost:4173',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        VITE_FORM_PROVIDER: '',
        VITE_FORM_ENDPOINT: '',
        VITE_FORM_ACCESS_KEY: '',
        VITE_GA4_ID: '',
        VITE_PLAUSIBLE_DOMAIN: '',
      },
    },
    {
      command:
        'node scripts/run.mjs build --outdir=dist-e2e && node scripts/run.mjs preview --port=4174 --dir=dist-e2e',
      url: 'http://localhost:4174',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        VITE_FORM_PROVIDER: 'web3forms',
        VITE_FORM_ENDPOINT: 'https://api.web3forms.com/submit',
        VITE_FORM_ACCESS_KEY: 'e2e-test-access-key',
        VITE_GA4_ID: 'G-E2ETEST000',
        VITE_PLAUSIBLE_DOMAIN: '',
      },
    },
  ],
});
