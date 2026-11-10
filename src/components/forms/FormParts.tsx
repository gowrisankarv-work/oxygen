import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { Link } from '@/router/router';
import { siteConfig } from '@/config/site.config';
import { HONEYPOT_FIELD } from '@/lib/submitForm';
import { Button, ButtonLink, type ButtonVariant } from '@/components/ui/Button';
import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/cn';
import type { FallbackResult } from './useFormEngine';

/** Hidden honeypot field — real users never see or fill it; bots usually do. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

/** Submit button that disables itself while the form action is pending (no double submits). */
export function SubmitButton({
  children,
  pendingLabel = 'Sending…',
  variant = 'primary',
  fullWidth,
  className,
}: {
  children: ReactNode;
  pendingLabel?: string;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={variant}
      fullWidth={fullWidth}
      disabled={pending}
      aria-disabled={pending}
      className={className}
      arrow={!pending}
    >
      {pending ? (
        <>
          <span
            className="inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
            aria-hidden="true"
          />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

/** Consent checkbox label linking to the Privacy Policy. */
export function ConsentLabel() {
  return (
    <>
      I agree to the{' '}
      <Link to="/privacy-policy" className="font-semibold text-purple-500 underline underline-offset-2" target="_blank">
        Privacy Policy
      </Link>{' '}
      and consent to {siteConfig.shortName} contacting me about this enquiry.
    </>
  );
}

export function FormAlert({ children, tone = 'error' }: { children: ReactNode; tone?: 'error' | 'info' }) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-input border p-4 text-small',
        tone === 'error'
          ? 'border-error-600/30 bg-error-600/5 text-error-600'
          : 'border-blue-600/25 bg-blue-600/5 text-navy-800',
      )}
    >
      <Icon name={tone === 'error' ? 'alert' : 'info'} size={18} className="mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

/**
 * Shown when the form provider is not configured or the request failed: lets the user
 * send the same enquiry by email or WhatsApp with one tap.
 */
export function FallbackPanel({
  fallback,
  onSent,
  compact,
}: {
  fallback: FallbackResult;
  onSent?: () => void;
  compact?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      data-testid="form-fallback"
      className={cn(
        'rounded-card border border-purple-500/25 bg-surface p-5 outline-none',
        compact ? 'text-small' : '',
      )}
    >
      <p className="font-display text-lg font-semibold text-purple-900">
        {fallback.reason === 'unconfigured'
          ? 'Almost done — send your enquiry in one tap'
          : 'Our form service is unavailable right now'}
      </p>
      <p className="mt-1.5 text-small text-muted">
        Your details are ready. Choose email or WhatsApp to send them directly to our team — nothing is sent until you
        press send in your app.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <ButtonLink to={fallback.mailto} variant="primary" icon="mail" onClick={onSent} external={false}>
          Send via Email
        </ButtonLink>
        <ButtonLink to={fallback.whatsapp} variant="whatsapp" icon="whatsapp" onClick={onSent} external>
          Send via WhatsApp
        </ButtonLink>
      </div>
    </div>
  );
}

/** Optional Cloudflare Turnstile widget (rendered only when VITE_TURNSTILE_SITE_KEY is set). */
export function Turnstile() {
  const ref = useRef<HTMLDivElement | null>(null);
  const key = siteConfig.forms.turnstileSiteKey;
  useEffect(() => {
    if (!key || !ref.current) return;
    const el = ref.current;
    const render = () => window.turnstile?.render(el, { sitekey: key, theme: 'light' });
    if (window.turnstile) {
      render();
      return;
    }
    const existing = document.querySelector('script[data-turnstile]');
    const script = existing ?? document.createElement('script');
    if (!existing) {
      script.setAttribute('src', 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit');
      script.setAttribute('async', '');
      script.setAttribute('data-turnstile', '');
      document.head.appendChild(script);
    }
    script.addEventListener('load', render, { once: true });
  }, [key]);
  if (!key) return null;
  return <div ref={ref} className="min-h-[65px]" />;
}
