import { useId, useMemo, useState } from 'react';
import { faqs, faqCategories } from '@/content/faqs';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Layout';
import { Accordion } from '@/components/ui/Accordion';
import { Icon } from '@/components/icons/Icon';
import { CtaBanner } from '@/components/sections/SharedSections';
import { Link } from '@/router/router';
import { renderInline } from '@/components/sections/RichText';

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Turns "Privacy Policy" / "Refund & Cancellation Policy" mentions into links. */
function linkify(answer: string): string {
  return answer
    .replace('Refund & Cancellation Policy', '[Refund & Cancellation Policy](/refund-cancellation-policy)')
    .replace(/(?<!\[)Privacy Policy/, '[Privacy Policy](/privacy-policy)');
}

export default function Faq() {
  const [query, setQuery] = useState('');
  const id = useId();
  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () => (q ? faqs.filter((f) => `${f.q} ${f.a} ${f.category}`.toLowerCase().includes(q)) : faqs),
    [q],
  );

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        subtitle="Straight answers about our services, ethics, fees and how we handle your information."
      />
      <Section labelledBy={`${id}-title`}>
        <h2 id={`${id}-title`} className="sr-only">
          Questions and answers
        </h2>
        <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14">
          <aside className="lg:sticky lg:top-[calc(var(--header-h)+var(--topbar-h)+1.5rem)] lg:self-start">
            <div className="relative">
              <label htmlFor={`${id}-search`} className="mb-2 block text-small font-semibold text-purple-900">
                Search FAQs
              </label>
              <Icon name="search" size={18} className="pointer-events-none absolute bottom-3.5 left-4 text-muted" />
              <input
                id={`${id}-search`}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. refund, thesis, SOP"
                aria-controls={`${id}-results`}
                className="block min-h-12 w-full rounded-input border border-line bg-white py-3 pr-4 pl-11 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/15 focus:outline-none"
              />
            </div>
            <nav aria-label="FAQ categories" className="mt-8 hidden lg:block">
              <p className="mb-3 text-small font-semibold text-purple-900">Categories</p>
              <ul className="space-y-1">
                {faqCategories.map((c) => (
                  <li key={c}>
                    <a
                      href={`#${slugify(c)}`}
                      className="block rounded-lg px-3 py-2 text-small text-muted hover:bg-surface hover:text-purple-700"
                    >
                      {c}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div id={`${id}-results`}>
            <p aria-live="polite" className="mb-6 text-small text-muted" data-testid="faq-count">
              {q
                ? `${filtered.length} ${filtered.length === 1 ? 'question matches' : 'questions match'} “${query.trim()}”`
                : `${faqs.length} questions in ${faqCategories.length} categories`}
            </p>
            {filtered.length === 0 ? (
              <div className="rounded-card border border-line bg-surface p-8 text-center">
                <p className="font-display text-lg font-semibold text-purple-900">No questions match your search</p>
                <p className="mt-2 text-muted">
                  Try a different word, or{' '}
                  <Link to="/contact" className="font-semibold text-purple-500 underline underline-offset-2">
                    ask us directly
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {faqCategories.map((c) => {
                  const items = filtered.filter((f) => f.category === c);
                  if (items.length === 0) return null;
                  return (
                    <section key={c} aria-labelledby={slugify(c)}>
                      <h3 id={slugify(c)} className="mb-4 scroll-mt-32 text-h3">
                        {c}
                      </h3>
                      <Accordion
                        headingLevel="h4"
                        items={items.map((f) => ({
                          id: `faq-${f.id}`,
                          title: f.q,
                          content: <p>{renderInline(linkify(f.a))}</p>,
                        }))}
                      />
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Section>
      <CtaBanner title="Still have a question? Ask an expert — it’s free." />
    </>
  );
}
