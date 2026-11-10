import { services } from '@/content/services';
import { serviceFinder } from '@/content/audiences';
import { images } from '@/config/images';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Layout';
import { Reveal } from '@/components/ui/Reveal';
import { CheckList } from '@/components/ui/ShieldList';
import { ButtonLink } from '@/components/ui/Button';
import { Img } from '@/components/ui/Img';
import { Icon } from '@/components/icons/Icon';
import { CtaBanner, EthicsNote } from '@/components/sections/SharedSections';
import { Link } from '@/router/router';
import { cn } from '@/lib/cn';

export default function Services() {
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="Expert support for every academic turning point"
        subtitle="Four focused services — admissions, careers, research and publication — delivered one-to-one, with transparent scope and a firm commitment to ethics."
      >
        <ButtonLink to="/book-consultation" arrow>
          Book a Free Consultation
        </ButtonLink>
      </PageHero>

      <Section labelledBy="services-list-title">
        <h2 id="services-list-title" className="sr-only">
          All services
        </h2>
        <div className="space-y-20 lg:space-y-28">
          {services.map((s, i) => (
            <article key={s.slug} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal className={cn('relative', i % 2 === 1 && 'lg:order-2')}>
                <div aria-hidden="true" className="absolute inset-8 -z-10 bg-signature opacity-25 blur-3xl" />
                <Img asset={images[s.image]} className="w-full rounded-[2rem] shadow-lift" />
              </Reveal>
              <Reveal index={1}>
                <span className="mb-5 inline-grid size-14 place-items-center rounded-2xl bg-signature text-white shadow-soft">
                  <Icon name={s.icon} size={28} />
                </span>
                <h3 className="text-h2 tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-4 text-body text-muted">{s.summary}</p>
                <CheckList items={s.included.slice(0, 6).map((f) => f.title)} columns={2} className="mt-6 text-small" />
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink to={`/services/${s.slug}`} arrow>
                    Explore {s.title}
                  </ButtonLink>
                  <a
                    href={`/book-consultation/?service=${s.slug}`}
                    data-enquire=""
                    data-service={s.slug}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full px-5 font-semibold text-purple-700 hover:bg-surface"
                  >
                    Enquire now
                  </a>
                </div>
              </Reveal>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="surface" labelledBy="finder-title">
        <SectionHeading
          id="finder-title"
          eyebrow="Quick guide"
          title="Which service do I need?"
          description="Find the statement that sounds most like you. Still unsure? A free consultation will point you in the right direction."
          align="center"
        />
        <ul className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
          {serviceFinder.map((f, i) => {
            const s = services.find((x) => x.slug === f.service);
            if (!s) return null;
            return (
              <Reveal as="li" key={f.need} index={i}>
                <Link
                  to={`/services/${s.slug}`}
                  className="group flex h-full items-start gap-4 rounded-card border border-line bg-white p-6 shadow-card transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-lift"
                >
                  <Icon name="message-circle" size={24} className="mt-1 text-violet-400" />
                  <span className="flex-1">
                    <span className="block text-ink">“{f.need}”</span>
                    <span className="mt-3 inline-flex items-center gap-2 font-semibold text-purple-700">
                      <Icon name={s.icon} size={18} />
                      {s.title}
                      <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
        <EthicsNote className="mx-auto mt-10 max-w-5xl" />
      </Section>

      <CtaBanner />
    </>
  );
}
