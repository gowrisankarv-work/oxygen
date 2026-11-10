/**
 * Shared template for the four service pages (/services/:slug).
 * Content comes from src/content/services.ts.
 */
import type { ReactNode } from 'react';
import { siteConfig } from '@/config/site.config';
import { images } from '@/config/images';
import { getService, services } from '@/content/services';
import { useParams } from '@/router/router';
import { PageHero } from '@/components/layout/PageHero';
import { Badge, Card } from '@/components/ui/Layout';
import { Reveal } from '@/components/ui/Reveal';
import { CheckList, ShieldList } from '@/components/ui/ShieldList';
import { Accordion } from '@/components/ui/Accordion';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/icons/Icon';
import { QuickEnquiry } from '@/components/forms/QuickEnquiry';
import { ServiceCard } from '@/components/sections/ServiceSections';
import { CtaBanner } from '@/components/sections/SharedSections';
import { buildWhatsAppLink, whatsAppMessageFor } from '@/lib/whatsapp';
import NotFound from './NotFound';

function Block({ id, eyebrow, title, children }: { id: string; eyebrow?: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="scroll-mt-32">
      <Reveal>
        {eyebrow && <p className="eyebrow mb-2 text-purple-500">{eyebrow}</p>}
        <h2 id={id} className="text-h2 tracking-[-0.02em]">
          {title}
        </h2>
      </Reveal>
      <div className="mt-7">{children}</div>
    </section>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getService(slug ?? '');
  if (!service) return <NotFound />;

  const included = service.included.filter((f) => !f.flag || siteConfig.features[f.flag]);
  const related = service.related.map((r) => services.find((s) => s.slug === r)).filter((s) => s !== undefined);
  const isPublication = service.slug === 'publication-services';

  return (
    <>
      <PageHero
        eyebrow="Our services"
        title={service.title}
        subtitle={service.heroSubtitle}
        image={images[service.image]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink to={`/book-consultation?service=${service.slug}`} arrow>
            Book a Free Consultation
          </ButtonLink>
          <ButtonLink
            to={buildWhatsAppLink(whatsAppMessageFor(service.whatsappTopic))}
            variant="secondary"
            icon="whatsapp"
            external
          >
            Ask on WhatsApp
          </ButtonLink>
        </div>
      </PageHero>

      <div className="container-site grid gap-14 py-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12 lg:py-24 xl:grid-cols-[minmax(0,1fr)_24rem] xl:gap-16">
        <div className="min-w-0 space-y-20">
          {/* Overview */}
          <Block id="overview" eyebrow="Overview" title={`About our ${service.title} service`}>
            <div className="space-y-4 text-muted">
              {service.overview.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Block>

          {/* Who it's for */}
          <Block id="who-its-for" eyebrow="Who it’s for" title="Designed for">
            <ul className="grid gap-4 sm:grid-cols-2">
              {service.whoFor.map((w, i) => (
                <Reveal as="li" key={w.title} index={i} className="rounded-card border border-line bg-surface p-5">
                  <h3 className="flex items-center gap-2 font-display font-semibold text-purple-900">
                    <Icon name="user" size={18} className="text-purple-500" />
                    {w.title}
                  </h3>
                  <p className="mt-1.5 text-small text-muted">{w.text}</p>
                </Reveal>
              ))}
            </ul>
          </Block>

          {/* What's included */}
          <Block id="whats-included" eyebrow="What’s included" title="How we can help">
            <ul className="grid gap-5 sm:grid-cols-2">
              {included.map((f, i) => (
                <Reveal as="li" key={f.title} index={i % 4}>
                  <Card interactive className="h-full p-5 lg:p-6">
                    <span className="mb-4 grid size-11 place-items-center rounded-xl bg-[linear-gradient(135deg,rgb(74_20_134/0.12),rgb(214_31_140/0.12))] text-purple-700 transition-transform duration-300 group-hover:rotate-[-6deg]">
                      <Icon name={f.icon} size={22} />
                    </span>
                    <h3 className="font-display text-lg font-semibold text-purple-900">
                      {f.title}
                      {f.flag && (
                        <Badge tone="gold" className="ml-2 align-middle">
                          Optional
                        </Badge>
                      )}
                    </h3>
                    <p className="mt-2 text-small text-muted">{f.text}</p>
                  </Card>
                </Reveal>
              ))}
            </ul>
          </Block>

          {/* Ethics box */}
          <Reveal>
            <div
              className={
                isPublication
                  ? 'on-dark relative overflow-hidden rounded-[1.5rem] bg-navy-800 p-7 text-white shadow-lift lg:p-9'
                  : 'rounded-[1.5rem] border border-trust-600/20 bg-trust-600/5 p-7 lg:p-9'
              }
              data-testid="service-ethics"
            >
              {isPublication && (
                <div aria-hidden="true" className="pattern-slash absolute inset-0 text-white opacity-[0.05]" />
              )}
              <div className="relative">
                <h2
                  className={
                    isPublication ? 'flex items-center gap-3 text-h3 text-white' : 'flex items-center gap-3 text-h3'
                  }
                >
                  <Icon name="shield-check" size={30} className={isPublication ? 'text-gold-400' : 'text-trust-600'} />
                  {service.ethics.title}
                </h2>
                <ShieldList items={service.ethics.points} onDark={isPublication} className="mt-5" />
              </div>
            </div>
          </Reveal>

          {/* Process */}
          <Block id="process" eyebrow="Process" title="How it works">
            <ol className="relative space-y-6 border-l-2 border-line pl-8">
              {service.process.map((step, i) => (
                <Reveal as="li" key={step.title} index={i} className="relative">
                  <span className="absolute top-0 -left-[3.05rem] grid size-10 place-items-center rounded-full bg-purple-700 font-display text-sm font-bold text-white ring-4 ring-white">
                    {i + 1}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-purple-900">{step.title}</h3>
                  <p className="mt-1 text-muted">{step.text}</p>
                </Reveal>
              ))}
            </ol>
          </Block>

          {/* Deliverables */}
          <Block id="deliverables" eyebrow="Deliverables" title="What you receive">
            <Card>
              <CheckList items={service.deliverables} columns={2} />
            </Card>
          </Block>

          {/* Engagement models */}
          <Block id="engagement" eyebrow="Engagement models" title="Choose the level of support you need">
            <ul className="grid gap-5 md:grid-cols-3">
              {service.engagement.map((m, i) => (
                <Reveal as="li" key={m.name} index={i}>
                  <Card className="h-full">
                    <span className="mb-4 grid size-10 place-items-center rounded-full bg-surface font-display text-sm font-bold text-purple-700">
                      {i + 1}
                    </span>
                    <h3 className="font-display text-xl font-semibold text-purple-900">{m.name}</h3>
                    <p className="mt-2 text-small text-muted">{m.description}</p>
                    <p className="mt-4 text-small">
                      <span className="font-semibold text-purple-900">Best for: </span>
                      <span className="text-muted">{m.bestFor}</span>
                    </p>
                    <p className="mt-5 border-t border-line pt-4 text-small font-semibold text-purple-700">
                      {siteConfig.features.showPricing
                        ? 'See pricing in your consultation plan'
                        : 'Pricing shared after consultation'}
                    </p>
                  </Card>
                </Reveal>
              ))}
            </ul>
          </Block>

          {/* FAQs */}
          <Block id="faqs" eyebrow="FAQ" title={`${service.title}: common questions`}>
            <Accordion
              single
              items={service.faqs.map((f, i) => ({ id: `faq-${i}`, title: f.q, content: <p>{f.a}</p> }))}
            />
          </Block>
        </div>

        {/* Sticky sidebar */}
        <aside
          aria-label={`Enquire about ${service.title}`}
          className="lg:sticky lg:top-[calc(var(--header-h)+var(--topbar-h)+1.5rem)] lg:self-start"
        >
          <div className="rounded-[1.5rem] border border-line bg-white p-6 shadow-lift">
            <p className="eyebrow text-purple-500">Quick enquiry</p>
            <h2 className="mt-1 font-display text-xl font-semibold text-purple-900">
              Talk to a {service.title} expert
            </h2>
            <p className="mt-2 mb-5 text-small text-muted">{siteConfig.contact.responseTime}</p>
            <QuickEnquiry service={service.slug} source={`Service page: ${service.title}`} compact />
            <div className="mt-5 border-t border-line pt-5">
              <ButtonLink
                to={buildWhatsAppLink(whatsAppMessageFor(service.whatsappTopic))}
                variant="whatsapp"
                icon="whatsapp"
                fullWidth
                external
              >
                Chat on WhatsApp
              </ButtonLink>
            </div>
          </div>
        </aside>
      </div>

      {/* Related services */}
      <section aria-labelledby="related-title" className="bg-surface py-16 lg:py-24">
        <div className="container-site">
          <h2 id="related-title" className="text-h2 tracking-[-0.02em]">
            Related services
          </h2>
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {related.map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} />
            ))}
          </ul>
        </div>
      </section>

      <CtaBanner
        title={`Ready to talk about ${service.title.toLowerCase()}?`}
        text="Book a free, no-obligation consultation. We will understand your situation and suggest a clear next step."
        topic={service.whatsappTopic}
      />
    </>
  );
}
