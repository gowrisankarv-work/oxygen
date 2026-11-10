/**
 * Article content model. Bodies are typed blocks (not MDX) so they prerender with zero
 * extra tooling. Inline text supports **bold** and [link text](/internal-or-https-url).
 */
export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; id: string; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; title: string; text: string; tone?: 'info' | 'warning' }
  | { type: 'quote'; text: string };

export type ArticleCategory = 'Admissions' | 'Careers' | 'Research' | 'Publications';

export interface ArticleMeta {
  slug: string;
  title: string;
  /** 150–160 characters, used for meta description. */
  description: string;
  excerpt: string;
  category: ArticleCategory;
  /** ISO date */
  date: string;
  updated?: string;
  author: { name: string; role: string };
  /** Drafts are excluded from listings and the sitemap and set to noindex. */
  draft?: boolean;
  /** Reading time in minutes (~200 wpm). tests/content.test.ts checks it matches the body. */
  readingMinutes: number;
  /** Cover gradient/icon style for the illustrated card header. */
  cover: 'violet' | 'navy' | 'magenta' | 'gold';
}

export interface ArticleBody {
  blocks: ArticleBlock[];
}

export function wordCount(blocks: ArticleBlock[]): number {
  const text = blocks
    .map((b) => {
      if (b.type === 'ul' || b.type === 'ol') return b.items.join(' ');
      if (b.type === 'callout') return `${b.title} ${b.text}`;
      return b.text;
    })
    .join(' ');
  return text.split(/\s+/).filter(Boolean).length;
}

/** Reading time at ~200 words per minute (min 1). */
export function readingMinutes(words: number): number {
  return Math.max(1, Math.round(words / 200));
}
