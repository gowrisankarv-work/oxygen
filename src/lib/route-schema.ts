/**
 * Maps each route to its JSON-LD blocks. Used only at build time (prerender) — never shipped
 * to the browser, so FAQ and schema data do not add to the client bundle.
 */
import { routes } from '@/router/routes';
import { toHref } from '@/router/paths';
import type { RouteMatch } from '@/router/types';
import { getService } from '@/content/services';
import { getArticleMeta } from '@/content/articles';
import { faqs } from '@/content/faqs';
import { buildBreadcrumbs } from './breadcrumbs';
import {
  articleSchema,
  breadcrumbSchema,
  faqPageSchema,
  localBusinessSchema,
  organizationSchema,
  serviceSchema,
  websiteSchema,
  type JsonLd,
} from './schema';

export function buildRouteSchema(match: RouteMatch, url: string): JsonLd[] {
  const { route, params } = match;
  if (route.path === '*') return [];
  const path = url.split(/[?#]/)[0] ?? '/';
  // Sitewide: Organization (+ EducationalOrganization) and LocalBusiness on every page
  const out: JsonLd[] = [organizationSchema(), localBusinessSchema()];

  if (route.id === 'home') {
    out.push(websiteSchema());
    out.push(faqPageSchema(faqs.filter((f) => f.featured).slice(0, 5)));
    return out;
  }

  out.push(breadcrumbSchema(buildBreadcrumbs(routes, path)));

  switch (route.id) {
    case 'service-detail': {
      const s = getService(params.slug ?? '');
      if (s) out.push(serviceSchema(s), faqPageSchema(s.faqs));
      break;
    }
    case 'faq':
      out.push(faqPageSchema(faqs));
      break;
    case 'article': {
      const a = getArticleMeta(params.slug ?? '');
      if (a) out.push(articleSchema(a, toHref(path)));
      break;
    }
    default:
      break;
  }
  return out;
}
