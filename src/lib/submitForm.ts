/**
 * Form submission abstraction used by every form on the site.
 *
 *   submitForm(payload, formType)
 *
 * - Web3Forms or Formspree when configured via env (VITE_FORM_PROVIDER / VITE_FORM_ENDPOINT /
 *   VITE_FORM_ACCESS_KEY). Access keys for these services are public-by-design; never put
 *   private secrets in VITE_ variables.
 * - When unconfigured (or the request fails) it returns a graceful fallback: a ready-made
 *   mailto: link and a "Send via WhatsApp" link containing the enquiry summary, which the
 *   user can send themselves.
 * - Never logs personal data.
 */
import { siteConfig, type FormProvider } from '@/config/site.config';
import { mailtoHref } from './phone';
import { buildWhatsAppLink } from './whatsapp';

export type FormType = 'consultation' | 'contact' | 'quick-enquiry' | 'newsletter';

export type FormValue = string | number | boolean | string[] | undefined | null;
export type FormPayload = Record<string, FormValue>;

export type SubmitResult =
  | { status: 'success' }
  | {
      status: 'fallback';
      reason: 'unconfigured' | 'error';
      mailto: string;
      whatsapp: string;
      summary: string;
    };

export interface SubmitConfig {
  provider: FormProvider;
  endpoint: string;
  accessKey: string;
  email: string;
  whatsapp: string;
  companyName: string;
}

const FORM_LABELS: Record<FormType, string> = {
  consultation: 'Free consultation request',
  contact: 'Website contact form',
  'quick-enquiry': 'Quick enquiry',
  newsletter: 'Newsletter sign-up',
};

/** Human labels for payload keys in fallback summaries. */
const FIELD_LABELS: Record<string, string> = {
  fullName: 'Name',
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  countryCode: 'Country code',
  city: 'City',
  role: 'I am a',
  services: 'Services',
  service: 'Service',
  educationLevel: 'Education level',
  target: 'Target course / field / journal',
  timeline: 'Timeline',
  contactMethod: 'Preferred contact method',
  preferredDate: 'Preferred date',
  timeSlot: 'Preferred time',
  message: 'Message',
  source: 'Heard about us via',
  page: 'Page',
};

/** Keys never included in summaries or submissions. */
const PRIVATE_KEYS = new Set(['consent', 'botcheck', 'company_website', 'startedAt', 'cf-turnstile-response']);

export function formatSummary(payload: FormPayload, formType: FormType): string {
  const lines = [`${FORM_LABELS[formType]}`, ''];
  for (const [key, raw] of Object.entries(payload)) {
    if (PRIVATE_KEYS.has(key) || raw === undefined || raw === null || raw === '' || raw === false) continue;
    const value = Array.isArray(raw) ? raw.join(', ') : String(raw);
    if (!value) continue;
    lines.push(`${FIELD_LABELS[key] ?? key}: ${value}`);
  }
  return lines.join('\n');
}

export function buildFallback(
  payload: FormPayload,
  formType: FormType,
  reason: 'unconfigured' | 'error',
  cfg: SubmitConfig,
) {
  const summary = formatSummary(payload, formType);
  return {
    status: 'fallback' as const,
    reason,
    summary,
    mailto: mailtoHref(cfg.email, `${FORM_LABELS[formType]} — ${cfg.companyName}`, summary),
    whatsapp: buildWhatsAppLink(summary, cfg.whatsapp),
  };
}

export function isConfigured(cfg: SubmitConfig): boolean {
  if (cfg.provider === 'mailto') return false;
  if (cfg.provider === 'web3forms') return Boolean(cfg.accessKey);
  return Boolean(cfg.endpoint);
}

function defaultConfig(): SubmitConfig {
  return {
    provider: siteConfig.forms.provider,
    endpoint: siteConfig.forms.endpoint,
    accessKey: siteConfig.forms.accessKey,
    email: siteConfig.contact.email,
    whatsapp: siteConfig.contact.whatsapp,
    companyName: siteConfig.companyName,
  };
}

function cleanPayload(payload: FormPayload): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(payload)) {
    if (PRIVATE_KEYS.has(k) && k !== 'cf-turnstile-response') continue;
    if (v === undefined || v === null) continue;
    out[k] = Array.isArray(v) ? v.join(', ') : v;
  }
  return out;
}

export async function submitForm(
  payload: FormPayload,
  formType: FormType,
  options: { config?: Partial<SubmitConfig>; fetchImpl?: typeof fetch; timeoutMs?: number } = {},
): Promise<SubmitResult> {
  const cfg = { ...defaultConfig(), ...options.config };
  if (!isConfigured(cfg)) return buildFallback(payload, formType, 'unconfigured', cfg);

  const doFetch = options.fetchImpl ?? fetch;
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : undefined;
  const timer = controller ? setTimeout(() => controller.abort(), options.timeoutMs ?? 15000) : undefined;
  const subject = `${FORM_LABELS[formType]} — ${cfg.companyName}`;
  const data = cleanPayload(payload);

  try {
    let res: Response;
    if (cfg.provider === 'web3forms') {
      res = await doFetch(cfg.endpoint || 'https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: cfg.accessKey,
          subject,
          from_name: cfg.companyName,
          form_type: formType,
          ...data,
        }),
        signal: controller?.signal,
      });
    } else {
      res = await doFetch(cfg.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ _subject: subject, form_type: formType, ...data }),
        signal: controller?.signal,
      });
    }
    if (!res.ok) return buildFallback(payload, formType, 'error', cfg);
    const json = (await res.json().catch(() => ({}))) as { success?: boolean; ok?: boolean };
    if (json.success === false || json.ok === false) return buildFallback(payload, formType, 'error', cfg);
    return { status: 'success' };
  } catch {
    return buildFallback(payload, formType, 'error', cfg);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/* ---------------------------- Spam protection ---------------------------- */

export const HONEYPOT_FIELD = 'company_website';

export type SpamVerdict = 'ok' | 'bot' | 'too-fast';

/**
 * Honeypot + minimum time-to-submit check.
 * 'bot' → silently pretend success (do not tell bots they were caught).
 * 'too-fast' → ask the human to take a moment and try again.
 */
export function spamCheck(
  honeypotValue: string,
  startedAt: number,
  now = Date.now(),
  minSeconds = siteConfig.forms.minSubmitSeconds,
): SpamVerdict {
  if (honeypotValue.trim() !== '') return 'bot';
  if (now - startedAt < minSeconds * 1000) return 'too-fast';
  return 'ok';
}
