import { useState } from 'react';
import { absoluteUrl } from '@/config/site.config';
import { articles, getArticleMeta } from '@/content/articles';
import { articleBodies } from '@/content/articles/bodies';
import { useLocation, useParams } from '@/router/router';
import { toHref } from '@/router/paths';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/Layout';
import { Icon, type IconName } from '@/components/icons/Icon';
import { RichText } from '@/components/sections/RichText';
import { ArticleCard, ArticleCover, formatDate } from '@/components/sections/ArticleSections';
import { CtaBanner } from '@/components/sections/SharedSections';
import NotFound from './NotFound';

function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const links: { name: string; href: string; icon: IconName }[] = [
    { name: 'WhatsApp', href: `https://wa.me/?text=${enc(`${title} ${url}`)}`, icon: 'whatsapp' },
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, icon: 'linkedin' },
    { name: 'X', href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`, icon: 'x' },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, icon: 'facebook' },
  ];
  const btn =
    'grid size-11 place-items-center rounded-full border border-line bg-white text-purple-700 transition-colors hover:border-purple-500 hover:bg-surface';
  return (
    <div>
      <p className="mb-3 text-small font-semibold text-purple-900">Share this article</p>
      <ul className="flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.name}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className={btn}
              aria-label={`Share on ${l.name} (opens in a new tab)`}
            >
              <Icon name={l.icon} size={18} />
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            className={btn}
            aria-label={copied ? 'Link copied' : 'Copy link'}
            onClick={() => {
              void navigator.clipboard?.writeText(url).then(() => {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
          >
            <Icon name={copied ? 'check' : 'link'} size={18} />
          </button>
        </li>
      </ul>
      <p aria-live="polite" className="sr-only">
        {copied ? 'Link copied to clipboard' : ''}
      </p>
    </div>
  );
}

export default function Article() {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const meta = getArticleMeta(slug ?? '');
  const body = slug ? articleBodies[slug] : undefined;
  if (!meta || !body) return <NotFound />;

  const toc = body.blocks.filter((b): b is Extract<typeof b, { type: 'h2' }> => b.type === 'h2');
  const related = articles
    .filter((a) => a.slug !== meta.slug)
    .sort((a, b) => Number(b.category === meta.category) - Number(a.category === meta.category))
    .slice(0, 3);
  const url = absoluteUrl(toHref(pathname));

  return (
    <>
      <header className="relative overflow-hidden bg-surface pt-[calc(var(--header-h)+var(--topbar-h)+2.5rem)] pb-12 lg:pt-[calc(var(--header-h)+var(--topbar-h)+4rem)]">
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-16 size-96 bg-signature opacity-20 blur-3xl motion-safe:animate-blob"
        />
        <div className="container-site relative max-w-4xl">
          <Breadcrumbs className="mb-6" />
          <div className="flex flex-wrap items-center gap-3 text-small text-muted">
            <Badge>{meta.category}</Badge>
            <time dateTime={meta.date}>{formatDate(meta.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{meta.readingMinutes} min read</span>
          </div>
          <h1 className="mt-5 text-h1 tracking-[-0.02em]">{meta.title}</h1>
          <p className="mt-5 text-body text-muted">{meta.excerpt}</p>
        </div>
      </header>

      <div className="container-site max-w-6xl py-12 lg:py-16">
        <ArticleCover article={meta} large className="mb-12 aspect-[21/9] rounded-[1.5rem]" />
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <article className="min-w-0">
            <RichText blocks={body.blocks} />

            {/* Author box */}
            <div className="mt-14 flex items-start gap-4 rounded-card border border-line bg-surface p-6">
              <span
                aria-hidden="true"
                className="grid size-14 shrink-0 place-items-center rounded-full bg-signature text-white"
              >
                <Icon name="pen" size={24} />
              </span>
              <div>
                <p className="text-small text-muted">Written by</p>
                <p className="font-display text-lg font-semibold text-purple-900">{meta.author.name}</p>
                <p className="text-small text-muted">
                  {meta.author.role}. Our articles are general guidance — for advice on your situation, book a free
                  consultation.
                </p>
              </div>
            </div>
          </article>

          <aside
            className="space-y-8 lg:sticky lg:top-[calc(var(--header-h)+var(--topbar-h)+1.5rem)] lg:self-start"
            aria-label="Article tools"
          >
            {toc.length > 0 && (
              <nav aria-labelledby="toc-title" className="rounded-card border border-line bg-white p-5">
                <p id="toc-title" className="mb-3 text-small font-semibold text-purple-900">
                  On this page
                </p>
                <ol className="space-y-2 text-small">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="text-muted hover:text-purple-700">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <ShareButtons title={meta.title} url={url} />
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-articles" className="bg-surface py-16 lg:py-20">
          <div className="container-site">
            <h2 id="related-articles" className="text-h2 tracking-[-0.02em]">
              Related articles
            </h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((a, i) => (
                <ArticleCard key={a.slug} article={a} index={i} />
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
