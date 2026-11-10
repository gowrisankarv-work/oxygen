/**
 * Every image on the site is referenced from here, so swapping placeholders for real
 * photography is a one-file change. Files live in /public/images (see public/images/CREDITS.md).
 *
 * Current files are original SVG illustrations (placeholders). When replacing with photos:
 *  - keep the same aspect ratio or update width/height below (prevents layout shift)
 *  - prefer .avif/.webp (≤ 200 KB) and keep alt text meaningful
 */
export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const images = {
  hero: {
    src: '/images/hero-mentoring.svg',
    alt: 'Illustration of a mentor and a student planning next steps together at a desk with books and a laptop',
    width: 640,
    height: 640,
  },
  aboutTeam: {
    src: '/images/about-counselling.svg',
    alt: 'Illustration of a counsellor talking with a student and parent',
    width: 560,
    height: 420,
  },
  aboutLibrary: {
    src: '/images/about-library.svg',
    alt: 'Illustration of a researcher reading in a library',
    width: 400,
    height: 400,
  },
  aboutLab: {
    src: '/images/about-lab.svg',
    alt: 'Illustration of a scholar analysing data on a laptop',
    width: 400,
    height: 400,
  },
  serviceAdmission: {
    src: '/images/service-admission.svg',
    alt: 'Illustration of a student reviewing a university application checklist',
    width: 560,
    height: 420,
  },
  serviceCareer: {
    src: '/images/service-career.svg',
    alt: 'Illustration of a career map with branching paths and milestones',
    width: 560,
    height: 420,
  },
  serviceResearch: {
    src: '/images/service-research.svg',
    alt: 'Illustration of research charts, a flask and an open notebook',
    width: 560,
    height: 420,
  },
  servicePublication: {
    src: '/images/service-publication.svg',
    alt: 'Illustration of an edited manuscript with tracked changes and a journal',
    width: 560,
    height: 420,
  },
  notFound: {
    src: '/images/not-found.svg',
    alt: 'Illustration of a compass pointing in different directions',
    width: 360,
    height: 280,
  },
} satisfies Record<string, ImageAsset>;

export type ImageKey = keyof typeof images;
