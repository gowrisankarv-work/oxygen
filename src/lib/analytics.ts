/**
 * Optional analytics (GA4 or Plausible), configured by env: VITE_GA4_ID / VITE_PLAUSIBLE_DOMAIN.
 * Scripts are injected ONLY after cookie consent is accepted. No personal data is sent.
 */
import { siteConfig } from '@/config/site.config';

let loaded = false;

export function analyticsEnabled(): boolean {
  return Boolean(siteConfig.analytics.ga4Id || siteConfig.analytics.plausibleDomain);
}

export function loadAnalytics(): void {
  if (loaded || typeof document === 'undefined' || !analyticsEnabled()) return;
  loaded = true;
  const { ga4Id, plausibleDomain } = siteConfig.analytics;

  if (ga4Id) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', ga4Id, { anonymize_ip: true, send_page_view: true });
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`;
    s.setAttribute('data-analytics', 'ga4');
    document.head.appendChild(s);
  }

  if (plausibleDomain) {
    const s = document.createElement('script');
    s.defer = true;
    s.src = 'https://plausible.io/js/script.js';
    s.setAttribute('data-domain', plausibleDomain);
    s.setAttribute('data-analytics', 'plausible');
    document.head.appendChild(s);
  }
}

/** Page view on client-side navigation (initial page view is sent by the script itself). */
export function trackPageview(path: string): void {
  if (!loaded) return;
  if (siteConfig.analytics.ga4Id && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }
  if (siteConfig.analytics.plausibleDomain && window.plausible) window.plausible('pageview');
}
