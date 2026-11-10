import { siteConfig } from '@/config/site.config';
import { testimonials, type Testimonial } from '@/content/testimonials';
import { getService } from '@/content/services';
import { Link } from '@/router/router';
import { Icon } from '@/components/icons/Icon';
import { Section, SectionHeading, SampleLabel } from '@/components/ui/Layout';
import { Carousel } from '@/components/ui/Carousel';
import { Reveal } from '@/components/ui/Reveal';

export function TestimonialCard({ t }: { t: Testimonial }) {
  const service = getService(t.service);
  const initials = t.name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2);
  return (
    <figure className="flex h-full flex-col rounded-card border border-line bg-white p-6 shadow-card lg:p-7">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Icon name="quote" size={30} className="text-violet-400" />
        {t.isSample ? (
          <SampleLabel>Sample testimonial</SampleLabel>
        ) : t.rating ? (
          <span className="flex gap-0.5 text-gold-400" aria-label={`${t.rating} out of 5 stars`}>
            {Array.from({ length: t.rating }).map((_, i) => (
              <Icon key={i} name="star" size={16} className="fill-current" />
            ))}
          </span>
        ) : null}
      </div>
      <blockquote className="flex-1 text-ink">
        <p>“{t.quote}”</p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        <span
          aria-hidden="true"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-signature-deep font-display text-sm font-bold text-white"
        >
          {initials}
        </span>
        <span className="min-w-0">
          <span className="block font-semibold text-purple-900">{t.name}</span>
          <span className="block text-small text-muted">
            {t.role} · {t.city}
          </span>
        </span>
        {service && (
          <span className="ml-auto hidden text-xs font-semibold text-purple-500 sm:inline" title={service.title}>
            <Icon name={service.icon} size={20} label={service.title} />
          </span>
        )}
      </figcaption>
    </figure>
  );
}

/** Home testimonials carousel — rendered only when features.showTestimonials is true. */
export function TestimonialCarousel() {
  if (!siteConfig.features.showTestimonials || testimonials.length === 0) return null;
  const anySample = testimonials.some((t) => t.isSample);
  return (
    <Section tone="surface" labelledBy="testimonials-title" className="overflow-hidden">
      <SectionHeading
        id="testimonials-title"
        eyebrow="Testimonials"
        title="In their words"
        description={
          anySample
            ? 'Sample testimonials shown for layout only — genuine client stories will appear here with their consent.'
            : 'What students, parents and researchers say about working with us.'
        }
        align="center"
      />
      <Reveal>
        <Carousel
          label="Testimonials"
          slides={testimonials.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        />
      </Reveal>
      <div className="mt-8 text-center">
        <Link
          to="/testimonials"
          className="group inline-flex items-center gap-2 font-semibold text-purple-700 hover:text-purple-500"
        >
          Read more stories
          <Icon name="arrow-right" size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </Section>
  );
}
