/**
 * Mobile drawer navigation — native modal <dialog> (focus trapped, Esc closes, backdrop click
 * closes, body scroll locked, focus returns to the hamburger). Services in an accordion;
 * Call and WhatsApp quick buttons at the bottom.
 */
import { siteConfig } from '@/config/site.config';
import { services } from '@/content/services';
import { mainNav, BOOK_PATH } from '@/content/navigation';
import { Link, useLocation } from '@/router/router';
import { Dialog } from '@/components/ui/Dialog';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/icons/Icon';
import { telHref } from '@/lib/phone';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { cn } from '@/lib/cn';

export function MobileNav({
  open,
  onClose,
  whatsappMessage,
}: {
  open: boolean;
  onClose: () => void;
  whatsappMessage: string;
}) {
  const { pathname } = useLocation();
  const isActive = (to: string) => (to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`));
  const linkCls = (to: string) =>
    cn(
      'flex min-h-12 items-center rounded-xl px-3 text-base font-medium transition-colors hover:bg-surface',
      isActive(to) ? 'bg-surface text-purple-700' : 'text-ink',
    );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      variant="drawer"
      title="Menu"
      hideTitle
      footer={
        <div className="grid grid-cols-2 gap-3">
          <ButtonLink to={telHref(siteConfig.contact.phone)} variant="secondary" icon="phone" fullWidth>
            Call
          </ButtonLink>
          <ButtonLink to={buildWhatsAppLink(whatsappMessage)} variant="whatsapp" icon="whatsapp" fullWidth external>
            WhatsApp
          </ButtonLink>
        </div>
      }
    >
      <nav aria-label="Mobile">
        <ul className="space-y-1">
          {mainNav.map((item) =>
            item.mega ? (
              <li key={item.to}>
                <details className="group/m" open={pathname.startsWith('/services')}>
                  <summary
                    className={cn(
                      'flex min-h-12 cursor-pointer items-center justify-between rounded-xl px-3 text-base font-medium hover:bg-surface',
                      isActive(item.to) ? 'text-purple-700' : 'text-ink',
                    )}
                  >
                    Services
                    <Icon name="chevron-down" size={18} className="transition-transform group-open/m:rotate-180" />
                  </summary>
                  <ul className="mt-1 mb-2 space-y-1 border-l-2 border-line pl-3 ml-3">
                    {services.map((s) => (
                      <li key={s.slug}>
                        <Link to={`/services/${s.slug}`} className={linkCls(`/services/${s.slug}`)} onClick={onClose}>
                          <Icon name={s.icon} size={18} className="mr-3 text-purple-500" />
                          {s.title}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        to="/services"
                        className={cn(linkCls('/services-all'), 'text-purple-700')}
                        onClick={onClose}
                      >
                        View all services
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>
            ) : (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={linkCls(item.to)}
                  onClick={onClose}
                  aria-current={isActive(item.to) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
        <div className="mt-6">
          <ButtonLink to={BOOK_PATH} fullWidth arrow onClick={onClose}>
            Book Free Consultation
          </ButtonLink>
        </div>
      </nav>
    </Dialog>
  );
}
