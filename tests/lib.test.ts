import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildWhatsAppLink, whatsAppMessageFor } from '../src/lib/whatsapp';
import { telHref, formatIndianPhone, mailtoHref } from '../src/lib/phone';
import { submitForm, spamCheck, formatSummary, isConfigured, type SubmitConfig } from '../src/lib/submitForm';
import { cn } from '../src/lib/cn';
import { siteConfig } from '../src/config/site.config';

describe('buildWhatsAppLink', () => {
  it('uses the configured number and URL-encodes the message', () => {
    const link = buildWhatsAppLink("Hi Oxygen Edu-Hub, I'd like to know more about Publication Services & fees?");
    assert.equal(
      link,
      `https://wa.me/${siteConfig.contact.whatsapp}?text=Hi%20Oxygen%20Edu-Hub%2C%20I'd%20like%20to%20know%20more%20about%20Publication%20Services%20%26%20fees%3F`,
    );
  });
  it('strips non-digits from the number', () => {
    assert.match(buildWhatsAppLink('x', '+91 98765-43210'), /^https:\/\/wa\.me\/919876543210\?text=x$/);
  });
  it('builds page-aware default messages', () => {
    assert.equal(
      whatsAppMessageFor('Career Guidance'),
      "Hi Oxygen Edu-Hub, I'd like to know more about Career Guidance.",
    );
    assert.ok(buildWhatsAppLink().includes('text=Hi%20Oxygen'));
  });
  it('encodes new lines (enquiry summaries)', () => {
    assert.ok(buildWhatsAppLink('a\nb').endsWith('text=a%0Ab'));
  });
});

describe('phone helpers', () => {
  it('builds tel: links', () => {
    assert.equal(telHref('+91 98765 43210'), 'tel:+919876543210');
    assert.equal(telHref('044-1234 5678'), 'tel:04412345678');
  });
  it('formats Indian numbers', () => {
    assert.equal(formatIndianPhone('+919876543210'), '+91 98765 43210');
    assert.equal(formatIndianPhone('9876543210'), '+91 98765 43210');
  });
  it('builds mailto links with encoded subject/body', () => {
    assert.equal(mailtoHref('a@b.example', 'Hi there', 'x y'), 'mailto:a@b.example?subject=Hi%20there&body=x%20y');
  });
});

const baseCfg: SubmitConfig = {
  provider: 'mailto',
  endpoint: '',
  accessKey: '',
  email: 'info@test.example',
  whatsapp: '911234567890',
  companyName: 'OXYGEN EDU-HUB',
};

describe('submitForm', () => {
  const payload = {
    name: 'Asha K',
    email: 'asha@test.example',
    message: 'Hello there',
    consent: true,
    company_website: '',
  };

  it('falls back to mailto + WhatsApp when unconfigured (no network call)', async () => {
    let called = false;
    const res = await submitForm(payload, 'contact', {
      config: baseCfg,
      fetchImpl: (async () => {
        called = true;
        return new Response('{}');
      }) as typeof fetch,
    });
    assert.equal(called, false);
    assert.equal(res.status, 'fallback');
    if (res.status !== 'fallback') return;
    assert.equal(res.reason, 'unconfigured');
    assert.ok(res.mailto.startsWith('mailto:info@test.example?subject='));
    assert.ok(res.whatsapp.startsWith('https://wa.me/911234567890?text='));
    assert.ok(res.summary.includes('Name: Asha K'));
    assert.ok(!res.summary.includes('consent'), 'private keys are excluded');
  });

  it('posts JSON to Web3Forms with the access key and succeeds', async () => {
    let body: Record<string, unknown> = {};
    let url = '';
    const res = await submitForm(payload, 'contact', {
      config: { ...baseCfg, provider: 'web3forms', accessKey: 'key-123' },
      fetchImpl: (async (u: string, init: RequestInit) => {
        url = u;
        body = JSON.parse(String(init.body)) as Record<string, unknown>;
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }) as unknown as typeof fetch,
    });
    assert.equal(res.status, 'success');
    assert.equal(url, 'https://api.web3forms.com/submit');
    assert.equal(body.access_key, 'key-123');
    assert.equal(body.name, 'Asha K');
    assert.equal(body.company_website, undefined, 'honeypot never submitted');
  });

  it('posts to a Formspree endpoint', async () => {
    let url = '';
    const res = await submitForm(payload, 'newsletter', {
      config: { ...baseCfg, provider: 'formspree', endpoint: 'https://formspree.io/f/abc' },
      fetchImpl: (async (u: string) => {
        url = u;
        return new Response('{"ok":true}', { status: 200 });
      }) as unknown as typeof fetch,
    });
    assert.equal(res.status, 'success');
    assert.equal(url, 'https://formspree.io/f/abc');
  });

  it('returns an error fallback on HTTP failure or network error', async () => {
    const cfg = { ...baseCfg, provider: 'web3forms' as const, accessKey: 'k' };
    const http = await submitForm(payload, 'contact', {
      config: cfg,
      fetchImpl: (async () => new Response('x', { status: 500 })) as unknown as typeof fetch,
    });
    assert.equal(http.status, 'fallback');
    if (http.status === 'fallback') assert.equal(http.reason, 'error');
    const net = await submitForm(payload, 'contact', {
      config: cfg,
      fetchImpl: (async () => {
        throw new Error('offline');
      }) as unknown as typeof fetch,
    });
    assert.equal(net.status, 'fallback');
  });

  it('knows when a provider is configured', () => {
    assert.equal(isConfigured(baseCfg), false);
    assert.equal(isConfigured({ ...baseCfg, provider: 'web3forms', accessKey: 'k' }), true);
    assert.equal(isConfigured({ ...baseCfg, provider: 'formspree', endpoint: '' }), false);
  });

  it('formats readable summaries with arrays', () => {
    const s = formatSummary({ fullName: 'A B', services: ['Career Guidance', 'Admission Expert'] }, 'consultation');
    assert.ok(s.includes('Services: Career Guidance, Admission Expert'));
  });
});

describe('spamCheck', () => {
  it('flags a filled honeypot as a bot', () => assert.equal(spamCheck('http://spam', 0, 100000, 3), 'bot'));
  it('flags submissions faster than the minimum time', () => assert.equal(spamCheck('', 1000, 2000, 3), 'too-fast'));
  it('accepts normal submissions', () => assert.equal(spamCheck('', 1000, 9000, 3), 'ok'));
});

describe('cn()', () => {
  it('merges Tailwind conflicts and keeps custom font-size tokens', () => {
    assert.equal(cn('px-2', 'px-4'), 'px-4');
    assert.equal(cn('text-h2 text-white'), 'text-h2 text-white');
    assert.equal(cn('text-h2', 'text-h3'), 'text-h3');
  });
});
