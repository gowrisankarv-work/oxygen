import type { IconName } from '@/components/icons/Icon';
import type { ServiceSlug } from './services';

export interface Audience {
  id: string;
  label: string;
  icon: IconName;
  intro: string;
  points: string[];
  services: ServiceSlug[];
}

/** "Who we help" (home) and "Which service do I need?" (services page). */
export const audiences: Audience[] = [
  {
    id: 'students',
    label: 'Students',
    icon: 'graduation-cap',
    intro: 'For school and college students facing big choices about streams, courses and colleges.',
    points: [
      'Choose a stream or course that fits your strengths, not just trends',
      'Build a balanced college list and an entrance exam plan',
      'Get honest feedback on applications, SOPs and interviews',
    ],
    services: ['career-guidance', 'admission-expert'],
  },
  {
    id: 'parents',
    label: 'Parents',
    icon: 'users',
    intro: 'For parents who want reliable information to support their child’s decisions.',
    points: [
      'Understand options, costs, timelines and scholarships clearly',
      'Join sessions so the whole family shares one plan',
      'Get straight answers — no pressure, no false promises',
    ],
    services: ['admission-expert', 'career-guidance'],
  },
  {
    id: 'scholars',
    label: 'Research Scholars',
    icon: 'flask',
    intro: 'For PhD aspirants and scholars who want a methodical, ethical mentor.',
    points: [
      'Refine a focused, original and feasible research question',
      'Choose methods and statistics you can confidently defend',
      'Prepare papers for reputable, properly indexed journals',
    ],
    services: ['research-innovations', 'publication-services'],
  },
  {
    id: 'professionals',
    label: 'Working Professionals',
    icon: 'briefcase',
    intro: 'For early-career professionals planning a switch, upskilling or a return to study.',
    points: [
      'Map realistic career moves and the skills they require',
      'Decide between further study and work with clear trade-offs',
      'Refresh your CV, LinkedIn profile and interview approach',
    ],
    services: ['career-guidance', 'admission-expert'],
  },
  {
    id: 'faculty',
    label: 'Faculty & Researchers',
    icon: 'book-open',
    intro: 'For faculty members and researchers who need publication and methodology support.',
    points: [
      'Professional editing and formatting to journal guidelines',
      'Journal selection with predatory and hijacked journal screening',
      'Methodology consultation and research training workshops',
    ],
    services: ['publication-services', 'research-innovations'],
  },
];

/** Quick guide on the services page: "If you are… → we suggest…" */
export const serviceFinder: { need: string; service: ServiceSlug }[] = [
  { need: 'I’m finishing Class 10 or 12 and unsure which stream or course to choose', service: 'career-guidance' },
  { need: 'I know what I want to study and need help getting into the right programme', service: 'admission-expert' },
  {
    need: 'I’m starting or stuck in my PhD and need help with topic, methods or analysis',
    service: 'research-innovations',
  },
  {
    need: 'I have a manuscript ready and want it edited and matched to a reputable journal',
    service: 'publication-services',
  },
];
