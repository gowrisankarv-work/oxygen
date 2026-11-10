import { useState } from 'react';
import { articles, articleCategories } from '@/content/articles';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Layout';
import { ArticleCard } from '@/components/sections/ArticleSections';
import { CtaBanner } from '@/components/sections/SharedSections';
import { cn } from '@/lib/cn';

export default function Resources() {
  const [category, setCategory] = useState<string>('All');
  const available = articleCategories.filter((c) => articles.some((a) => a.category === c));
  const shown = category === 'All' ? articles : articles.filter((a) => a.category === category);

  return (
    <>
      <PageHero
        eyebrow="Resources & insights"
        title="Guides for students, parents and researchers"
        subtitle="Practical, honest advice on choosing courses, applying well, doing sound research and publishing responsibly."
      />
      <Section labelledBy="articles-title">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="articles-title" className="text-h3">
            {category === 'All' ? 'All articles' : `${category} articles`}
            <span className="ml-2 text-base font-normal text-muted">({shown.length})</span>
          </h2>
          <div role="group" aria-label="Filter articles by category" className="flex flex-wrap gap-2">
            {['All', ...available].map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={cn(
                  'min-h-11 rounded-full px-5 text-small font-semibold transition-colors',
                  category === c
                    ? 'bg-purple-700 text-white'
                    : 'border border-line bg-white text-purple-900 hover:border-purple-500/40',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {shown.map((a, i) => (
            <ArticleCard key={a.slug} article={a} index={i} headingLevel="h3" />
          ))}
        </ul>
      </Section>
      <CtaBanner title="Have a question these guides don’t answer?" />
    </>
  );
}
