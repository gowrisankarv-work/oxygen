import { siteConfig } from '@/config/site.config';
import { images } from '@/config/images';
import { values, vision, mission } from '@/content/values';
import { team } from '@/content/team';
import { PageHero } from '@/components/layout/PageHero';
import { Card, Section, SectionHeading, SampleLabel } from '@/components/ui/Layout';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/icons/Icon';
import { WhyChooseUsGrid, CtaBanner, EthicsNote } from '@/components/sections/SharedSections';
import { Link } from '@/router/router';

function Initials({ name, size = 'lg' }: { name: string; size?: 'lg' | 'xl' }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={
        size === 'xl'
          ? 'grid size-40 place-items-center rounded-full bg-signature font-display text-5xl font-bold text-white shadow-lift'
          : 'grid size-20 place-items-center rounded-full bg-signature font-display text-2xl font-bold text-white shadow-soft'
      }
    >
      {initials}
    </span>
  );
}

export default function About() {
  const { founder } = siteConfig.people;
  const showFounder = siteConfig.features.showFounder && founder.message.length > 0;
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Fuel for every stage of your academic journey"
        subtitle="Oxygen Edu-Hub is an academic services and education consultancy helping students, parents, researchers and faculty make informed decisions — and do their best, most honest work."
        image={images.aboutTeam}
      />

      {/* Introduction & story */}
      <Section labelledBy="story-title">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              id="story-title"
              eyebrow="Our story"
              title="Why we started Oxygen Edu-Hub"
              className="lg:mb-8"
            />
            <Reveal className="space-y-4 text-muted">
              {/* PLACEHOLDER narrative — edit to tell the real company story */}
              <p>
                Oxygen Edu-Hub began with a simple observation: the most important academic decisions — which course,
                which career, which research question, which journal — are often made with the least reliable advice.
              </p>
              <p>
                Students rely on hearsay. Parents are offered guarantees nobody can keep. Research scholars struggle
                alone with methodology, and good papers end up in questionable journals. We believed there had to be a
                better, more honest way.
              </p>
              <p>
                So we brought together counsellors, researchers and editors under one roof, with one shared rule: guide
                people well, tell them the truth, and never take shortcuts that put their future at risk. Like oxygen,
                good guidance is easy to overlook — until you realise how much everything else depends on it.
              </p>
            </Reveal>
          </div>
          <div className="grid gap-6 self-start sm:grid-cols-2 lg:grid-cols-1">
            <Reveal index={1}>
              <Card className="h-full">
                <span className="mb-4 grid size-12 place-items-center rounded-xl bg-surface text-purple-700">
                  <Icon name="eye" size={24} />
                </span>
                <h3 className="text-h3">Our vision</h3>
                <p className="mt-2 text-muted">{vision}</p>
              </Card>
            </Reveal>
            <Reveal index={2}>
              <Card className="h-full">
                <span className="mb-4 grid size-12 place-items-center rounded-xl bg-surface text-purple-700">
                  <Icon name="target" size={24} />
                </span>
                <h3 className="text-h3">Our mission</h3>
                <p className="mt-2 text-muted">{mission}</p>
              </Card>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section tone="surface" labelledBy="values-title">
        <SectionHeading
          id="values-title"
          eyebrow="Core values"
          title="The principles behind every session"
          align="center"
        />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <Reveal as="li" key={v.title} index={i}>
              <Card interactive className="h-full">
                <span className="mb-5 grid size-12 place-items-center rounded-xl bg-signature text-white shadow-soft transition-transform duration-300 group-hover:rotate-[-6deg]">
                  <Icon name={v.icon} size={24} />
                </span>
                <h3 className="font-display text-lg font-semibold text-purple-900">{v.title}</h3>
                <p className="mt-2 text-muted">{v.text}</p>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* What makes us different */}
      <Section labelledBy="different-title">
        <SectionHeading
          id="different-title"
          eyebrow="What makes us different"
          title="Expertise, honesty and genuine care"
          description="We are deliberately different from consultancies that sell guarantees. Here is what you can expect from us."
          align="center"
        />
        <WhyChooseUsGrid />
      </Section>

      {/* Founder message */}
      {showFounder && (
        <Section tone="surface" labelledBy="founder-title">
          <Reveal className="mx-auto grid max-w-5xl items-center gap-10 rounded-[2rem] border border-line bg-white p-8 shadow-card md:grid-cols-[auto_1fr] lg:p-12">
            <div className="flex flex-col items-center text-center">
              {founder.photo ? (
                <img
                  src={founder.photo}
                  alt={founder.name}
                  width={160}
                  height={160}
                  loading="lazy"
                  className="size-40 rounded-full object-cover shadow-lift"
                />
              ) : (
                <Initials name={founder.name} size="xl" />
              )}
              <p className="mt-4 font-display text-lg font-semibold text-purple-900">{founder.name}</p>
              <p className="text-small text-muted">{founder.title}</p>
            </div>
            <div>
              <p className="eyebrow mb-3 text-purple-500">A message from our founder</p>
              <h2 id="founder-title" className="text-h2 tracking-[-0.02em]">
                “Begin with a conversation.”
              </h2>
              <div className="mt-5 space-y-4 text-muted">
                {founder.message.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </Reveal>
        </Section>
      )}

      {/* Team */}
      {siteConfig.features.showTeam && team.length > 0 && (
        <Section labelledBy="team-title">
          <SectionHeading
            id="team-title"
            eyebrow="Our team"
            title="The people who will guide you"
            description="Counsellors, researchers and editors with relevant academic experience."
            align="center"
          />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <Reveal as="li" key={m.id} index={i}>
                <Card className="flex h-full flex-col items-center text-center">
                  {m.isSample && <SampleLabel className="absolute top-4 right-4">Sample</SampleLabel>}
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={m.name}
                      width={80}
                      height={80}
                      loading="lazy"
                      className="size-20 rounded-full object-cover"
                    />
                  ) : (
                    <Initials name={m.name} />
                  )}
                  <h3 className="mt-4 font-display text-lg font-semibold text-purple-900">{m.name}</h3>
                  <p className="text-small font-semibold text-purple-500">{m.role}</p>
                  <p className="mt-3 text-small text-muted">{m.bio}</p>
                  {m.linkedin && (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-grid size-10 place-items-center rounded-full bg-surface text-purple-700 hover:bg-line"
                      aria-label={`${m.name} on LinkedIn (opens in a new tab)`}
                    >
                      <Icon name="linkedin" size={18} />
                    </a>
                  )}
                </Card>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      {/* Ethics */}
      <Section tone="surface" spacing="compact" labelledBy="ethics-title">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="ethics-title" className="text-h2 tracking-[-0.02em]">
            Our commitment to ethics
          </h2>
          <p className="mt-4 text-muted">
            We provide guidance, training and review — never shortcuts. We do not guarantee admissions, jobs or
            publication; we do not ghostwrite theses or papers, sell authorship, arrange seats or work with predatory
            journals.
          </p>
          <EthicsNote className="mt-8 text-left">
            <strong className="text-purple-900">Read the full statement</strong> in our{' '}
            <Link to="/disclaimer" className="font-semibold text-purple-500 underline underline-offset-2">
              Disclaimer
            </Link>{' '}
            and see how we put it into practice on{' '}
            <Link to="/why-choose-us" className="font-semibold text-purple-500 underline underline-offset-2">
              Why Choose Us
            </Link>
            .
          </EthicsNote>
        </div>
      </Section>

      <CtaBanner />
    </>
  );
}
