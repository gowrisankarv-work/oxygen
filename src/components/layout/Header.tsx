/**
 * Sticky site header (with the desktop top bar above it).
 *  - Transparent at the top of the page; white + blur + shadow once scrolled.
 *  - The top bar slides away on scroll down and returns on scroll up.
 *  - Desktop: nav + Services mega-menu + "Book Free Consultation" pill.
 *  - Mobile: hamburger → drawer (see MobileNav).
 */
import { useEffect, useRef, useState } from 'react';
import { mainNav, BOOK_PATH } from '@/content/navigation';
import { siteConfig } from '@/config/site.config';
import { Link, useLocation } from '@/router/router';
import { useScrollState } from '@/hooks/useScroll';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/cn';
import { BrandLogo } from './BrandLogo';
import { MegaMenu } from './MegaMenu';
import { MobileNav } from './MobileNav';
import { TopBar } from './TopBar';

export function Header({ whatsappMessage }: { whatsappMessage: string }) {
  const { y, direction } = useScrollState();
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement | null>(null);
  const scrolled = y > 8;
  const hideTopBar = direction === 'down' && y > 120;

  useEffect(() => setDrawerOpen(false), [pathname]);

  const isActive = (to: string) => (to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`));

  return (
    <div
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-premium',
        hideTopBar && 'lg:-translate-y-[var(--topbar-h)]',
      )}
    >
      <TopBar />
      <header
        className={cn(
          'relative h-[var(--header-h)] transition-[background-color,box-shadow,backdrop-filter] duration-300',
          scrolled ? 'bg-white/90 shadow-[0_6px_24px_-14px_rgb(74_20_134/0.35)] backdrop-blur-lg' : 'bg-transparent',
        )}
      >
        <div className="container-site flex h-full items-center justify-between gap-4">
          <Link to="/" className="shrink-0 rounded-lg" aria-label={`${siteConfig.companyName} — home`}>
            <BrandLogo size={46} className="h-10 w-auto lg:h-[46px]" />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) =>
                item.mega ? (
                  <MegaMenu key={item.to} active={isActive(item.to)} />
                ) : (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      aria-current={isActive(item.to) ? 'page' : undefined}
                      className={cn(
                        'relative inline-flex min-h-11 items-center rounded-full px-3.5 py-2 text-[0.95rem] font-medium transition-colors hover:text-purple-500',
                        isActive(item.to) ? 'text-purple-700' : 'text-ink',
                      )}
                    >
                      {item.label}
                      {isActive(item.to) && (
                        <span
                          className="absolute inset-x-3.5 bottom-1.5 h-0.5 rounded-full bg-trust-600"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ButtonLink to={BOOK_PATH} size="sm" className="hidden px-5 py-2.5 sm:inline-flex" arrow>
              Book Free Consultation
            </ButtonLink>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={drawerOpen}
              className="grid size-11 place-items-center rounded-full text-purple-900 transition-colors hover:bg-surface lg:hidden"
            >
              <Icon name="menu" size={24} />
            </button>
          </div>
        </div>
      </header>
      <MobileNav open={drawerOpen} onClose={() => setDrawerOpen(false)} whatsappMessage={whatsappMessage} />
    </div>
  );
}
