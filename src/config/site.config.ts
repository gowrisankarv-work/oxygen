/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  OXYGEN EDU-HUB — central site configuration
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every company detail shown on the website comes from this file (or /src/content).
 *  Values marked `// PLACEHOLDER` are samples and MUST be replaced before launch.
 *  Run `npm run check:placeholders` to list everything that still needs real data.
 *  Plain-language editing guide: CONTENT_GUIDE.md
 */

export type FormProvider = 'web3forms' | 'formspree' | 'mailto';

export interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface OpeningHours {
  /** Human label, e.g. "Mon – Fri" */
  label: string;
  /** Human time range, e.g. "9:30 AM – 6:30 PM" or "Closed" */
  time: string;
  /** schema.org days, e.g. ["Monday", "Tuesday"] */
  days: string[];
  /** 24h opening time "09:30" (omit when closed) */
  opens?: string;
  /** 24h closing time "18:30" (omit when closed) */
  closes?: string;
}

/** A logo file and its intrinsic size in pixels. */
export interface BrandFile {
  src: string;
  width: number;
  height: number;
}

export interface SiteConfig {
  companyName: string;
  shortName: string;
  tagline: string;
  description: string;
  foundedYear: number;
  contact: {
    phone: string;
    phoneDisplay: string;
    whatsapp: string;
    email: string;
    altEmail: string;
    address: Address;
    mapEmbedUrl: string;
    mapLink: string;
    hours: OpeningHours[];
    responseTime: string;
  };
  social: { facebook: string; instagram: string; linkedin: string; youtube: string; x: string };
  people: {
    founder: { name: string; title: string; photo: string; message: string[] };
    contactPerson: { name: string; title: string };
  };
  seo: {
    siteUrl: string;
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    ogImage: string;
    twitterHandle: string;
    locale: string;
    keywordsCity: string;
  };
  brand: {
    /** "files" uses the official logo files in /public/brand; "svg-component" is the built-in text fallback. */
    logoSource: 'svg-component' | 'files';
    /** Logo files with their intrinsic pixel sizes (used for width/height → no layout shift). */
    files: {
      full: BrandFile;
      fullDark: BrandFile;
      wordmarkWhite: BrandFile;
      emblem: BrandFile;
    };
    themeColor: string;
  };
  features: {
    showStats: boolean;
    showTestimonials: boolean;
    showTeam: boolean;
    showFounder: boolean;
    showPricing: boolean;
    showBlog: boolean;
    showCareers: boolean;
    showNewsletter: boolean;
    showStudyAbroadVisa: boolean;
  };
  forms: {
    /** Provider is chosen with VITE_FORM_PROVIDER; endpoint/key come from env (never commit keys). */
    provider: FormProvider;
    endpoint: string;
    accessKey: string;
    turnstileSiteKey: string;
    /** Minimum seconds between form render and submit (simple bot check). */
    minSubmitSeconds: number;
  };
  analytics: { ga4Id: string; plausibleDomain: string };
  legal: { lastUpdated: string; legalReviewed: boolean; jurisdiction: string; businessEntity: string };
  credits: { agencyName: string; agencyUrl: string; show: boolean };
}

const env: OxygenBuildEnv = typeof __ENV__ !== 'undefined' ? __ENV__ : ({} as OxygenBuildEnv);

function resolveProvider(): FormProvider {
  const p = (env.VITE_FORM_PROVIDER || '').toLowerCase();
  if (p === 'formspree') return 'formspree';
  if (p === 'mailto') return 'mailto';
  if (p === 'web3forms') return 'web3forms';
  // Auto-detect from the endpoint when the provider is not set explicitly
  if ((env.VITE_FORM_ENDPOINT || '').includes('formspree')) return 'formspree';
  if (env.VITE_FORM_ENDPOINT || env.VITE_FORM_ACCESS_KEY) return 'web3forms';
  return 'mailto';
}

