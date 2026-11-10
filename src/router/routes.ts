/**
 * The route table — single source of truth for the router, the prerender step,
 * sitemap.xml, the HTML sitemap page, breadcrumbs and the test suites.
 *
 * Descriptions are 150–160 characters (enforced by tests/routes.test.ts).
 */
import { services, getService } from '@/content/services';
import { articles, getArticleMeta } from '@/content/articles';
import { siteConfig } from '@/config/site.config';
import type { RouteDef } from './types';

const allRoutes: RouteDef[] = [
  {
    id: 'home',
    path: '/',
    source: 'src/pages/Home.tsx',
    load: () => import('../pages/Home'),
    label: () => 'Home',
    meta: () => ({
      title: `${siteConfig.companyName} — Admission Guidance, Career Counselling & Research Support`,
      absoluteTitle: true,
      description:
        'Personalised admission guidance, career counselling, PhD research support and ethical journal publication assistance in India. Book a free consultation today.',
    }),
    prerender: true,
    sitemap: { priority: 1, changefreq: 'weekly' },
    group: 'main',
  },
  {
    id: 'about',
    path: '/about',
    source: 'src/pages/About.tsx',
    load: () => import('../pages/About'),
    label: () => 'About Us',
    meta: () => ({
      title: 'About Us',
      description:
        'Meet Oxygen Edu-Hub, an ethical education consultancy guiding students, parents, researchers and faculty with personalised, transparent, end-to-end support.',
    }),
    prerender: true,
    sitemap: { priority: 0.8, changefreq: 'monthly' },
    group: 'main',
  },
  {
    id: 'services',
    path: '/services',
    source: 'src/pages/Services.tsx',
    load: () => import('../pages/Services'),
    label: () => 'Services',
    meta: () => ({
      title: 'Our Services',
      description:
        'Explore our four services: admission guidance, career counselling, research and innovation mentoring, and ethical publication support for scholars in India.',
    }),
    prerender: true,
    sitemap: { priority: 0.9, changefreq: 'monthly' },
    group: 'services',
  },
  {
    id: 'service-detail',
    path: '/services/:slug',
    source: 'src/pages/ServiceDetail.tsx',
    load: () => import('../pages/ServiceDetail'),
    label: (p) => getService(p.slug ?? '')?.title ?? 'Service',
    meta: (p) => {
      const s = getService(p.slug ?? '');
      return {
        title: s?.seo.title ?? 'Service',
        description: s?.seo.description ?? '',
        ogImage: s ? `/og/${s.slug}.jpg` : undefined,
      };
    },
    staticPaths: () => services.map((s) => ({ slug: s.slug })),
    prerender: true,
    sitemap: { priority: 0.9, changefreq: 'monthly' },
    group: 'services',
  },
  {
    id: 'how-we-work',
    path: '/how-we-work',
    source: 'src/pages/HowWeWork.tsx',
    load: () => import('../pages/HowWeWork'),
    label: () => 'How We Work',
    meta: () => ({
      title: 'How We Work — Our Approach',
      description:
        'See how we work: a free consultation, a needs assessment, a personalised plan, guided execution and ongoing support, with clear communication at every stage.',
    }),
    prerender: true,
    sitemap: { priority: 0.7, changefreq: 'monthly' },
    group: 'main',
  },
  {
    id: 'why-choose-us',
    path: '/why-choose-us',
    source: 'src/pages/WhyChooseUs.tsx',
    load: () => import('../pages/WhyChooseUs'),
    label: () => 'Why Choose Us',
    meta: () => ({
      title: 'Why Choose Us',
      description:
        'Personalised mentorship, subject experts and strict ethics. See what we promise, what we never do, and why families and researchers trust Oxygen Edu-Hub.',
    }),
    prerender: true,
    sitemap: { priority: 0.7, changefreq: 'monthly' },
    group: 'main',
  },
  {
    id: 'testimonials',
    path: '/testimonials',
    source: 'src/pages/Testimonials.tsx',
    load: () => import('../pages/Testimonials'),
    label: () => 'Testimonials',
    meta: () => ({
      title: 'Testimonials',
      description:
        'Read experiences from students, parents and researchers who used our admission, career, research and publication services. Filter the stories by service.',
    }),
    prerender: true,
    sitemap: { priority: 0.6, changefreq: 'monthly' },
    group: 'main',
  },
  {
    id: 'resources',
    path: '/resources',
    source: 'src/pages/Resources.tsx',
    load: () => import('../pages/Resources'),
    label: () => 'Resources',
    meta: () => ({
      title: 'Resources & Insights',
      description:
        'Practical guides on choosing a course, writing a strong SOP, spotting predatory journals and research methodology, from the Oxygen Edu-Hub team of mentors.',
    }),
    prerender: true,
    sitemap: { priority: 0.7, changefreq: 'weekly' },
    group: 'resources',
  },
  {
    id: 'article',
    path: '/resources/:slug',
    source: 'src/pages/Article.tsx',
    load: () => import('../pages/Article'),
    label: (p) => getArticleMeta(p.slug ?? '')?.title ?? 'Article',
    meta: (p) => {
      const a = getArticleMeta(p.slug ?? '');
      return {
        title: a?.title ?? 'Article',
        description: a?.description ?? '',
        ogType: 'article',
        noindex: a?.draft,
      };
    },
    staticPaths: () => articles.map((a) => ({ slug: a.slug })),
    prerender: true,
    sitemap: { priority: 0.6, changefreq: 'monthly' },
    group: 'resources',
  },
  {
    id: 'faq',
    path: '/faq',
    source: 'src/pages/Faq.tsx',
    load: () => import('../pages/Faq'),
    label: () => 'FAQ',
    meta: () => ({
      title: 'Frequently Asked Questions',
      description:
        'Clear answers to common questions about admissions, career counselling, research support, publication ethics, fees, payments and privacy at Oxygen Edu-Hub.',
    }),
    prerender: true,
    sitemap: { priority: 0.7, changefreq: 'monthly' },
    group: 'main',
  },
  {
    id: 'contact',
    path: '/contact',
    source: 'src/pages/Contact.tsx',
    load: () => import('../pages/Contact'),
    label: () => 'Contact Us',
    meta: () => ({
      title: 'Contact Us',
      description:
        'Contact Oxygen Edu-Hub by phone, WhatsApp or email, or send us a message online. Visit our office for admission, career, research and publication guidance.',
    }),
    prerender: true,
    sitemap: { priority: 0.8, changefreq: 'monthly' },
    group: 'main',
  },
  {
    id: 'book-consultation',
    path: '/book-consultation',
    source: 'src/pages/BookConsultation.tsx',
    load: () => import('../pages/BookConsultation'),
    label: () => 'Book a Free Consultation',
    meta: () => ({
      title: 'Book a Free Consultation',
      description:
        'Book a free consultation with an Oxygen Edu-Hub expert. Tell us about your goals in three short steps and choose a time that suits you for a call or meeting.',
    }),
    prerender: true,
    sitemap: { priority: 0.9, changefreq: 'monthly' },
    group: 'main',
  },
  {
    id: 'thank-you',
    path: '/thank-you',
    source: 'src/pages/ThankYou.tsx',
    load: () => import('../pages/ThankYou'),
    label: () => 'Thank You',
    meta: () => ({
      title: 'Thank You',
      description:
        'Thank you for contacting Oxygen Edu-Hub. Our team will review your enquiry and get in touch soon. Here is what happens next and how to reach us right away.',
      noindex: true,
    }),
    prerender: true,
    sitemap: false,
    group: 'utility',
  },
  {
    id: 'careers',
    path: '/careers',
    source: 'src/pages/Careers.tsx',
    load: () => import('../pages/Careers'),
    label: () => 'Careers',
    meta: () => ({
      title: 'Careers — Join Our Team',
      description:
        'Join Oxygen Edu-Hub. We are looking for counsellors, researchers and editors who care about ethical, student-first guidance. See openings and how to apply.',
    }),
    prerender: true,
    sitemap: { priority: 0.4, changefreq: 'monthly' },
    group: 'main',
  },
  {
    id: 'privacy-policy',
    path: '/privacy-policy',
    source: 'src/pages/Legal.tsx',
    load: () => import('../pages/Legal'),
    label: () => 'Privacy Policy',
    meta: () => ({
      title: 'Privacy Policy',
      description:
        'How Oxygen Edu-Hub collects, uses and protects your personal data, your rights under the Digital Personal Data Protection Act, 2023, and how to contact us.',
    }),
    prerender: true,
    sitemap: { priority: 0.3, changefreq: 'yearly' },
    group: 'legal',
  },
  {
    id: 'terms-and-conditions',
    path: '/terms-and-conditions',
    source: 'src/pages/Legal.tsx',
    load: () => import('../pages/Legal'),
    label: () => 'Terms & Conditions',
    meta: () => ({
      title: 'Terms & Conditions',
      description:
        'The terms that apply when you use the Oxygen Edu-Hub website and services, including service scope, client responsibilities, fees, liability and governing law.',
    }),
    prerender: true,
    sitemap: { priority: 0.3, changefreq: 'yearly' },
    group: 'legal',
  },
  {
    id: 'refund-cancellation-policy',
    path: '/refund-cancellation-policy',
    source: 'src/pages/Legal.tsx',
    load: () => import('../pages/Legal'),
    label: () => 'Refund & Cancellation Policy',
    meta: () => ({
      title: 'Refund & Cancellation Policy',
      description:
        'Our refund and cancellation policy for consultations and packages: rescheduling, cancellation windows, refund eligibility and how refunds are processed.',
    }),
    prerender: true,
    sitemap: { priority: 0.3, changefreq: 'yearly' },
    group: 'legal',
  },
  {
    id: 'disclaimer',
    path: '/disclaimer',
    source: 'src/pages/Legal.tsx',
    load: () => import('../pages/Legal'),
    label: () => 'Disclaimer',
    meta: () => ({
      title: 'Disclaimer',
      description:
        'Oxygen Edu-Hub provides guidance only. We do not guarantee admission, jobs or publication, and we never ghostwrite or sell authorship. Read our ethics policy.',
    }),
    prerender: true,
    sitemap: { priority: 0.3, changefreq: 'yearly' },
    group: 'legal',
  },
  {
    id: 'sitemap',
    path: '/sitemap',
    source: 'src/pages/HtmlSitemap.tsx',
    load: () => import('../pages/HtmlSitemap'),
    label: () => 'Sitemap',
    meta: () => ({
      title: 'Sitemap',
      description:
        'A complete list of pages on the Oxygen Edu-Hub website, including our services, resources and articles, company information and legal policies, in one place.',
    }),
    prerender: true,
    sitemap: { priority: 0.2, changefreq: 'monthly' },
    group: 'utility',
  },
  {
    id: 'styleguide',
    path: '/styleguide',
    source: 'src/pages/Styleguide.tsx',
    // Constant-folded by esbuild: the styleguide chunk is not emitted in production builds.
    load: () => (__ENV__.DEV ? import('../pages/Styleguide') : Promise.reject(new Error('Styleguide is dev-only'))),
    label: () => 'Styleguide',
    meta: () => ({
      title: 'Styleguide',
      description:
        'Internal design system reference for the Oxygen Edu-Hub website: colour tokens, typography, buttons, cards, badges and form fields. Development builds only.',
      noindex: true,
    }),
    prerender: false,
    sitemap: false,
    devOnly: true,
    group: 'utility',
  },
  {
    id: 'not-found',
    path: '*',
    source: 'src/pages/NotFound.tsx',
    load: () => import('../pages/NotFound'),
    label: () => 'Page not found',
    meta: () => ({
      title: 'Page Not Found',
      description:
        'The page you were looking for could not be found. Explore our admission, career, research and publication services, or contact the Oxygen Edu-Hub team.',
      noindex: true,
    }),
    prerender: true,
    sitemap: false,
    group: 'utility',
  },
];

/** Routes available in the current build (dev-only routes are dropped from production). */
export const routes: RouteDef[] = allRoutes.filter((r) => !r.devOnly || __ENV__.DEV);

/** Feature-flagged routes (blog/careers) stay routable but are hidden from navigation when disabled. */
export function findRoute(id: string): RouteDef {
  const route = allRoutes.find((r) => r.id === id);
  if (!route) throw new Error(`Unknown route id: ${id}`);
  return route;
}
