import { articles, type ArticleMeta } from '@/content/articles';
import { siteConfig } from '@/config/site.config';
import { Link } from '@/router/router';
import { Icon, type IconName } from '@/components/icons/Icon';
import { Badge, Section, SectionHeading } from '@/components/ui/Layout';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';

const coverStyles: Record<ArticleMeta['cover'], string> = {
  violet: 'bg-[linear-gradient(135deg,var(--brand-purple-700),var(--brand-violet-400))]',
  navy: 'bg-[linear-gradient(135deg,var(--brand-navy-800),var(--brand-blue-600))]',
  magenta: 'bg-[linear-gradient(135deg,var(--brand-purple-900),var(--brand-magenta-500))]',
  gold: 'bg-[linear-gradient(135deg,var(--brand-purple-900),var(--brand-purple-500))]',
};

const categoryIcons: Record<ArticleMeta['category'], IconName> = {
  Admissions: 'graduation-cap',
  Careers: 'compass',
  Research: 'flask',
  Publications: 'book-open',
};

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Illustrated cover (no stock photos needed): brand gradient + category icon + slash pattern. */
export function ArticleCover({
  article,
  className,
  large,
}: {
  article: ArticleMeta;
  className?: string;
  large?: boolean;
}) {
  return (
    <div aria-hidden="true" className={cn('relative isolate overflow-hidden', coverStyles[article.cover], className)}>
      <div className="pattern-slash absolute inset-0 -z-10 text-white opacity-[0.08]" />
      <div className="absolute -right-10 -bottom-12 -z-10 size-48 rounded-full bg-white/10 blur-xl" />
      <Icon
        name={categoryIcons[article.category]}
        size={large ? 120 : 72}
        strokeWidth={1.25}
        className="absolute right-6 bottom-5 text-white/85"
      />
      {article.cover === 'gold' && <span className="absolute top-6 left-6 size-3 rounded-full bg-gold-400" />}
    </div>
  );
}

export function ArticleCard({
  article,
  index = 0,
  headingLevel: H = 'h3',
}: {
  article: ArticleMeta;
  index?: number;
  headingLevel?: 'h2' | 'h3';
}) {
  const minutes = article.readingMinutes;
  return (
    <Reveal as="li" index={index} className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-premium hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-lift">
        <ArticleCover article={article} className="aspect-[16/9]" />
        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-small text-muted">
            <Badge>{article.category}</Badge>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="clock" size={14} />
              {minutes} min read
            </span>
          </div>
          <H className="mt-4 font-display text-xl leading-snug font-semibold text-purple-900">
            <Link
              to={`/resources/${article.slug}`}
              className="after:absolute after:inset-0 after:content-[''] group-hover:text-purple-500"
            >
              {article.title}
            </Link>
          </H>
          <p className="mt-3 flex-1 text-small text-muted">{article.excerpt}</p>
          <p className="mt-5 text-small text-muted">
            <time dateTime={article.date}>{formatDate(article.date)}</time>
          </p>
        </div>
      </article>
    </Reveal>
  );
}

export function ResourcesPreview() {
  if (!siteConfig.features.showBlog || articles.length === 0) return null;
  return (
    <Section labelledBy="resources-title">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          id="resources-title"
          eyebrow="Resources & insights"
          title="Practical guides from our mentors"
          description="Clear, honest advice on courses, applications, research and publishing."
          className="lg:mb-14"
        />
        <Link
          to="/resources"
          className="group mb-10 inline-flex shrink-0 items-center gap-2 font-semibold text-purple-700 hover:text-purple-500 lg:mb-14"
        >
          View all resources
          <Icon name="arrow-right" size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 3).map((a, i) => (
          <ArticleCard key={a.slug} article={a} index={i} />
        ))}
      </ul>
    </Section>
  );
}
