import { useEffect, useRef, useState } from 'react';
import { RouteView, useLocation, useNavigationCount, useRouteMatch } from '@/router/router';
import { applySeoToDocument, resolveSeo } from '@/lib/seo';
import { trackPageview } from '@/lib/analytics';
import { topicForRoute } from '@/lib/context-topic';
import { whatsAppMessageFor } from '@/lib/whatsapp';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BackToTop, StickyMobileCTA, WhatsAppButton } from '@/components/layout/Floating';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { ToastProvider } from '@/components/ui/Toast';
import { EnquiryProvider } from '@/components/forms/EnquiryModal';

/** After client-side navigations: update <head>, announce the new page, record a page view. */
function RouteEffects({ onAnnounce }: { onAnnounce: (text: string) => void }) {
  const count = useNavigationCount();
  const match = useRouteMatch();
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const seo = resolveSeo(match, pathname);
    applySeoToDocument(seo);
    onAnnounce(seo.title);
    trackPageview(pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);
  return null;
}

export function Layout() {
  const match = useRouteMatch();
  const { pathname } = useLocation();
  const [announcement, setAnnouncement] = useState('');
  const whatsappMessage = whatsAppMessageFor(topicForRoute(match));

  return (
    <ToastProvider>
      <EnquiryProvider>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:rounded-full focus:bg-purple-700 focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Header whatsappMessage={whatsappMessage} />
        <main id="main-content" tabIndex={-1} className="outline-none">
          <div key={pathname} className="motion-safe:animate-route-fade">
            <RouteView />
          </div>
        </main>
        <Footer />
        <WhatsAppButton message={whatsappMessage} />
        <StickyMobileCTA message={whatsappMessage} />
        <BackToTop />
        <CookieBanner />
        <RouteEffects onAnnounce={setAnnouncement} />
        <div aria-live="polite" aria-atomic="true" className="sr-only" data-testid="route-announcer">
          {announcement}
        </div>
      </EnquiryProvider>
    </ToastProvider>
  );
}
