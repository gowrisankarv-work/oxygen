import { siteConfig } from '@/config/site.config';
import { PageHero } from '@/components/layout/PageHero';
import { ConsultationForm } from '@/components/forms/ConsultationForm';
import { ShieldList } from '@/components/ui/ShieldList';
import { Icon } from '@/components/icons/Icon';
import { ButtonLink } from '@/components/ui/Button';
import { EthicsNote } from '@/components/sections/SharedSections';
import { buildWhatsAppLink, whatsAppMessageFor } from '@/lib/whatsapp';
import { telHref } from '@/lib/phone';

export default function BookConsultation() {
  return (
    <>
      <PageHero
        eyebrow="Free consultation"
        title="Book a free consultation"
        subtitle="Tell us about yourself and what you need in three short steps. An expert will get in touch to confirm a time that suits you."
      />
      <section aria-label="Consultation booking" className="bg-white py-12 lg:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-12">
          <ConsultationForm />
          <aside
            className="space-y-6 lg:sticky lg:top-[calc(var(--header-h)+var(--topbar-h)+1.5rem)] lg:self-start"
            aria-label="About your consultation"
          >
            <div className="rounded-[1.5rem] bg-surface p-6">
              <h2 className="font-display text-lg font-semibold text-purple-900">What to expect</h2>
              <ShieldList
                compact
                className="mt-4 text-small"
                items={[
                  'A 20–30 minute call, video or in-person meeting',
                  'Honest advice about your options — no sales pressure',
                  'A suggested next step, even if it does not involve us',
                  'Your details stay confidential',
                ]}
              />
            </div>
            <div className="rounded-[1.5rem] border border-line p-6">
              <h2 className="font-display text-lg font-semibold text-purple-900">Prefer to talk now?</h2>
              <p className="mt-1 text-small text-muted">
                {siteConfig.contact.hours[0]?.label}: {siteConfig.contact.hours[0]?.time}
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <ButtonLink to={telHref(siteConfig.contact.phone)} variant="secondary" icon="phone" fullWidth>
                  {siteConfig.contact.phoneDisplay}
                </ButtonLink>
                <ButtonLink
                  to={buildWhatsAppLink(whatsAppMessageFor('booking a free consultation'))}
                  variant="whatsapp"
                  icon="whatsapp"
                  fullWidth
                  external
                >
                  WhatsApp us
                </ButtonLink>
              </div>
            </div>
            <EthicsNote />
            <p className="flex items-start gap-2 px-1 text-small text-muted">
              <Icon name="lock" size={16} className="mt-1" />
              We use your details only to respond to this request, as described in our Privacy Policy.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
