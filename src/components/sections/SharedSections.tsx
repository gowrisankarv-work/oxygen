import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { siteConfig } from '@/config/site.config';
import { processSteps } from '@/content/process';
import { differentiators } from '@/content/whyChooseUs';
import { stats } from '@/content/stats';
import { BOOK_PATH } from '@/content/navigation';
import { Link } from '@/router/router';
import { Icon } from '@/components/icons/Icon';
import { Section, SectionHeading, SampleLabel } from '@/components/ui/Layout';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Accordion } from '@/components/ui/Accordion';
import { observeOnce } from '@/hooks/useInView';
import { prefersReducedMotion } from '@/hooks/useScroll';
import { buildWhatsAppLink, whatsAppMessageFor } from '@/lib/whatsapp';
import { cn } from '@/lib/cn';

/* ---------------------------- Process timeline ---------------------------- */
export function ProcessTimeline({
  title = 'A clear path from first call to final step',
  headingId = 'process-title',
}: {
  title?: string;
  headingId?: string;
}) {
  return (
    <Section tone="surface" labelledBy={headingId}>
      <SectionHeading
        id={headingId}
        eyebrow="How we work"
        title={title}
        description="Five simple stages, with no surprises along the way."
        align="center"
      />
      <ol className="relative grid gap-8 lg:grid-cols-5 lg:gap-6">
        <span
          aria-hidden="true"
          className="absolute top-7 bottom-7 left-7 w-0.5 bg-[linear-gradient(to_bottom,var(--brand-violet-400),var(--brand-magenta-500))] opacity-30 lg:top-7 lg:right-[10%] lg:bottom-auto lg:left-[10%] lg:h-0.5 lg:w-auto lg:bg-[linear-gradient(to_right,var(--brand-violet-400),var(--brand-magenta-500))]"
        />
        {processSteps.map((step, i) => (
          <Reveal
            as="li"
            key={step.title}
            index={i}
            className="relative flex gap-5 lg:flex-col lg:items-center lg:text-center"
          >
            <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-full bg-white font-display text-lg font-bold text-purple-700 shadow-soft ring-4 ring-surface">
              <span className="sr-only">Step </span>
              {i + 1}
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold text-purple-900">{step.title}</h3>
              <p className="mt-1.5 text-small text-muted">{step.short}</p>
            </div>
          </Reveal>
        ))}
      </ol>
      <div className="mt-12 text-center">
        <Link
          to="/how-we-work"
          className="group inline-flex items-center gap-2 font-semibold text-purple-700 hover:text-purple-500"
        >
          See our approach in detail
          <Icon name="arrow-right" size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </Section>
  );
}

/* ------------------------------ Why choose us ----------------------------- */
export function WhyChooseUsGrid({ detailed, headingLevel = 'h2' }: { detailed?: boolean; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel === 'h2' ? 'h3' : 'h4';
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {differentiators.map((d, i) => (
        <Reveal
          as="li"
          key={d.title}
          index={i}
          className="group relative rounded-card border border-line bg-white p-6 shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-premium hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-lift lg:p-7"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-xl bg-surface text-purple-700 transition-transform duration-300 group-hover:rotate-[-6deg]">
              <Icon name={d.icon} size={24} />
            </span>
            <Icon name="shield-check" size={20} className="ml-auto text-trust-600" />
          </div>
          <H className="font-display text-lg font-semibold text-purple-900">{d.title}</H>
          <p className="mt-2 text-muted">{detailed ? d.detail : d.text}</p>
        </Reveal>
      ))}
    </ul>
  );
}

export function WhyChooseUs() {
  return (
    <Section labelledBy="why-title">
      <SectionHeading
        id="why-title"
        eyebrow="Why choose us"
        title="Expert guidance you can trust"
        description="We measure ourselves by the confidence and integrity of the people we guide."
        align="center"
      />
      <WhyChooseUsGrid />
      <div className="mt-10 text-center">
        <Link
          to="/why-choose-us"
          className="group inline-flex items-center gap-2 font-semibold text-purple-700 hover:text-purple-500"
        >
          Our promise — and what we never do
          <Icon name="arrow-right" size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </Section>
  );
}

