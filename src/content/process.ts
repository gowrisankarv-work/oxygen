import type { IconName } from '@/components/icons/Icon';

export interface ProcessStep {
  title: string;
  short: string;
  detail: string;
  icon: IconName;
  /** What you can expect at this stage (How We Work page). */
  expect: string[];
}

/** The 5-step engagement process (home timeline + How We Work page). */
export const processSteps: ProcessStep[] = [
  {
    title: 'Free Consultation',
    short: 'A no-obligation conversation to understand where you are and where you want to go.',
    detail:
      'We start with a free 20–30 minute call or meeting. You share your situation and questions; we listen, ask clarifying questions and explain how we might help — or tell you honestly if you do not need us.',
    icon: 'message-circle',
    expect: [
      '20–30 minutes by phone, video or in person',
      'No obligation and no sales pressure',
      'Honest view of whether we are the right fit',
    ],
  },
  {
    title: 'Needs Assessment',
    short: 'A closer look at your profile, goals, constraints and timelines.',
    detail:
      'If you choose to continue, we review your academic records, drafts, data or manuscript as relevant, and agree what success looks like for you. For career guidance this is where assessments take place.',
    icon: 'clipboard-list',
    expect: ['Review of your documents or work', 'Assessments where relevant', 'Clear definition of goals and scope'],
  },
  {
    title: 'Personalised Plan',
    short: 'A written plan with tasks, milestones, responsibilities and pricing.',
    detail:
      'You receive a written plan that sets out exactly what we will do, what you will do, the milestones and deadlines, and the fees. Nothing begins until you have read and agreed to it.',
    icon: 'route',
    expect: ['Written scope and timeline', 'Transparent fees before you commit', 'Named point of contact'],
  },
  {
    title: 'Guided Execution',
    short: 'Regular sessions, reviews and feedback as you work through the plan.',
    detail:
      'We work through the plan together: sessions, document reviews, edits, mock interviews or analysis guidance. You stay the author and decision-maker; we keep you on track and raise the quality of the work.',
    icon: 'users',
    expect: [
      'Scheduled sessions and reviews',
      'Written feedback you can refer back to',
      'Progress updates against milestones',
    ],
  },
  {
    title: 'Ongoing Support',
    short: 'Help with results, decisions, revisions and next steps.',
    detail:
      'Support continues through results, offers, reviewer comments or interviews, as agreed in your plan. Many clients return at the next turning point — and we are always happy to hear how things went.',
    icon: 'refresh',
    expect: [
      'Support through outcomes and decisions',
      'Revision and follow-up sessions as agreed',
      'A clear handover at the end of the engagement',
    ],
  },
];

export const turnaround = [
  // PLACEHOLDER — confirm these service levels before launch
  { label: 'Reply to enquiries', value: 'Within 1 working day' },
  { label: 'Free consultation scheduled', value: 'Within 2–3 working days' },
  { label: 'Written plan after assessment', value: 'Within 3–5 working days' },
  { label: 'Document / SOP review', value: '3–5 working days per draft' },
  { label: 'Manuscript editing', value: '5–10 working days, depending on length' },
];

export const channels: { title: string; text: string; icon: IconName }[] = [
  {
    title: 'Phone & video calls',
    text: 'Scheduled sessions at times that suit school, college or work hours.',
    icon: 'phone',
  },
  {
    title: 'WhatsApp',
    text: 'Quick questions and reminders between sessions, during business hours.',
    icon: 'whatsapp',
  },
  { title: 'Email', text: 'Documents, written feedback and formal updates — everything on record.', icon: 'mail' },
  {
    title: 'In person',
    text: 'Meetings at our office by appointment, for those who prefer face to face.',
    icon: 'map-pin',
  },
];
