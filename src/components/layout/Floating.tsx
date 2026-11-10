/**
 * Floating UI: WhatsApp button (desktop/tablet), sticky mobile CTA bar (<768px),
 * back-to-top button (after ~600px of scroll).
 */
import { siteConfig } from '@/config/site.config';
import { BOOK_PATH } from '@/content/navigation';
import { Link } from '@/router/router';
import { telHref } from '@/lib/phone';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { useScrollState } from '@/hooks/useScroll';
import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/cn';

export function WhatsAppButton({ message }: { message: string }) {
  return (
    <a
      href={buildWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${siteConfig.shortName} on WhatsApp (opens in a new tab)`}
      data-testid="whatsapp-float"
      className="group fixed right-5 bottom-5 z-40 hidden md:block lg:right-8 lg:bottom-8"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-whatsapp-700 motion-safe:animate-pulse-ring"
      />
      <span className="relative grid size-14 place-items-center rounded-full bg-whatsapp-700 text-white shadow-lift transition-transform duration-200 group-hover:scale-105">
        <Icon name="whatsapp" size={28} />
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute top-1/2 right-[calc(100%+0.75rem)] -translate-y-1/2 rounded-full bg-ink px-3.5 py-1.5 text-small font-medium whitespace-nowrap text-white opacity-0 shadow-soft transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        Chat with us on WhatsApp
      </span>
    </a>
  );
}

export function StickyMobileCTA({ message }: { message: string }) {
  const item = 'flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-semibold';
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-16px_rgb(74_20_134/0.4)] backdrop-blur md:hidden"
    >
      <ul className="flex">
        <li className="flex flex-1">
          <a href={telHref(siteConfig.contact.phone)} className={cn(item, 'text-purple-900')}>
            <Icon name="phone" size={20} className="text-purple-700" />
            Call
          </a>
        </li>
        <li className="flex flex-1">
          <a
            href={buildWhatsAppLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(item, 'text-purple-900')}
          >
            <Icon name="whatsapp" size={20} className="text-whatsapp-700" />
            WhatsApp
          </a>
        </li>
        <li className="flex flex-[1.4] p-1.5">
          <Link to={BOOK_PATH} className={cn(item, 'flex-row gap-1.5 rounded-xl bg-purple-700 text-sm text-white')}>
            <Icon name="calendar" size={18} />
            Book Consultation
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export function BackToTop() {
  const { y } = useScrollState();
  const visible = y > 600;
  return (
    <button
      type="button"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.getElementById('main-content')?.focus({ preventScroll: true });
      }}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={visible ? undefined : true}
      className={cn(
        'fixed right-5 bottom-20 z-40 grid size-11 place-items-center rounded-full border border-line bg-white text-purple-700 shadow-soft transition-[opacity,transform] duration-300 hover:bg-surface md:right-[1.6rem] md:bottom-24 lg:right-[2.35rem] lg:bottom-28',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <Icon name="arrow-up" size={20} />
    </button>
  );
}
