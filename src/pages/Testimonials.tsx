import { useState } from 'react';
import { siteConfig } from '@/config/site.config';
import { testimonials } from '@/content/testimonials';
import { services } from '@/content/services';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Layout';
import { Tabs } from '@/components/ui/Tabs';
import { TestimonialCard } from '@/components/sections/TestimonialSections';
import { CtaBanner } from '@/components/sections/SharedSections';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/icons/Icon';
import { mailtoHref } from '@/lib/phone';

export default function Testimonials() {
  const [tab, setTab] = useState('all');
  const anySample = testimonials.some((t) => t.isSample);
  const tabs = [{ id: 'all', label: 'All' }, ...services.map((s) => ({ id: s.slug, label: s.title }))];

  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="Experiences from the people we guide"
        subtitle="Stories from students, parents, research scholars and faculty who have worked with us."
      />
      <Section labelledBy="stories-title">
        <h2 id="stories-title" className="sr-only">
          Testimonials by service
        </h2>
        {anySample && (
          <div className="mb-10 flex items-start gap-3 rounded-card border border-error-600/25 bg-white p-5 text-small text-ink">
            <Icon name="info" size={20} className="mt-0.5 text-error-600" />
            <p>
              <strong className="text-purple-900">Please note:</strong> the testimonials below are samples used to
              demonstrate the layout. They are not statements from real clients and will be replaced with genuine,
              consented testimonials.
            </p>
          </div>
        )}
        {!siteConfig.features.showTestimonials ? (
          <p className="text-muted">Testimonials will be published here soon.</p>
        ) : (
          <Tabs
            label="Filter testimonials by service"
            value={tab}
            onValueChange={setTab}
            items={tabs.map((t) => ({
              id: t.id,
              label: t.label,
              content: (
                <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {testimonials
                    .filter((x) => t.id === 'all' || x.service === t.id)
                    .map((x) => (
                      <li key={x.id}>
                        <TestimonialCard t={x} />
                      </li>
                    ))}
                </ul>
              ),
            }))}
          />
        )}
        <div className="mt-14 flex flex-col items-center gap-4 rounded-card bg-surface p-8 text-center">
          <h2 className="text-h3">Worked with us? Share your experience</h2>
          <p className="max-w-xl text-muted">
            Your story helps others make better decisions. We only publish testimonials with your written consent.
          </p>
          <ButtonLink
            to={mailtoHref(
              siteConfig.contact.email,
              'My experience with Oxygen Edu-Hub',
              'Hello Oxygen Edu-Hub team,\n\nHere is my experience:\n\n',
            )}
            variant="secondary"
            icon="mail"
          >
            Share your experience
          </ButtonLink>
        </div>
      </Section>
      <CtaBanner />
    </>
  );
}
