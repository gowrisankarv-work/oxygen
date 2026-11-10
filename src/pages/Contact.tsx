import { useEffect, useRef, useState } from 'react';
import { siteConfig, formatAddress } from '@/config/site.config';
import { PageHero } from '@/components/layout/PageHero';
import { Card, Section } from '@/components/ui/Layout';
import { Reveal } from '@/components/ui/Reveal';
import { Icon, type IconName } from '@/components/icons/Icon';
import { ContactForm } from '@/components/forms/ContactForm';
import { telHref, mailtoHref } from '@/lib/phone';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { socialLinks } from '@/lib/social';
import { observeOnce } from '@/hooks/useInView';

/** Google Map embed — lazy: the iframe is only created when the card scrolls into view. */
function MapEmbed() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const { mapEmbedUrl, mapLink } = siteConfig.contact;
  useEffect(() => {
    if (!ref.current || !mapEmbedUrl) return;
    return observeOnce(ref.current, () => setVisible(true));
  }, [mapEmbedUrl]);

  if (!mapEmbedUrl) {
    return (
      <div
        className="grid aspect-[4/3] w-full place-items-center rounded-card border border-dashed border-purple-500/30 bg-surface p-8 text-center lg:aspect-auto lg:h-full lg:min-h-80"
        data-testid="map-placeholder"
      >
        <div>
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-purple-700 shadow-card">
            <Icon name="map-pin" size={28} />
          </span>
          <p className="mt-4 font-display text-lg font-semibold text-purple-900">Map will appear here</p>
          <p className="mt-1 text-small text-muted">{formatAddress()}</p>
          <a
            href={mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatAddress())}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 font-semibold text-purple-700 hover:text-purple-500"
          >
            Open in Google Maps <Icon name="arrow-right" size={16} />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    );
  }
  return (
    <div
      ref={ref}
      className="aspect-[4/3] w-full overflow-hidden rounded-card border border-line bg-surface lg:aspect-auto lg:h-full lg:min-h-80"
    >
      {visible && (
        <iframe
          src={mapEmbedUrl}
          title={`Map showing the location of ${siteConfig.companyName}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="h-full w-full border-0"
        />
      )}
    </div>
  );
}

export default function Contact() {
  const { contact } = siteConfig;
  const socials = socialLinks();
  const cards: { title: string; value: string; href: string; icon: IconName; external?: boolean; action: string }[] = [
    { title: 'Phone', value: contact.phoneDisplay, href: telHref(contact.phone), icon: 'phone', action: 'Call us' },
    {
      title: 'WhatsApp',
      value: contact.phoneDisplay,
      href: buildWhatsAppLink(),
      icon: 'whatsapp',
      external: true,
      action: 'Start a chat',
    },
    { title: 'Email', value: contact.email, href: mailtoHref(contact.email), icon: 'mail', action: 'Write to us' },
    {
      title: 'Visit us',
      value: formatAddress(),
      href: contact.mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatAddress())}`,
      icon: 'map-pin',
      external: true,
      action: 'Get directions',
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title="Let’s talk about your next step"
        subtitle={`Call, message or visit us — or send the form below. ${contact.responseTime}`}
      />

      <Section spacing="compact" labelledBy="contact-cards-title" className="pt-12 lg:pt-16">
        <h2 id="contact-cards-title" className="sr-only">
          Ways to reach us
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <Reveal as="li" key={c.title} index={i}>
              <a
                href={c.href}
                {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group flex h-full flex-col rounded-card border border-line bg-white p-6 shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-lift"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-signature text-white shadow-soft">
                  <Icon name={c.icon} size={24} />
                </span>
                <span className="mt-4 font-display text-lg font-semibold text-purple-900">{c.title}</span>
                <span className="mt-1 text-small break-words text-muted">{c.value}</span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-small font-semibold text-purple-700">
                  {c.action}
                  <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
                  {c.external && <span className="sr-only">(opens in a new tab)</span>}
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section spacing="compact" labelledBy="contact-form-title" className="pb-16 lg:pb-28">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <Card className="p-6 sm:p-8 lg:p-10">
            <h2 id="contact-form-title" className="text-h2 tracking-[-0.02em]">
              Send us a message
            </h2>
            <p className="mt-2 mb-8 text-muted">Tell us a little about what you need. Fields marked * are required.</p>
            <ContactForm />
          </Card>
          <div className="flex flex-col gap-6">
            <MapEmbed />
            <Card>
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-purple-900">
                <Icon name="clock" size={20} className="text-purple-500" />
                Business hours
              </h2>
              <dl className="mt-4 divide-y divide-line text-small">
                {contact.hours.map((h) => (
                  <div key={h.label} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-muted">{h.label}</dt>
                    <dd className="font-semibold text-purple-900">{h.time}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 flex items-start gap-2 text-small text-muted">
                <Icon name="info" size={18} className="mt-0.5 text-blue-600" />
                {contact.responseTime}
              </p>
              {socials.length > 0 && (
                <div className="mt-5 border-t border-line pt-5">
                  <p className="text-small font-semibold text-purple-900">Follow us</p>
                  <ul className="mt-3 flex gap-2">
                    {socials.map((s) => (
                      <li key={s.name}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${siteConfig.shortName} on ${s.name} (opens in a new tab)`}
                          className="grid size-11 place-items-center rounded-full bg-surface text-purple-700 hover:bg-line"
                        >
                          <Icon name={s.icon} size={18} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
