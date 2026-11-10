import { useState } from 'react';
import { images } from '@/config/images';
import { services } from '@/content/services';
import { faqs } from '@/content/faqs';
import { articles } from '@/content/articles';
import { Link, useNavigate } from '@/router/router';
import { ButtonLink } from '@/components/ui/Button';
import { Img } from '@/components/ui/Img';
import { Icon } from '@/components/icons/Icon';

const popular = [
  { label: 'Our services', to: '/services' },
  { label: 'Book a free consultation', to: '/book-consultation' },
  { label: 'Frequently asked questions', to: '/faq' },
  { label: 'Contact us', to: '/contact' },
];

export default function NotFound() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();
  const suggestions = query
    ? [
        ...services
          .filter((s) => `${s.title} ${s.tagline}`.toLowerCase().includes(query))
          .map((s) => ({ label: s.title, to: `/services/${s.slug}` })),
        ...articles
          .filter((a) => a.title.toLowerCase().includes(query))
          .map((a) => ({ label: a.title, to: `/resources/${a.slug}` })),
        ...(faqs.some((f) => `${f.q} ${f.a}`.toLowerCase().includes(query))
          ? [{ label: `FAQs mentioning “${q.trim()}”`, to: '/faq' }]
          : []),
      ].slice(0, 6)
    : [];

  return (
    <section className="relative overflow-hidden bg-surface pt-[calc(var(--header-h)+var(--topbar-h)+3rem)] pb-20 lg:pt-[calc(var(--header-h)+var(--topbar-h)+5rem)] lg:pb-28">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow text-purple-500">Error 404</p>
          <h1 className="mt-3 text-h1 tracking-[-0.02em]">We couldn’t find that page</h1>
          <p className="mt-4 max-w-lg text-body text-muted">
            The link may be broken or the page may have moved. Try searching below, or pick one of our most visited
            pages.
          </p>
          <form
            role="search"
            className="mt-8 max-w-lg"
            onSubmit={(e) => {
              e.preventDefault();
              const first = suggestions[0];
              if (first) void navigate(first.to);
            }}
          >
            <label htmlFor="nf-search" className="mb-2 block text-small font-semibold text-purple-900">
              Search our site
            </label>
            <div className="relative">
              <Icon
                name="search"
                size={18}
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
              />
              <input
                id="nf-search"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="e.g. admission, research, journal"
                className="block min-h-12 w-full rounded-full border border-line bg-white py-3 pr-4 pl-11 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/15 focus:outline-none"
              />
            </div>
            {query && (
              <ul className="mt-3 space-y-1 rounded-card border border-line bg-white p-2" aria-live="polite">
                {suggestions.length === 0 ? (
                  <li className="px-3 py-2 text-small text-muted">No matches — try one of the popular pages below.</li>
                ) : (
                  suggestions.map((s) => (
                    <li key={s.to + s.label}>
                      <Link
                        to={s.to}
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-ink hover:bg-surface"
                      >
                        {s.label}
                        <Icon name="arrow-right" size={16} className="text-purple-500" />
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            )}
          </form>
          <h2 className="mt-10 text-small font-semibold text-purple-900">Popular pages</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {popular.map((p) => (
              <li key={p.to}>
                <Link
                  to={p.to}
                  className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-4 text-small font-semibold text-purple-700 hover:border-purple-500"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink to="/" className="mt-10" arrow>
            Back to home
          </ButtonLink>
        </div>
        <div className="mx-auto max-w-sm lg:max-w-md">
          <Img asset={images.notFound} priority className="w-full" />
        </div>
      </div>
    </section>
  );
}
