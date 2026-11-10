/**
 * Renders article/legal blocks. Inline syntax: **bold** and [label](/path or https://url).
 * Internal links use the router <Link>; external links open in a new tab with noopener.
 */
import type { ReactNode } from 'react';
import type { ArticleBlock } from '@/content/articles/types';
import { Link } from '@/router/router';
import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/cn';

const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

export function renderInline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link as unknown as [string, string, string];
      if (/^https?:/.test(href)) {
        return (
          <a key={i} href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        );
      }
      if (/^mailto:|^tel:/.test(href))
        return (
          <a key={i} href={href}>
            {label}
          </a>
        );
      return (
        <Link key={i} to={href}>
          {label}
        </Link>
      );
    }
    return part;
  });
}

export function RichText({ blocks, className }: { blocks: ArticleBlock[]; className?: string }) {
  return (
    <div className={cn('prose-oxygen', className)}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'p':
            return <p key={i}>{renderInline(b.text)}</p>;
          case 'h2':
            return (
              <h2 key={i} id={b.id}>
                {b.text}
              </h2>
            );
          case 'h3':
            return <h3 key={i}>{b.text}</h3>;
          case 'ul':
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ol>
            );
          case 'quote':
            return <blockquote key={i}>{renderInline(b.text)}</blockquote>;
          case 'callout':
            return (
              <aside
                key={i}
                className={cn(
                  'not-prose flex gap-3 rounded-card border p-5',
                  b.tone === 'warning' ? 'border-gold-400/50 bg-gold-400/10' : 'border-purple-500/20 bg-surface',
                )}
              >
                <Icon name={b.tone === 'warning' ? 'alert' : 'info'} size={22} className="mt-0.5 text-purple-700" />
                <div>
                  <p className="font-semibold text-purple-900">{b.title}</p>
                  <p className="mt-1 text-[0.95rem]">{renderInline(b.text)}</p>
                </div>
              </aside>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
