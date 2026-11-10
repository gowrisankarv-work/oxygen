/**
 * Article registry: metadata here (small, bundled with the router). Bodies live in their own
 * files and are registered in ./bodies.ts (bundled only with the article page chunk).
 * To add an article: create a body file, add an entry below AND in bodies.ts.
 */
import type { ArticleMeta } from './types';

export type { ArticleMeta, ArticleBody, ArticleBlock, ArticleCategory } from './types';

const editorial = { name: 'Oxygen Edu-Hub Editorial Team', role: 'Mentors & editors' }; // PLACEHOLDER — replace with named authors

export const allArticles: ArticleMeta[] = [
  {
    slug: 'how-to-choose-the-right-course-after-12th',
    title: 'How to Choose the Right Course After 12th',
    description:
      'A step-by-step method for choosing the right course after Class 12: know yourself, map courses to careers, verify institutions and plan entrance exams early.',
    excerpt:
      'Advice after Class 12 is everywhere, but little of it is about you. Use this six-step process to choose a course you understand, can afford and will enjoy.',
    category: 'Admissions',
    date: '2026-10-06',
    author: editorial,
    cover: 'violet',
    readingMinutes: 3,
  },
  {
    slug: 'statement-of-purpose-checklist',
    title: 'Writing a Strong Statement of Purpose: A Checklist',
    description:
      'Plan, structure and revise a strong Statement of Purpose with this practical checklist covering a proven structure, common mistakes and final revision checks.',
    excerpt:
      'Your SOP is where the admission panel hears your voice. Here is a practical structure, the mistakes to avoid and a revision checklist to use before you submit.',
    category: 'Admissions',
    date: '2026-10-14',
    author: editorial,
    cover: 'navy',
    readingMinutes: 3,
  },
  {
    slug: 'how-to-spot-a-predatory-journal',
    title: 'How to Spot a Predatory Journal',
    description:
      'Learn the warning signs of predatory and hijacked journals and how to verify indexing in Scopus, Web of Science, DOAJ and UGC-CARE before submitting a paper.',
    excerpt:
      'Predatory journals take fees without real peer review — and can cost you your paper. Learn the warning signs and a six-step check to verify any journal.',
    category: 'Publications',
    date: '2026-10-22',
    author: editorial,
    cover: 'magenta',
    readingMinutes: 3,
  },
  {
    slug: 'beginners-guide-to-research-methodology',
    title: 'A Beginner’s Guide to Research Methodology',
    description:
      'A beginner-friendly guide to research methodology: framing a researchable question, choosing an approach and design, sampling, instruments, analysis and ethics.',
    excerpt:
      'Methodology is the reasoning behind how you answer your question. Walk through the core decisions — approach, design, sampling, instruments and analysis.',
    category: 'Research',
    date: '2026-10-30',
    author: editorial,
    cover: 'gold',
    readingMinutes: 3,
  },
];

/** Published articles, newest first. */
export const articles = allArticles.filter((a) => !a.draft).sort((a, b) => b.date.localeCompare(a.date));

export function getArticleMeta(slug: string) {
  return allArticles.find((a) => a.slug === slug);
}

export const articleCategories = ['Admissions', 'Careers', 'Research', 'Publications'] as const;
