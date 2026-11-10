import { Link, useLocation, useRoutes } from '@/router/router';
import { buildBreadcrumbs } from '@/lib/breadcrumbs';
import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/cn';

/** Visible breadcrumbs (BreadcrumbList JSON-LD is emitted in <head> at build time). */
export function Breadcrumbs({ className, onDark }: { className?: string; onDark?: boolean }) {
  const { pathname } = useLocation();
  const routes = useRoutes();
  const crumbs = buildBreadcrumbs(routes, pathname);
  if (crumbs.length < 2) return null;
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-small">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-1.5">
              {i > 0 && <Icon name="chevron-right" size={14} className={onDark ? 'text-white/60' : 'text-muted'} />}
              {last ? (
                <span aria-current="page" className={cn('font-medium', onDark ? 'text-white' : 'text-purple-900')}>
                  {c.label}
                </span>
              ) : (
                <Link
                  to={c.href}
                  className={cn(
                    'hover:underline',
                    onDark ? 'text-white/80 hover:text-white' : 'text-muted hover:text-purple-700',
                  )}
                >
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
