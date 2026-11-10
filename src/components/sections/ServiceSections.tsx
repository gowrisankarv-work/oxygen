import { services, type Service } from '@/content/services';
import { audiences } from '@/content/audiences';
import { images } from '@/config/images';
import { Link } from '@/router/router';
import { Icon } from '@/components/icons/Icon';
import { Card, Section, SectionHeading } from '@/components/ui/Layout';
import { Reveal } from '@/components/ui/Reveal';
import { Tabs } from '@/components/ui/Tabs';
import { CheckList } from '@/components/ui/ShieldList';
import { ButtonLink } from '@/components/ui/Button';
import { Img } from '@/components/ui/Img';
import { BOOK_PATH } from '@/content/navigation';

/** Navy service band echoing the promotional design: gold line icons, white bold labels. */
export function ServiceBand() {
  return (
    <section aria-label="Our services" className="on-dark relative bg-navy-800">
      <div
        aria-hidden="true"
        className="pattern-slash pointer-events-none absolute inset-0 text-white opacity-[0.04]"
      />
      <ul className="container-site relative grid grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <li
            key={s.slug}
            className="border-white/10 [&:nth-child(-n+2)]:border-b lg:[&:nth-child(-n+2)]:border-b-0 [&:nth-child(odd)]:border-r lg:border-r lg:last:border-r-0"
          >
            <Link
              to={`/services/${s.slug}`}
              className="group flex h-full flex-col items-center gap-3 px-3 py-8 text-center transition-transform duration-300 ease-premium hover:-translate-y-1 sm:px-4 lg:flex-row lg:gap-4 lg:py-9 lg:text-left"
            >
              <Reveal
                as="span"
                index={i}
                className="grid size-14 shrink-0 place-items-center rounded-2xl border border-gold-400/40 text-gold-400 transition-colors group-hover:bg-gold-400/10"
              >
                <Icon name={s.icon} size={28} />
              </Reveal>
              <span>
                <span className="block font-display text-base font-bold text-white sm:text-lg">{s.title}</span>
                <span className="mt-1 hidden text-small text-white/80 lg:block">Learn more →</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Premium service card (home grid + related services). */
export function ServiceCard({
  service,
  index = 0,
  headingLevel: H = 'h3',
}: {
  service: Service;
  index?: number;
  headingLevel?: 'h2' | 'h3';
}) {
  return (
    <Reveal as="li" index={index} className="h-full">
      <Card interactive as="article" className="flex h-full flex-col">
        <span className="mb-6 grid size-14 place-items-center rounded-2xl bg-[linear-gradient(135deg,rgb(74_20_134/0.12),rgb(214_31_140/0.12))] text-purple-700 transition-transform duration-300 ease-premium group-hover:rotate-[-8deg]">
          <Icon name={service.icon} size={28} />
        </span>
        <H className="text-h3">{service.title}</H>
        <p className="mt-3 text-muted">{service.summary}</p>
        <CheckList items={service.highlights} className="mt-5 text-small" />
        <Link
          to={`/services/${service.slug}`}
          className="mt-auto inline-flex items-center gap-1.5 pt-6 font-semibold text-purple-700 after:absolute after:inset-0 after:rounded-card after:content-[''] hover:text-purple-500"
        >
          Learn more<span className="sr-only"> about {service.title}</span>
          <Icon name="arrow-right" size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </Card>
    </Reveal>
  );
}

export function ServiceGrid() {
  return (
    <Section tone="surface" labelledBy="services-title">
      <SectionHeading
        id="services-title"
        eyebrow="What we do"
        title="Four services, one goal: your progress"
        description="Whether you are choosing a course, a career, a research question or a journal, we bring expertise and integrity to every step."
        align="center"
      />
      <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {services.map((s, i) => (
          <ServiceCard key={s.slug} service={s} index={i} />
        ))}
      </ul>
    </Section>
  );
}

export function AboutPreview() {
  return (
    <Section labelledBy="about-preview-title">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative grid grid-cols-5 grid-rows-5 gap-4">
          <div className="col-span-3 row-span-5 overflow-hidden rounded-card shadow-soft">
            <Img asset={images.aboutTeam} className="h-full w-full object-cover" />
          </div>
          <div className="col-span-2 row-span-3 overflow-hidden rounded-card shadow-soft">
            <Img asset={images.aboutLibrary} className="h-full w-full object-cover" />
          </div>
          <div className="col-span-2 row-span-2 overflow-hidden rounded-card shadow-soft">
            <Img asset={images.aboutLab} className="h-full w-full object-cover" />
          </div>
          <div
            aria-hidden="true"
            className="absolute -bottom-6 -left-6 -z-10 size-40 rounded-full bg-signature opacity-20 blur-2xl"
          />
        </Reveal>
        <div>
          <SectionHeading
            id="about-preview-title"
            eyebrow="About Oxygen Edu-Hub"
            title="Guidance that helps you breathe easier — and rise"
            className="mb-6 lg:mb-6"
          />
          <Reveal index={1}>
            <p className="text-muted">
              Every important academic decision deserves honest, informed guidance. We bring together counsellors,
              researchers and editors who listen first, explain your options clearly and stay with you until the work is
              done — without shortcuts and without false promises.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {['Student-first', 'Ethical by default', 'Expert-led'].map((chip) => (
                <li
                  key={chip}
                  className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-small font-semibold text-purple-900 ring-1 ring-purple-700/10"
                >
                  <Icon name="shield-check" size={16} className="text-trust-600" />
                  {chip}
                </li>
              ))}
            </ul>
            <Link
              to="/about"
              className="group mt-8 inline-flex items-center gap-2 font-semibold text-purple-700 hover:text-purple-500"
            >
              Learn more about us
              <Icon name="arrow-right" size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

export function AudienceTabs() {
  return (
    <Section labelledBy="audience-title">
      <SectionHeading
        id="audience-title"
        eyebrow="Who we help"
        title="Support that fits where you are"
        description="Different stages, different questions. Choose yours to see how we can help."
        align="center"
      />
      <Reveal>
        <Tabs
          label="Who we help"
          listClassName="justify-start sm:justify-center"
          items={audiences.map((a) => ({
            id: a.id,
            label: a.label,
            content: (
              <div className="grid items-center gap-8 rounded-card border border-line bg-white p-6 shadow-card sm:p-10 lg:grid-cols-[auto_1fr_auto] lg:gap-12">
                <span className="grid size-20 place-items-center rounded-3xl bg-signature text-white shadow-soft">
                  <Icon name={a.icon} size={38} />
                </span>
                <div>
                  <h3 className="text-h3">{a.label}</h3>
                  <p className="mt-2 text-muted">{a.intro}</p>
                  <CheckList items={a.points} className="mt-5" />
                </div>
                <div className="flex flex-col gap-2 lg:min-w-56">
                  <p className="eyebrow text-muted">Suggested services</p>
                  {a.services.map((slug) => {
                    const s = services.find((x) => x.slug === slug);
                    return s ? (
                      <Link
                        key={slug}
                        to={`/services/${slug}`}
                        className="group inline-flex items-center gap-2 font-semibold text-purple-700 hover:text-purple-500"
                      >
                        <Icon name={s.icon} size={18} />
                        {s.title}
                        <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    ) : null;
                  })}
                  <ButtonLink to={`${BOOK_PATH}?service=${a.services[0]}`} size="sm" className="mt-3 self-start">
                    Talk to an expert
                  </ButtonLink>
                </div>
              </div>
            ),
          }))}
        />
      </Reveal>
    </Section>
  );
}
