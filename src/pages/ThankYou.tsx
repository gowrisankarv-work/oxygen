import { siteConfig } from '@/config/site.config';
import { useSearchParams } from '@/router/router';
import { useHydrated } from '@/hooks/useHydrated';
import { Section } from '@/components/ui/Layout';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/icons/Icon';
import { buildWhatsAppLink } from '@/lib/whatsapp';

/** Form success page (noindex). Generic content only — no personal data in the URL. */
export default function ThankYou() {
  const params = useSearchParams();
  const hydrated = useHydrated();
  const from = hydrated ? params.get('from') : null;
  const viaDirect = hydrated && params.get('via') === 'direct';
  const heading = from === 'consultation' ? 'Your consultation request is in' : 'Thank you — we have your message';
  const steps = [
    {
      title: viaDirect ? 'Send your message' : 'We review your details',
      text: viaDirect
        ? 'If you have not already, press send in your email or WhatsApp app so your enquiry reaches us.'
        : 'A member of our team reads every enquiry personally.',
    },
    {
      title: 'We get in touch',
      text: `${siteConfig.contact.responseTime} We will use your preferred contact method.`,
    },
    {
      title: 'Your free consultation',
      text: 'We confirm a time, listen to your goals and suggest a clear next step — with no obligation.',
    },
  ];

  return (
    <Section
      className="bg-surface pt-[calc(var(--header-h)+var(--topbar-h)+3rem)] lg:pt-[calc(var(--header-h)+var(--topbar-h)+5rem)]"
      tone="surface"
    >
      <div className="mx-auto max-w-3xl text-center">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-signature text-white shadow-lift">
          <Icon name="check" size={40} strokeWidth={2.5} />
        </span>
        <h1 className="mt-8 text-h1 tracking-[-0.02em]">{heading}</h1>
        <p className="mt-4 text-body text-muted">
          Thank you for reaching out to {siteConfig.shortName}. Here is what happens next.
        </p>
      </div>
      <ol className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="rounded-card border border-line bg-white p-6 shadow-card">
            <span className="grid size-10 place-items-center rounded-full bg-purple-700 font-display font-bold text-white">
              {i + 1}
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold text-purple-900">{s.title}</h2>
            <p className="mt-1.5 text-small text-muted">{s.text}</p>
          </li>
        ))}
      </ol>
      <div className="mx-auto mt-12 flex max-w-xl flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink
          to={buildWhatsAppLink(
            `Hi ${siteConfig.shortName}, I have just sent an enquiry through your website and wanted to follow up.`,
          )}
          variant="whatsapp"
          icon="whatsapp"
          external
        >
          Follow up on WhatsApp
        </ButtonLink>
        <ButtonLink to="/resources" variant="secondary" arrow>
          Read our guides
        </ButtonLink>
      </div>
    </Section>
  );
}
