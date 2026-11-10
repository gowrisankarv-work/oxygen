/**
 * SAMPLE testimonials. Every item is labelled "Sample" on the site while `isSample: true`.
 * Replace with genuine testimonials (with the person's written consent), then set isSample: false.
 * Use first name + initial only unless the person agrees otherwise.
 */
import type { ServiceSlug } from './services';

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  city: string;
  service: ServiceSlug;
  /** 1–5; shown as stars only when isSample is false. */
  rating?: number;
  isSample: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote:
      'I had six college options and no idea how to compare them. The shortlist report made the trade-offs clear, and the deadline calendar meant I never missed a registration. I felt in control for the first time.',
    name: 'Ananya R.',
    role: 'B.Sc. applicant',
    city: 'City', // PLACEHOLDER
    service: 'admission-expert',
    isSample: true, // PLACEHOLDER
  },
  {
    id: 't2',
    quote:
      'They reviewed four drafts of my SOP and never once rewrote it for me — every comment pushed me to explain my own story better. The final version genuinely sounded like me.',
    name: 'Karthik S.',
    role: 'M.Tech applicant',
    city: 'City', // PLACEHOLDER
    service: 'admission-expert',
    isSample: true, // PLACEHOLDER
  },
  {
    id: 't3',
    quote:
      'As a parent I wanted honest answers about costs and timelines, not a sales pitch. That is exactly what we got, and our daughter made the final decision with full confidence.',
    name: 'Meena V.',
    role: 'Parent',
    city: 'City', // PLACEHOLDER
    service: 'career-guidance',
    isSample: true, // PLACEHOLDER
  },
  {
    id: 't4',
    quote:
      'The assessment session helped me understand why I kept enjoying the design side of my engineering projects. I now have a clear plan towards UX research instead of drifting.',
    name: 'Rahul P.',
    role: 'Final-year B.E. student',
    city: 'City', // PLACEHOLDER
    service: 'career-guidance',
    isSample: true, // PLACEHOLDER
  },
  {
    id: 't5',
    quote:
      'My research question was far too broad. Two sessions later I had a focused topic and a methodology I could actually defend in front of my doctoral committee.',
    name: 'Priya N.',
    role: 'PhD scholar, Education',
    city: 'City', // PLACEHOLDER
    service: 'research-innovations',
    isSample: true, // PLACEHOLDER
  },
  {
    id: 't6',
    quote:
      'I finally understand which statistical tests I used and why. The mentor taught me to run the analysis in R myself instead of handing me numbers I could not explain.',
    name: 'Imran K.',
    role: 'PhD scholar, Management',
    city: 'City', // PLACEHOLDER
    service: 'research-innovations',
    isSample: true, // PLACEHOLDER
  },
  {
    id: 't7',
    quote:
      'They flagged that the journal I had chosen was likely hijacked. Instead, we shortlisted three properly indexed journals, and the tracked-change edits made my paper far clearer.',
    name: 'Lakshmi T.',
    role: 'Assistant Professor',
    city: 'City', // PLACEHOLDER
    service: 'publication-services',
    isSample: true, // PLACEHOLDER
  },
  {
    id: 't8',
    quote:
      'The reviewer-response guidance was excellent. They helped me answer every comment respectfully and clearly, without overstating what my data showed.',
    name: 'Arjun M.',
    role: 'Postdoctoral researcher',
    city: 'City', // PLACEHOLDER
    service: 'publication-services',
    isSample: true, // PLACEHOLDER
  },
];
