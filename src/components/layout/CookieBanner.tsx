/**
 * Minimal cookie consent banner. Renders nothing on the server (consent lives in the
 * browser), appears after hydration if no choice is stored. Analytics loads only on Accept.
 */
import { useEffect, useState } from 'react';
import { getConsent, setConsent, subscribeConsent } from '@/lib/consent';
import { analyticsEnabled, loadAnalytics } from '@/lib/analytics';
import { Link } from '@/router/router';
import { Button } from '@/components/ui/Button';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const sync = () => {
      const choice = getConsent();
      setShow(choice === null);
      if (choice === 'accepted') loadAnalytics();
    };
    sync();
    return subscribeConsent(sync);
  }, []);

  if (!show) return null;

  return (
    <section
      aria-label="Cookie consent"
      data-testid="cookie-banner"
      className="pop-in fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-[45] rounded-card border border-line bg-white p-5 shadow-lift sm:inset-x-auto sm:left-5 sm:max-w-md md:bottom-5"
    >
      <h2 className="font-display text-base font-semibold text-purple-900">Your privacy, your choice</h2>
      <p className="mt-1.5 text-small text-muted">
        We use essential cookies to run this site
        {analyticsEnabled() ? ' and, with your permission, analytics cookies to understand how it is used' : ''}. Read
        our{' '}
        <Link to="/privacy-policy" className="font-semibold text-purple-500 underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-4 flex gap-3">
        <Button size="sm" onClick={() => setConsent('accepted')}>
          Accept
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setConsent('rejected')}>
          Reject non-essential
        </Button>
      </div>
    </section>
  );
}
