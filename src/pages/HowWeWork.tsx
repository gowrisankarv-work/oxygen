import { processSteps, turnaround, channels } from '@/content/process';
import { PageHero } from '@/components/layout/PageHero';
import { Card, Section, SectionHeading } from '@/components/ui/Layout';
import { Reveal } from '@/components/ui/Reveal';
import { CheckList, ShieldList } from '@/components/ui/ShieldList';
import { Icon } from '@/components/icons/Icon';
import { CtaBanner } from '@/components/sections/SharedSections';
import { ButtonLink } from '@/components/ui/Button';
import { Link } from '@/router/router';

export default function HowWeWork() {
  return (
    <>
      <PageHero
        eyebrow="Our approach"
        title="How we work with you"
        subtitle="A clear, five-stage process with written plans, transparent fees and honest communication — so you always know what happens next."
      >
        <ButtonLink to="/book-consultation" arrow>
          Start with a free consultation
        </ButtonLink>
      </PageHero>

      <Section labelledBy="steps-title">
        <SectionHeading id="steps-title" eyebrow="The process" title="Five stages, no surprises" align="center" />
        <ol className="mx-auto max-w-5xl space-y-6">
          {processSteps.map((step, i) => (
            <Reveal as="li" key={step.title} index={i % 3}>
              <Card className="grid gap-6 md:grid-cols-[auto_1fr_minmax(0,18rem)] md:items-start md:gap-8">
                <div className="flex items-center gap-4 md:flex-col md:items-center">
                  <span className="grid size-16 place-items-center rounded-2xl bg-signature text-white shadow-soft">
                    <Icon name={step.icon} size={30} />
                  </span>
                  <span className="eyebrow text-purple-500">Step {i + 1}</span>
                </div>
                <div>
                  <h2 className="text-h3">{step.title}</h2>
                  <p className="mt-2 text-muted">{step.detail}</p>
                </div>
                <div className="rounded-xl bg-surface p-4">
                  <p className="mb-2 text-small font-semibold text-purple-900">What to expect</p>
                  <CheckList items={step.expect} className="text-small" />
                </div>
              </Card>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section tone="surface" labelledBy="turnaround-title">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              id="turnaround-title"
              eyebrow="Turnaround"
              title="Typical response and turnaround times"
              description="Indicative timings — your written plan confirms the exact schedule for your engagement."
              className="lg:mb-8"
            />
            <Reveal>
              <dl className="divide-y divide-line overflow-hidden rounded-card border border-line bg-white">
                {turnaround.map((t) => (
                  <div
                    key={t.label}
                    className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <dt className="text-ink">{t.label}</dt>
                    <dd className="font-semibold text-purple-700">{t.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
          <div>
            <SectionHeading
              eyebrow="Staying in touch"
              title="Communication channels"
              description="We agree your preferred channels at the start and keep a written record of all feedback."
              className="lg:mb-8"
              level="h2"
            />
            <ul className="grid gap-4 sm:grid-cols-2">
              {channels.map((c, i) => (
                <Reveal as="li" key={c.title} index={i}>
                  <Card className="h-full p-5 lg:p-5">
                    <Icon name={c.icon} size={24} className="text-purple-700" />
                    <h3 className="mt-3 font-display font-semibold text-purple-900">{c.title}</h3>
                    <p className="mt-1 text-small text-muted">{c.text}</p>
                  </Card>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section labelledBy="confidentiality-title">
        <Reveal className="mx-auto grid max-w-5xl items-center gap-8 rounded-[2rem] bg-navy-800 p-8 text-white shadow-lift on-dark md:grid-cols-[auto_1fr] lg:p-12">
          <span className="grid size-20 place-items-center rounded-3xl bg-white/10 text-gold-400">
            <Icon name="lock" size={40} />
          </span>
          <div>
            <h2 id="confidentiality-title" className="text-h2 tracking-[-0.02em] text-white">
              Confidentiality &amp; data handling
            </h2>
            <ShieldList
              onDark
              className="mt-6"
              items={[
                'Your documents, drafts and data are seen only by the people working with you.',
                'We never upload confidential work to public AI tools or share it without permission.',
                'Files are shared through secure channels and can be deleted on request when work is complete.',
                'We collect only the personal data we need, as explained in our Privacy Policy.',
              ]}
            />
            <p className="mt-6 text-white/80">
              Read our{' '}
              <Link to="/privacy-policy" className="font-semibold text-gold-400 underline underline-offset-2">
                Privacy Policy
              </Link>{' '}
              for full details of how we handle personal data.
            </p>
          </div>
        </Reveal>
      </Section>

      <CtaBanner />
    </>
  );
}