/* -------------------------------- Stats strip ------------------------------- */
function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    setDisplay(0);
    return observeOnce(el, () => {
      const start = performance.now();
      const duration = 1400;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.round(value * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, [value]);
  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

/** Animated counters — rendered only when features.showStats is true. */
export function StatsStrip({ force }: { force?: boolean }) {
  if (!siteConfig.features.showStats && !force) return null;
  const anySample = stats.some((s) => s.isSample);
  return (
    <section
      aria-label="Key figures"
      data-testid="stats-strip"
      className="on-dark bg-purple-900 py-14 text-white lg:py-16"
    >
      <div className="container-site">
        {anySample && __ENV__.DEV && (
          <p className="mb-6 text-center">
            <SampleLabel>Sample figures — replace before launch</SampleLabel>
          </p>
        )}
        <dl className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.id} className="flex flex-col-reverse">
              <dt className="mt-1 text-white/80">{s.label}</dt>
              <dd className="font-display text-4xl font-bold text-gold-400 lg:text-5xl">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* --------------------------------- CTA banner -------------------------------- */
export function CtaBanner({
  title = 'Not sure where to start? Talk to an expert — it’s free.',
  text = 'Book a no-obligation consultation. We will listen, answer your questions honestly and suggest a clear next step.',
  topic,
}: {
  title?: ReactNode;
  text?: ReactNode;
  topic?: string;
}) {
  return (
    <section aria-label="Book a consultation" className="relative bg-white py-16 lg:py-24">
      <div className="container-site">
        <Reveal className="on-dark relative isolate overflow-hidden rounded-[2rem] bg-signature-deep px-6 py-12 text-center text-white shadow-lift sm:px-12 lg:py-16">
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-16 -z-10 size-72 rounded-full bg-magenta-500/40 blur-3xl motion-safe:animate-blob"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-28 -left-10 -z-10 size-72 rounded-full bg-violet-400/35 blur-3xl"
          />
          <div aria-hidden="true" className="pattern-slash absolute inset-0 -z-10 text-white opacity-[0.06]" />
          <h2 className="mx-auto max-w-3xl text-h2 tracking-[-0.02em] text-white">{title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/90">{text}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink to={BOOK_PATH} variant="light" size="lg" arrow>
              Book a Free Consultation
            </ButtonLink>
            <ButtonLink
              to={buildWhatsAppLink(whatsAppMessageFor(topic))}
              variant="outline-light"
              size="lg"
              icon="whatsapp"
              external
            >
              Chat on WhatsApp
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------- FAQs ---------------------------------- */
export function FaqSection({
  items,
  title = 'Questions we are often asked',
  eyebrow = 'FAQ',
  headingId = 'faq-title',
  linkToAll = true,
  tone = 'surface',
}: {
  items: { id: string; q: string; a: string }[];
  title?: string;
  eyebrow?: string;
  headingId?: string;
  linkToAll?: boolean;
  tone?: 'surface' | 'white';
}) {
  return (
    <Section tone={tone} labelledBy={headingId}>
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeading id={headingId} eyebrow={eyebrow} title={title} className="lg:mb-6" />
          {linkToAll && (
            <Reveal index={1}>
              <p className="text-muted">Can’t find your answer? We are happy to help.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink to="/faq" variant="secondary" arrow>
                  View all FAQs
                </ButtonLink>
                <ButtonLink to="/contact" variant="ghost">
                  Contact us
                </ButtonLink>
              </div>
            </Reveal>
          )}
        </div>
        <Reveal index={1}>
          <Accordion single items={items.map((f) => ({ id: `faq-${f.id}`, title: f.q, content: <p>{f.a}</p> }))} />
        </Reveal>
      </div>
    </Section>
  );
}

/** Honesty note banner used across pages ("we never guarantee…"). */
export function EthicsNote({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-card border border-trust-600/20 bg-trust-600/5 p-5 text-small text-ink',
        className,
      )}
    >
      <Icon name="shield-check" size={22} className="mt-0.5 text-trust-600" />
      <div>
        {children ?? (
          <>
            <strong className="text-purple-900">Our ethics commitment:</strong> we provide guidance and support only. We
            never guarantee admissions, jobs or publication, and we never ghostwrite or sell authorship.{' '}
            <Link to="/disclaimer" className="font-semibold text-purple-500 underline underline-offset-2">
              Read our disclaimer
            </Link>
            .
          </>
        )}
      </div>
    </div>
  );
}