export const siteConfig: SiteConfig = {
  companyName: 'OXYGEN EDU-HUB',
  shortName: 'Oxygen Edu-Hub',
  tagline: 'Fuel for Your Academic Journey',
  description:
    'Oxygen Edu-Hub is an academic services and education consultancy offering admission guidance, career counselling, research support and ethical publication services.',
  foundedYear: 2024, // PLACEHOLDER

  contact: {
    phone: '+919876543210', // PLACEHOLDER — digits only with country code, used for tel: links
    phoneDisplay: '+91 98765 43210', // PLACEHOLDER
    whatsapp: '919876543210', // PLACEHOLDER — country code + number, no "+" or spaces
    email: 'info@oxygenedu-hub.example', // PLACEHOLDER
    altEmail: 'support@oxygenedu-hub.example', // PLACEHOLDER
    address: {
      line1: 'Placeholder Address', // PLACEHOLDER
      line2: 'Placeholder Street, Placeholder Area', // PLACEHOLDER
      city: 'City', // PLACEHOLDER
      state: 'State', // PLACEHOLDER
      pincode: '600000', // PLACEHOLDER
      country: 'India',
    },
    mapEmbedUrl: '', // PLACEHOLDER — paste a Google Maps "Embed a map" src URL here
    mapLink: '', // PLACEHOLDER — Google Maps share link used by "Get Directions"
    hours: [
      // PLACEHOLDER — business hours
      {
        label: 'Mon – Fri',
        time: '9:30 AM – 6:30 PM',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:30',
        closes: '18:30',
      },
      { label: 'Saturday', time: '10:00 AM – 4:00 PM', days: ['Saturday'], opens: '10:00', closes: '16:00' },
      { label: 'Sunday', time: 'Closed', days: ['Sunday'] },
    ],
    responseTime: 'We usually reply within one working day.', // PLACEHOLDER
  },

  social: {
    // Empty string hides the icon everywhere (header bar, footer, contact page, JSON-LD sameAs).
    facebook: '', // PLACEHOLDER
    instagram: '', // PLACEHOLDER
    linkedin: '', // PLACEHOLDER
    youtube: '', // PLACEHOLDER
    x: '', // PLACEHOLDER
  },

  people: {
    founder: {
      name: 'Firstname Lastname', // PLACEHOLDER
      title: 'Founder & Director', // PLACEHOLDER
      photo: '', // PLACEHOLDER — e.g. "/images/team/founder.jpg"; empty shows an initials avatar
      message: [
        // PLACEHOLDER — founder's message
        'Every student and researcher we meet is standing at a turning point — choosing a course, a career, a research question or a journal. These decisions shape years of effort, yet good, honest guidance is surprisingly hard to find.',
        'We started Oxygen Edu-Hub to change that. Our promise is simple: we listen first, we tell you the truth about your options, and we stay with you until the work is done. We will never sell shortcuts, and we will never promise outcomes that are not ours to give.',
        'If you are unsure where to begin, begin with a conversation. That first step is always free.',
      ],
    },
    contactPerson: { name: 'Firstname Lastname', title: 'Student Relations Lead' }, // PLACEHOLDER
  },

  seo: {
    siteUrl: env.VITE_SITE_URL || 'https://www.oxygenedu-hub.example', // PLACEHOLDER — set VITE_SITE_URL
    defaultTitle: 'OXYGEN EDU-HUB — Admissions, Career Guidance, Research & Publication Support',
    titleTemplate: '%s | OXYGEN EDU-HUB',
    defaultDescription:
      'Oxygen Edu-Hub offers personalised admission guidance, career counselling, PhD research support and ethical journal publication assistance across India.',
    ogImage: '/og/default.jpg',
    twitterHandle: '', // PLACEHOLDER — e.g. "@oxygenedu"
    locale: 'en_IN',
    keywordsCity: 'City', // PLACEHOLDER — your city, used in local SEO copy
  },

  brand: {
    // Official logo supplied by the client (extracted from the supplied artwork as transparent PNGs).
    // Replace with SVG versions when available — keep the same file names or update the paths here.
    logoSource: 'files',
    files: {
      full: { src: '/brand/logo-full.png', width: 480, height: 204 }, // wordmark + EDU-HUB + emblem, light backgrounds
      fullDark: { src: '/brand/logo-full-white.png', width: 480, height: 204 }, // same, for dark backgrounds
      wordmarkWhite: { src: '/brand/wordmark-white.png', width: 270, height: 126 }, // "oxgn" only, white
      emblem: { src: '/brand/emblem.png', width: 192, height: 192 }, // shield-check emblem only (favicons)
    },
    themeColor: '#52017F',
  },

  features: {
    showStats: false, // keep false until you have verified figures
    showTestimonials: true, // sample testimonials are labelled "Sample" until isSample: false
    showTeam: true,
    showFounder: true,
    showPricing: false,
    showBlog: true,
    showCareers: true,
    showNewsletter: true,
    showStudyAbroadVisa: true, // set false if study-abroad visa documentation guidance is not offered
  },

  forms: {
    provider: resolveProvider(),
    endpoint: env.VITE_FORM_ENDPOINT || '',
    accessKey: env.VITE_FORM_ACCESS_KEY || '',
    turnstileSiteKey: env.VITE_TURNSTILE_SITE_KEY || '',
    minSubmitSeconds: 3,
  },

  analytics: {
    ga4Id: env.VITE_GA4_ID || '',
    plausibleDomain: env.VITE_PLAUSIBLE_DOMAIN || '',
  },

  legal: {
    lastUpdated: '2026-11-09', // PLACEHOLDER — update after legal review
    legalReviewed: false, // set true only after your legal advisor approves the policy pages
    jurisdiction: 'City, State, India', // PLACEHOLDER
    businessEntity: 'OXYGEN EDU-HUB', // PLACEHOLDER — registered business name / entity type
  },

  credits: {
    agencyName: 'Agency Name', // PLACEHOLDER
    agencyUrl: '', // PLACEHOLDER
    show: true,
  },
};

/** Convenience: formatted single-line address. */
export function formatAddress(a: Address = siteConfig.contact.address): string {
  return [a.line1, a.line2, `${a.city}, ${a.state} – ${a.pincode}`, a.country].filter(Boolean).join(', ');
}

/** Absolute URL helper for canonical / OG tags. */
export function absoluteUrl(path: string): string {
  const base = siteConfig.seo.siteUrl.replace(/\/+$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
