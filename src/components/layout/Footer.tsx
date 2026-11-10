import { siteConfig, formatAddress } from '@/config/site.config';
import { services } from '@/content/services';
import { quickLinks, legalLinks } from '@/content/navigation';
import { Link } from '@/router/router';
import { telHref, mailtoHref } from '@/lib/phone';
import { socialLinks } from '@/lib/social';
import { Icon } from '@/components/icons/Icon';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { BrandLogo } from './BrandLogo';

function FooterHeading({ children }: { children: string }) {
  return <h2 className="eyebrow mb-5 text-gold-400">{children}</h2>;
}

const linkCls = 'inline-flex min-h-8 items-center text-white/80 transition-colors hover:text-white';

export function Footer() {
  const { contact, features, credits } = siteConfig;
  const socials = socialLinks();
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark relative overflow-hidden bg-purple-900 pb-24 text-white md:pb-0">
      <div
        aria-hidden="true"
        className="pattern-slash pointer-events-none absolute inset-0 text-white opacity-[0.05]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-32 size-96 rounded-full bg-violet-400/20 blur-3xl"
      />

      {features.showNewsletter && (
        <div className="relative border-b border-white/10">
          <div className="container-site flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:py-12">
            <div className="max-w-md">
              <h2 className="font-display text-2xl font-semibold text-white">Practical guidance, once a month</h2>
              <p className="mt-2 text-white/80">
                Admission timelines, career tips and research advice. No spam — unsubscribe any time.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      )}

      <div className="container-site relative grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr] lg:gap-12 lg:py-16">
        <div>
          <Link to="/" className="inline-block rounded-lg" aria-label={`${siteConfig.companyName} — home`}>
            <BrandLogo theme="dark" size={68} />
          </Link>
          <p className="mt-5 max-w-xs text-white/80">
            Ethical, personalised guidance for admissions, careers, research and publication — fuel for every stage of
            your academic journey.
          </p>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-2" aria-label="Social media">
              {socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-11 place-items-center rounded-full bg-white/10 text-gold-400 transition-colors hover:bg-white/20"
                    aria-label={`${siteConfig.shortName} on ${s.name} (opens in a new tab)`}
                  >
                    <Icon name={s.icon} size={20} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-labelledby="footer-quick">
          <h2 id="footer-quick" className="eyebrow mb-5 text-gold-400">
            Quick Links
          </h2>
          <ul className="space-y-1.5">
            {quickLinks
              .filter((l) =>
                l.to === '/careers' ? features.showCareers : l.to === '/resources' ? features.showBlog : true,
              )
              .map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-services">
          <h2 id="footer-services" className="eyebrow mb-5 text-gold-400">
            Services
          </h2>
          <ul className="space-y-1.5">
            {services.map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`} className={linkCls}>
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/book-consultation" className={linkCls}>
                Book a Free Consultation
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <FooterHeading>Contact</FooterHeading>
          <address className="space-y-3.5 not-italic">
            <p className="flex gap-3 text-white/80">
              <Icon name="map-pin" size={20} className="mt-1 text-gold-400" />
              <span>{formatAddress()}</span>
            </p>
            <p>
              <a href={telHref(contact.phone)} className="flex items-center gap-3 text-white/80 hover:text-white">
                <Icon name="phone" size={20} className="text-gold-400" />
                {contact.phoneDisplay}
              </a>
            </p>
            <p>
              <a
                href={mailtoHref(contact.email)}
                className="flex items-center gap-3 break-all text-white/80 hover:text-white"
              >
                <Icon name="mail" size={20} className="text-gold-400" />
                {contact.email}
              </a>
            </p>
            <div className="flex gap-3 text-white/80">
              <Icon name="clock" size={20} className="mt-1 text-gold-400" />
              <ul>
                {contact.hours.map((h) => (
                  <li key={h.label}>
                    {h.label}: {h.time}
                  </li>
                ))}
              </ul>
            </div>
            <p>
              <a
                href={
                  contact.mapLink ||
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatAddress())}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 font-semibold text-gold-400 hover:text-white"
              >
                Get Directions
                <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
                <span className="sr-only">(opens Google Maps in a new tab)</span>
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-site flex flex-col gap-4 py-6 text-small text-white/75 lg:flex-row lg:items-center lg:justify-between">
          <p suppressHydrationWarning>
            © {year} {siteConfig.companyName}. All rights reserved.
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {legalLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="inline-flex min-h-8 items-center hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {credits.show && (
            <p>
              Designed &amp; developed by{' '}
              {credits.agencyUrl ? (
                <a
                  href={credits.agencyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-white"
                >
                  {credits.agencyName}
                </a>
              ) : (
                credits.agencyName
              )}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
