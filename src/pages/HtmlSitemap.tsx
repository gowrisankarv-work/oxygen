import { useRoutes } from '@/router/router';
import { expandRoutes, toHref } from '@/router/paths';
import { Link } from '@/router/router';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Layout';
import type { RouteDef } from '@/router/types';

const groups: { id: RouteDef['group']; title: string }[] = [
  { id: 'main', title: 'Company' },
  { id: 'services', title: 'Services' },
  { id: 'resources', title: 'Resources' },
  { id: 'legal', title: 'Legal' },
  { id: 'utility', title: 'Other' },
];

/** Human-readable sitemap generated from the route table. */
export default function HtmlSitemap() {
  const routes = useRoutes();
  const entries = expandRoutes(routes).filter(
    (e) => e.route.prerender && e.route.sitemap !== false && !e.route.meta(e.params).noindex,
  );
  return (
    <>
      <PageHero eyebrow="Sitemap" title="All pages on this website" />
      <Section>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g) => {
            const items = entries.filter((e) => e.route.group === g.id);
            if (!items.length) return null;
            return (
              <section key={g.id} aria-labelledby={`sm-${g.id}`}>
                <h2 id={`sm-${g.id}`} className="eyebrow mb-4 text-purple-500">
                  {g.title}
                </h2>
                <ul className="space-y-2">
                  {items.map((e) => (
                    <li key={e.path}>
                      <Link to={e.path} className="text-ink underline-offset-4 hover:text-purple-700 hover:underline">
                        {e.route.label(e.params)}
                      </Link>
                      <span className="block text-xs text-muted">{toHref(e.path)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </Section>
    </>
  );
}
