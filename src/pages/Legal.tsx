import { siteConfig } from '@/config/site.config';
import { legalDocs, type LegalDoc } from '@/content/legal';
import { useRouteMatch } from '@/router/router';
import { PageHero } from '@/components/layout/PageHero';
import { RichText } from '@/components/sections/RichText';
import { Icon } from '@/components/icons/Icon';
import { formatDate } from '@/components/sections/ArticleSections';
import NotFound from './NotFound';

/** Shared template for Privacy, Terms, Refund and Disclaimer pages. */
export default function Legal() {
  const { route } = useRouteMatch();
  const doc = legalDocs[route.id as LegalDoc['id']];
  if (!doc) return <NotFound />;
  const showReviewBanner = __ENV__.DEV || !siteConfig.legal.legalReviewed;

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={doc.title}
        subtitle={`Last updated: ${formatDate(siteConfig.legal.lastUpdated)}`}
      />
      <div className="container-site py-12 lg:py-20">
        {showReviewBanner && (
          <div
            role="note"
            data-testid="legal-review-banner"
            className="mb-10 flex items-start gap-3 rounded-card border border-gold-400/60 bg-gold-400/10 p-5 text-small text-ink"
          >
            <Icon name="alert" size={22} className="mt-0.5 text-purple-900" />
            <p>
              <strong className="text-purple-900">
                Template — to be reviewed by the client’s legal advisor before publishing.
              </strong>{' '}
              This document is a general draft and is not legal advice.
            </p>
          </div>
        )}
        <div className="grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
          <nav
            aria-labelledby="legal-toc"
            className="lg:sticky lg:top-[calc(var(--header-h)+var(--topbar-h)+1.5rem)] lg:self-start"
          >
            <p id="legal-toc" className="mb-3 text-small font-semibold text-purple-900">
              Contents
            </p>
            <ol className="space-y-1.5 border-l-2 border-line pl-4 text-small">
              {doc.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-muted hover:text-purple-700">
                    {s.title.replace(/^\d+\.\s*/, '')}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <article className="prose-oxygen min-w-0">
            <p className="text-body">{doc.intro}</p>
            {doc.sections.map((s) => (
              <section key={s.id} aria-labelledby={s.id}>
                <h2 id={s.id}>{s.title}</h2>
                <RichText blocks={s.blocks} className="mt-4" />
              </section>
            ))}
          </article>
        </div>
      </div>
    </>
  );
}
