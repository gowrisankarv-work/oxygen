import { siteConfig } from '@/config/site.config';
import { openings, careersEmail } from '@/content/careers';
import { values } from '@/content/values';
import { PageHero } from '@/components/layout/PageHero';
import { Badge, Card, Section, SectionHeading } from '@/components/ui/Layout';
import { Reveal } from '@/components/ui/Reveal';
import { CheckList } from '@/components/ui/ShieldList';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/icons/Icon';
import { mailtoHref } from '@/lib/phone';

export default function Careers() {
  const list = siteConfig.features.showCareers ? openings : [];
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="We’re growing — grow with us"
        subtitle="Join a team of counsellors, researchers and editors who believe good guidance should be honest, personal and expert."
      />

      <Section labelledBy="openings-title">
        <SectionHeading id="openings-title" eyebrow="Open positions" title="Current openings" />
        {list.length === 0 ? (
          <div
            className="rounded-card border border-dashed border-purple-500/30 bg-surface p-10 text-center"
            data-testid="careers-empty"
          >
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-purple-700 shadow-card">
              <Icon name="briefcase" size={28} />
            </span>
            <h3 className="mt-5 text-h3">No current openings</h3>
            <p className="mx-auto mt-2 max-w-lg text-muted">
              We are not hiring for specific roles right now, but we are always happy to hear from talented people who
              share our values.
            </p>
            <ButtonLink
              to={mailtoHref(careersEmail, 'Speculative application')}
              variant="secondary"
              icon="mail"
              className="mt-6"
            >
              Send us your CV
            </ButtonLink>
          </div>
        ) : (
          <ul className="space-y-5">
            {list.map((o, i) => (
              <Reveal as="li" key={o.id} index={i}>
                <Card className="grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-h3">{o.title}</h3>
                      <Badge>{o.type}</Badge>
                      <Badge tone="gold">{o.location}</Badge>
                    </div>
                    <p className="mt-3 text-muted">{o.summary}</p>
                    <CheckList items={o.requirements} className="mt-4 text-small" />
                  </div>
                  <ButtonLink to={mailtoHref(careersEmail, `Application: ${o.title}`)} icon="send">
                    Apply by email
                  </ButtonLink>
                </Card>
              </Reveal>
            ))}
          </ul>
        )}
      </Section>

      <Section tone="surface" labelledBy="culture-title">
        <SectionHeading
          id="culture-title"
          eyebrow="Life at Oxygen Edu-Hub"
          title="What we value in our team"
          align="center"
        />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <Reveal as="li" key={v.title} index={i}>
              <Card className="h-full">
                <Icon name={v.icon} size={26} className="text-purple-700" />
                <h3 className="mt-3 font-display text-lg font-semibold text-purple-900">{v.title}</h3>
                <p className="mt-1.5 text-small text-muted">{v.text}</p>
              </Card>
            </Reveal>
          ))}
        </ul>
        <p className="mx-auto mt-10 max-w-2xl text-center text-small text-muted">
          {siteConfig.shortName} is an equal-opportunity employer. We never charge candidates any fee during hiring —
          please report any request for payment made in our name.
        </p>
      </Section>
    </>
  );
}
