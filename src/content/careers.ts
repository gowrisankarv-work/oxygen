/**
 * Job openings for /careers. Leave the array empty to show the "no current openings" state.
 */
export interface Opening {
  id: string;
  title: string;
  type: 'Full-time' | 'Part-time' | 'Freelance' | 'Internship';
  location: string;
  summary: string;
  requirements: string[];
}

export const openings: Opening[] = [
  // PLACEHOLDER — sample openings; delete or replace before launch
  {
    id: 'career-counsellor',
    title: 'Career Counsellor',
    type: 'Full-time',
    location: 'City (on-site / hybrid)', // PLACEHOLDER
    summary:
      'Conduct one-to-one career counselling and assessment debriefs for students and early-career professionals, and help run school workshops.',
    requirements: [
      'Postgraduate degree in Psychology, Education or a related field',
      '2+ years of counselling or student-advising experience',
      'Excellent spoken and written English; a regional language is a plus',
    ],
  },
  {
    id: 'academic-editor',
    title: 'Academic Editor (Freelance)',
    type: 'Freelance',
    location: 'Remote (India)',
    summary: 'Edit and format research manuscripts for reputable journals, following our publication-ethics standards.',
    requirements: [
      'PhD or postgraduate research experience',
      'Strong command of academic English and major citation styles',
      'Familiarity with COPE guidelines and journal screening',
    ],
  },
];

export const careersEmail = 'careers@oxygenedu-hub.example'; // PLACEHOLDER
