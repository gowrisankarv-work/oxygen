import { promises } from '@/content/whyChooseUs';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Layout';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/icons/Icon';
import { WhyChooseUsGrid, StatsStrip, CtaBanner } from '@/components/sections/SharedSections';
import { ButtonLink } from '@/components/ui/Button';

export default function WhyChooseUs() {
  return (
    <>
      <PageHero
        eyebrow="Why choose us"
        title="Guidance built on expertise and integrity"
        subtitle="There are many education consultants. Here is what makes working with Oxygen Edu-Hub different — and the lines we will never cross."
      >
        <ButtonLink to="/book-consultation" arrow>
          Book a Free Consultation
        </ButtonLink>
      </PageHero>

      <Section labelledBy="diff-title">
        <SectionHeading
          id="diff-title"
          eyebrow="Our differentiators"
          title="Six reasons people trust us"
          align="center"
        />
        <WhyChooseUsGrid detailed />
      </Section>

      <Section tone="surface" labelledBy="promise-title">
        <SectionHeading
          id="promise-title"
          eyebrow="Honesty table"
          title="Our promise vs. what we never do"
          description="Clear commitments, so you know exactly what to expect from us."
          align="center"
        />
        <Reveal className="mx-auto max-w-5xl overflow-hidden rounded-card border border-line bg-white shadow-card">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">What Oxygen Edu-Hub promises, and what it never does</caption>
            <thead>
              <tr className="bg-purple-900 text-white">
                <th scope="col" className="w-1/2 px-5 py-4 font-display font-semibold sm:px-7">
                  <span className="inline-flex items-center gap-2">
                    <Icon name="check-circle" size={20} className="text-gold-400" />
                    We promise to
                  </span>
                </th>
                <th scope="col" className="w-1/2 px-5 py-4 font-display font-semibold sm:px-7">
                  <span className="inline-flex items-center gap-2">
                    <Icon name="ban" size={20} className="text-gold-400" />
                    We never
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {promises.map((p) => (
                <tr key={p.promise} className="align-top">
                  <td className="px-5 py-4 sm:px-7">
                    <span className="flex gap-2.5">
                      <Icon name="check" size={18} className="mt-1 text-success-700" />
                      {p.promise}
                    </span>
                  </td>
                  <td className="bg-surface/60 px-5 py-4 sm:px-7">
                    <span className="flex gap-2.5">
                      <Icon name="close" size={18} className="mt-1 text-error-600" />
                      {p.never}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
        <p className="mx-auto mt-8 max-w-3xl text-center text-small text-muted">
          We never guarantee admission or acceptance. Admission, hiring and publication decisions always belong to
          institutions, employers and journals.
        </p>
      </Section>

      <StatsStrip />

      <CtaBanner title="See the difference for yourself" />
    </>
  );
}
