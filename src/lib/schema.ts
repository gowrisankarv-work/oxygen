/**
 * Typed JSON-LD builders (schema.org). Everything is derived from config/content, and
 * empty values (e.g. social links) are omitted rather than emitted as blanks.
 */
import { siteConfig, absoluteUrl } from '@/config/site.config';
import type { Service } from '@/content/services';
import type { ArticleMeta } from '@/content/articles';
import type { Crumb } from './breadcrumbs';
import { socialLinks } from './social';

export type JsonLd = Record<string, unknown>;

const ORG_ID = () => `${absoluteUrl('/')}#organization`;
const BUSINESS_ID = () => `${absoluteUrl('/')}#localbusiness`;

function postalAddress() {
  const a = siteConfig.contact.address;
  return {
    '@type': 'PostalAddress',
    streetAddress: [a.line1, a.line2].filter(Boolean).join(', '),
    addressLocality: a.city,
    addressRegion: a.state,
    postalCode: a.pincode,
    addressCountry: 'IN',
  };
}

export function organizationSchema(): JsonLd {
  const sameAs = socialLinks().map((s) => s.url);
  return {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'Organization'],
    '@id': ORG_ID(),
    name: siteConfig.companyName,
    alternateName: siteConfig.shortName,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/icon-512.png'),
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    address: postalAddress(),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: siteConfig.contact.phone,
        email: siteConfig.contact.email,
        areaServed: 'IN',
        availableLanguage: ['en', 'hi'],
      },
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function localBusinessSchema(): JsonLd {
  const hours = siteConfig.contact.hours
    .filter((h) => h.opens && h.closes)
    .map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes }));
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': BUSINESS_ID(),
    name: siteConfig.companyName,
    url: absoluteUrl('/'),
    image: absoluteUrl(siteConfig.seo.ogImage),
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: postalAddress(),
    priceRange: 'On consultation',
    parentOrganization: { '@id': ORG_ID() },
    ...(hours.length ? { openingHoursSpecification: hours } : {}),
  };
}

export function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${absoluteUrl('/')}#website`,
    name: siteConfig.companyName,
    url: absoluteUrl('/'),
    inLanguage: 'en-IN',
    publisher: { '@id': ORG_ID() },
  };
}

export function serviceSchema(service: Service): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    serviceType: service.title,
    description: service.seo.description,
    url: absoluteUrl(`/services/${service.slug}/`),
    provider: { '@id': ORG_ID() },
    areaServed: { '@type': 'Country', name: 'India' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${service.title} — what's included`,
      itemListElement: service.included.map((f) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: f.title, description: f.text },
      })),
    },
  };
}

export function faqPageSchema(items: { q: string; a: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbSchema(crumbs: Crumb[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: absoluteUrl(c.href),
    })),
  };
}

export function articleSchema(article: ArticleMeta, path: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.updated ?? article.date,
    inLanguage: 'en-IN',
    articleSection: article.category,
    mainEntityOfPage: absoluteUrl(path),
    image: absoluteUrl(siteConfig.seo.ogImage),
    author: { '@type': 'Organization', name: article.author.name, url: absoluteUrl('/about/') },
    publisher: {
      '@id': ORG_ID(),
      '@type': 'Organization',
      name: siteConfig.companyName,
      logo: { '@type': 'ImageObject', url: absoluteUrl('/icon-512.png') },
    },
  };
}
